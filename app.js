var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var basicAuth = require('express-basic-auth');
var fs = require('fs');

reCAPTCHA=require('recaptcha2')

var contents = fs.readFile('/opt/acct_request_app/config.json', 'utf8', function(err, contents) {
  config = JSON.parse(contents);
});


recaptcha=new reCAPTCHA({
  siteKey: config.recaptcha_siteKey,
  secretKey: config.recaptcha_secretKey
})



// Ensure this is before any other middleware or routes
//app.use(basicAuth({
//  authorizer: myAuthorizer,
//  challenge: true,
//  unauthorizedResponse: getUnauthorizedResponse
//}));

function myAuthorizer(username, password) {
  return password === config.acct_request_options.password
}

function getUnauthorizedResponse(req) {
	    return req.auth
	        ? ('Credentials for ' + req.auth.user + ' rejected')
	        : 'No credentials provided'
}
// serve file requests from the public folder (html, javascript, etc)
app.use(express.static('public'))


io.on('connection', function(socket){
  console.log('user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.emit('debug', {msg: "new connection"})
  socket.recaptcha_ok = false; // TODO true just for testing; I also turned off the recaptcha on the page, in prod enable it and set this false

  // so I guess this should make the button clickable (and probably also a "i agree" checkbox)
  socket.on('check_recaptcha', function(input) {
    recaptcha.validate(input)
	.then(function(){
	  // validated and secure
          // add a property to the socket itself maybe, to indicate recaptcha validated? since the socket object is connection-specific.
          //  see https://stackoverflow.com/questions/37651817/adding-a-variable-to-sockets-in-socket-io
          socket.recaptcha_ok = true;
          // console.log("socket.recaptcha_ok: ", socket.recaptcha_ok);
          socket.emit('recaptcha_result', {result: "good"})
	})
	.catch(function(errorCodes){
	  // invalid
          socket.emit('recaptcha_result', {result: "bad"})
	  //console.log(recaptcha.translateErrors(errorCodes));// translate error codes to human readable text
	});
  })

  socket.on('attempt_process', function(from_client, callback) {
    if(socket.recaptcha_ok == true) {

        // we can run commands! 
        const { spawn } = require('child_process');
        //const ls = spawn('ls', ['-lh', '/usr']);
        const process = spawn(__dirname + '/add_request.py', [from_client.first_name, from_client.last_name, from_client.email, from_client.user_name, from_client.user_password, '--other', from_client.other_info]);

        // making the assumption that the callback makes use of an object with 'type' and 'message' fields
        process.stdout.on('data', (data) => {
            callback({type: "stdout", message: "Success! You will receive an email once the instructor has enabled access for you."});
        });

        process.stderr.on('data', (data) => {
            callback({type: "stderr", message: data.toString('utf8')});
        });

        //process.on('close', (code) => {
        //    callback(`child process exited with code ${code}`);
        //});
    } else {
      socket.emit('error_message', {message: 'Recaptcha not completed.'})
    }
  })

  // old demo functionality
  // when we get a message from the client, we can do stuff with it, and potentially send a message back
  //socket.on('from_client', function(input) {
  //  console.log(input);
  //  socket.emit('from_server', {response: "Success"})
  //});
});


http.listen(5002, function(){
  console.log('listening on *:5002');
});
