  $(document).ready(function() {
    $('#contact_form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            first_name: {
                validators: {
                        stringLength: {
                        min: 2,
                    },
                        notEmpty: {
                        message: 'Please enter your First Name'
                    }
                }
            },
             last_name: {
                validators: {
                     stringLength: {
                        min: 2,
                    },
                    notEmpty: {
                        message: 'Please enter your Last Name'
                    }
                }
            },
			 user_name: {
                validators: {
                     stringLength: {
                        min: 6,
                        max: 18,
                        message: 'Usernames must be between 6 and 18 characters in length.'
                    },
                    notEmpty: {
                        message: 'Please enter your Username'
                    },
                   regexp: {
                      regexp: '^[a-z][a-zA-Z0-9]*$',
                      message: 'Usernames can only contain letters and numbers, and must start with a lower-case letter.'
                   }
                }
            },
			 user_password: {
                validators: {
                     stringLength: {
                        min: 6,
                        message: 'Password must be at least 6 characters.'
                    },
                    notEmpty: {
                        message: 'Please enter your Password'
                    },
                    identical: {
                        field: 'confirm_password',
                        message: 'Password and confirmation not the same.'
                    }

                }
            },
			confirm_password: {
                validators: {
                     stringLength: {
                        min: 6,
                        message: 'Password must be at least 6 characters.'
                    },
                    notEmpty: {
                        message: 'Please confirm your Password'
                    },
                    identical: {
                        field: 'user_password',
                        message: 'Password and confirmation not the same.'
                    }

                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: 'Please enter your Email Address'
                    },
                    emailAddress: {
                        message: 'Please enter a valid Email Address'
                    }
                }
            },
             other_info: {
                validators: {
                   stringLength: {
                       max: 200,
                       message: 'Other information must be less than 200 characters.'
                     }
                }
            }
         }

        })
        .on('status.field.bv', function(e, data) {
	  console.log("hellooooooo"); // why does this not work...
            /*$('#success_message').slideDown({ opacity: "show" }, "slow") // Do something ...
                $('#contact_form').data('bootstrapValidator').resetForm();

            // Prevent form submission
            e.preventDefault();

            // Get the form instance
            var $form = $(e.target);

            // Get the BootstrapValidator instance
            var bv = $form.data('bootstrapValidator');

            // Use Ajax to submit form data
            $.post($form.attr('action'), $form.serialize(), function(result) {
                console.log(result);
            }, 'json');*/
         });

    /*.on( 'status.field.bv', function( e, data ) {
	console.log("is this thing on?");
    let $this = $( this );
    let formIsValid = true;

    $( '.form-group', $this ).each( function() {
        if($( this ).hasClass('required')) {
          formIsValid = formIsValid && $( this ).hasClass( 'has-success' );
	  console.log(formIsValid);
	}
    });

    $( '#submit_button', $this ).attr( 'disabled', !formIsValid );
});*/
	
});
