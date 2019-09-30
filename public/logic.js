
// some of the magic sauce that makes socket.io work behind a subfolder reverse-proxy
// (nginx .conf must be setup to proxy /acct_request_socket/  to localhost:port that the node app is running on
var socket = io.connect(window.location.protocol + "//" + window.location.hostname, {path: '/acct_request_socket'});

// old demo functionality
// When the client gets something from the server, we log it to the console
//socket.on('from_server', function(data) {
//  console.log(data);
//})

// The page can call this function to send a message too the server
//function sendMessage() {
//  socket.emit('from_client', {data1: "hi", data2: "there"})
//}


function submitClicked() {
  var first_name = document.getElementById("first_name").value;
  var last_name = document.getElementById("last_name").value;
  var email = document.getElementById("email").value;
  var user_name = document.getElementById("user_name").value;
  var user_password = document.getElementById("user_password").value;
  var other_info = document.getElementById("other_info").value;
  // we can emit a message and also send a callback function that will be called by the server, this can work with the page ;)
  socket.emit('attempt_process', {first_name: first_name, last_name: last_name, email: email, user_name: user_name, user_password: user_password, other_info: other_info}, 
                                 function(result) {
                                    if(result.type == "stdout") { 
                                       bootbox.alert({ title: "Success",
                                                       message: result.message, 
                                                       className: "successbox",
                                                       callback: function() {window.location.href = "https://" + window.location.hostname; } }) 
                                    } else {
                                       bootbox.alert({ title: "Error",
                                                       message: result.message, 
                                                       className: "errorbox"}) 
                                    }
                                 }
  )
}

// this tells the server to check the recaptcha, 
function recaptcha_data_callback(token) {
  socket.emit('check_recaptcha', token)
}

socket.on('recaptcha_result', function(from_server) {
  if(from_server.result == "good") {
    console.log("good recaptcha result.")
  } else  {
    console.log("bad recaptcha result.")
  }
})

socket.on('error_message', function(from_server) {
  alert(from_server.message);
})



