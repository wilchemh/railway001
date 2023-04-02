angular.module('loginController', ['ngAnimate'])
	.controller('loginController', ['$rootScope','$scope', '$http', '$filter', '$location', '$routeParams',
		function($rootScope, $scope, $http, $filter, $location, $routeParams ) {
            
            //Initialize Scope variables
            $scope.errorThrown = false;
            $scope.successThrown = false;
            $scope.errorMessage = null;
            $scope.submitting = false;
            $scope.dataLogin = {};
            $scope.redirect = '#'
            $scope.showSignup = 'signin';
            $scope.dataSignup = {};
            $scope.coupon_applied = false;
            $scope.plan_total = null;
            $scope.plan_discount = 0;



            if($routeParams.code === 'profile') {
                $scope.redirect = "#!profile"
            }


            $scope.signIn = function() {

                //Reset Error Messages
                $scope.errorThrown = false;
                $scope.successThrown = false;
                $scope.errorMessage = null;

                // Try to Authenticate User
                $http.post('authentication/authenticateUser', {
                    email: $scope.dataLogin.email,
                    password: $scope.dataLogin.password
                }).then(function( res ) {

                    if( res.data.success === true ) {
                    
                        $scope.errorThrown = false;
                        $scope.errorMessage = null;
                        $rootScope.loggedin = true;
                        $rootScope.user = res.data.data.userID;
                        $rootScope.type = res.data.data.type;
                        
                        window.location.href = $scope.redirect;
                    
                    } else {

                        $scope.errorThrown = true;
                        $scope.errorMessage = res.data.msg;
                        toastr.error(res.data.msg, 'Login Error!')

                    }
                
                });

            }
            
            $scope.showSignUpForm = function(){

                // Reset Error Messages
                $scope.errorThrown = false;
                $scope.successThrown = false;
                $scope.errorMessage = null;

                // Show Login Form
                $scope.showSignup = 'signup_p3';

            }

            $scope.hideSignUpForm = function(){

                //Reset Error Messages
                $scope.errorThrown = false;
                $scope.successThrown = false;
                $scope.errorMessage = null;

                // Show Login Form
                $scope.showSignup = 'signin';

            }

            $scope.signUp2 = function(){
                
                //Disable interaction until submission is either a success for failure
                $scope.submitting = true;

                //clear error messages
                $scope.errorThrown = false;
                $scope.errorMessage = '';
                var errorElement = document.getElementById('card-errors');
                errorElement.textContent = '';
                
                //validate client side inputs
                var errorFound = $scope.validateSignUp()
                if (errorFound) {
                    $scope.submitting = false;
                    return false;
                }

                //Validate email/acct does not already exist
                $http.post('authentication/verifyNewAccount', {
                    email:      $scope.dataSignup.email
                }).then(function( res ) {
                    if( res.data.success === false ) {
                        $scope.errorThrown = true;
                        $scope.errorMessage = res.data.msg;
                        $scope.submitting = false;
                        return false
                    } else {

                        
                        //email is unique - Validate Coupon Code
                        $http.post('authentication/verifyCoupon', {
                            code:      $scope.dataSignup.code || 'none'
                        }).then(function( res ) {
                            if( res.data.success === false ) {
                                $scope.errorThrown = true;
                                $scope.errorMessage = res.data.msg;
                                $scope.submitting = false;
                                return false
                            } else {
                                //All Good Get stripe source token
                                stripe.createToken(card).then(function(result) {
                                    if (result.error) {
                                    // Inform the customer that there was an error.
                                    var errorElement = document.getElementById('card-errors');
                                    errorElement.textContent = result.error.message;
                                    
                                    //Update end submitting block and call apply since we are outside of ng context
                                    $scope.submitting = false;
                                    $scope.$apply();
                                    } else {                              
                                        // Subscribe User
                                        $http.post('authentication/signUpAndSubscribe', {
                                            fname:      $scope.dataSignup.fname,
                                            lname:      $scope.dataSignup.lname,
                                            email:      $scope.dataSignup.email,
                                            password:   $scope.dataSignup.password,
                                            plan_id:    $scope.dataSignup.plan,
                                            code:       $scope.dataSignup.code || null,
                                            token:      result.token.id
                                        }).then(function( res ) {
                                            
                                            if( res.data.success === true ) {
                                                $scope.errorThrown = false;
                                                $scope.errorMessage = null;
                                                $rootScope.loggedin = true;
                                                $rootScope.user = res.data.data.userID;
                                                $rootScope.type = res.data.data.type;
                                                window.location.href = "#";
                                            } else {
                                                if(res.data.msg === 0){
                                                    $scope.submitting = false;
                                                    $scope.errorThrown = true;
                                                    $scope.errorMessage = "Create Account Error - Please refresh page and try again";
                                                    toastr.error(res.data.msg, 'Create Account Error!')          
                                                }else{
                                                    $scope.errorThrown = false;
                                                    $scope.errorMessage = null;
                                                    $rootScope.loggedin = true;
                                                    $rootScope.user = res.data.data.userID;
                                                    $rootScope.type = res.data.data.type;
                                                    $rootScope.signUpError = res.data.msg || 0;
                                                    window.location.href = "#!/profile/" + $rootScope.signUpError;  
                                                }
                                                
                                            }
                                        }).catch(function (data) {
                                            $scope.submitting = false;
                                            $scope.errorThrown = true;
                                            $scope.errorMessage = "Request Failed - Please refresh page and try again";
                                            toastr.error(res.data.msg, 'Create Account Error!')  
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }

            $scope.validateSignUp = function(){

                // Reset Error Messages
                $scope.errorThrown = false;
                $scope.successThrown = false;
                $scope.errorMessage = null;

                // Validate email and Passwords Match
                if (!$scope.dataSignup.fname || $scope.dataSignup.fname.length === 0){
                    $scope.errorThrown = true;
                    $scope.errorMessage = 'First Name is a required field';
                    return true;
                }

                if (!$scope.dataSignup.lname || $scope.dataSignup.lname.length === 0){
                    $scope.errorThrown = true;
                    $scope.errorMessage = 'Last Name is a required field';
                    return true;
                }

                if (!$scope.dataSignup.email || $scope.dataSignup.email.length === 0){
                    $scope.errorThrown = true;
                    $scope.errorMessage = 'Email is a required field';
                    return true;
                }

                if (!$scope.dataSignup.password || $scope.dataSignup.password.length === 0){
                    $scope.errorThrown = true;
                    $scope.errorMessage = 'Password is a required field';
                    return true;
                }

                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($scope.dataSignup.email)){
                    $scope.errorThrown = true;
                    $scope.errorMessage = 'Email is not in valid format';
                    return true;
                }

                var mediumRegex = new RegExp("^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{8,30}$");
                if (!mediumRegex.test($scope.dataSignup.password)){
                    $scope.errorThrown = true;
                    $scope.errorMessage = 'Password must be between 8 and 30 characters and include both letters and numbers';
                    return true;
                }

                if ($scope.dataSignup.email !== $scope.dataSignup.email2){
                    $scope.errorThrown = true;
                    $scope.errorMessage = 'Email and Confirm email do not match';
                    return true;
                }

                if ($scope.dataSignup.password !== $scope.dataSignup.password2){
                    $scope.errorThrown = true;
                    $scope.errorMessage = 'Password and confirm password do not match';
                    return true;
                }

                if (!$scope.dataSignup.plan || $scope.dataSignup.fname.length === 0){
                    $scope.errorThrown = true;
                    $scope.errorMessage = 'Subscription Plan is a required field';
                    return true;
                }

                return false;
            }

            $scope.resetPasswordRequest = function(){
                // Reset Error Messages
                $scope.errorThrown = false;
                $scope.successThrown = false;
                $scope.errorMessage = null;
                $scope.resetEmail = undefined
                $scope.submitting = false;

                // Show Login Form
                $scope.showSignup = 'signup_p4';
            }

            $scope.requestResetCode = function(){
                $scope.submitting = true;
                
                //clear error messages
                $scope.errorThrown = false;
                $scope.errorMessage = '';



                //Validate email/acct does not already exist
                $http.post('authentication/requestResetCode', {
                    email:      $scope.resetEmail
                }).then(function( res ) {

                    if( res.data.success === false ) {
                        $scope.errorThrown = true;
                        $scope.errorMessage = res.data.msg;
                        $scope.submitting = false;
                        return false
                    } else {
                        $scope.successThrown = true;
                        $scope.errorMessage = res.data.msg;
                        $scope.submitting = true;  // Leave True so user doesnt request another reset code without leaving this screen
                        return true

                    }
                });









            }
            

		} 
	]);