/**
 * Created by Roger on 8/7/17.
 */

angular
    .module('neophyte')
    .controller('LogInCtrl', function($scope, $location, $state, $rootScope,$mdDialog) {
        $scope.login = true;
        $scope.signup = false;

        var database = firebase.database();
        var databaseRef = database.ref();
        var userRef = databaseRef.child("users");

        firebase.auth().onAuthStateChanged(function (user) {

            if(user){
                console.log("Sign in",user.uid);
                getUserState(user.uid);
                $rootScope.user_id = user.uid;

                if($rootScope.isMentee){
                    $state.go("neophyte.mentor");

                }
                else if ($rootScope.isMentor){
                    $state.go("neophyte.mentee");
                }

            }
            else {
                $state.go("login.signin");
                console.log("Not Sign in");
            }
        });

        function getUserState(userID){

            userRef.child(userID).once('value', function(snap){

                var userData =  snap.val();

                $rootScope.user_name = userData.first_name;


                if(userData.mentor){
                    $rootScope.isMentor = true;
                    $rootScope.isMentee = false;
                }
                else{
                    $rootScope.isMentor = false;
                    $rootScope.isMentee = true;
                }

                if(userData.state == 0){
                    $rootScope.user_stage = "New";
                    $rootScope.user_stage_id = 0;
                }
                else if(userData.state == 1){
                    $rootScope.user_stage = "Silver";
                    $rootScope.user_stage_id = 1;
                }

                else if(userData.state == 2){
                    $rootScope.user_stage = "Gold";
                    $rootScope.user_stage_id = 2;
                }

                else if(userData.state == 3){
                    $rootScope.user_stage = "Gold";
                    $rootScope.user_stage_id = 3;
                }

                else if(userData.state == 4){
                    $rootScope.user_stage = "Platinum";
                    $rootScope.user_stage_id = 4;
                }

            }).then(function(){

                if($rootScope.isMentee){
                    $state.go("neophyte.mentor");

                }
                else if ($rootScope.isMentor){
                    $state.go("neophyte.mentee");
                }
            });
        }

        $scope.userSignIn = function (Users) {
            console.log(Users);
            const promise = firebase.auth().signInWithEmailAndPassword(Users.Email,Users.Password);
        };


        $scope.userSignUp = function (Users) {
            firebase.auth().createUserWithEmailAndPassword(Users.Email, Users.Password).catch(function(error) {

                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorMessage);
                // ...

            });

        };

        $scope.SignUpTest = function(User){

            firebase.auth().createUserWithEmailAndPassword(User.Email, User.Password).then(function(authData){

                    userRef.child(authData.uid).set({
                        first_name: User.FirstName,
                        last_name: User.LastName,
                        email: User.Email,
                        mentor: false,
                        pic_url:"http://demo.walkinsights.com/images/user.cf4d84ae.png",
                        state: 0,
                        skills:"Programing",
                        short_bio: "My Life is awesome"
                    });

            });

        };


        $scope.userSignOut = function (Users) {
            firebase.auth().signOut().then(function () {
                console.log("Sign out");
            }, function (error) {
                console.log("Sign out error");
            });
        };


        $scope.changeToLogin = function(){
            if($scope.signup == true){
                $scope.login = true;
                $scope.signup = false;
            }
        };

        $scope.changeToSignup = function(){
            if($scope.login){
                $scope.login = false;
                $scope.signup = true;
            }
        };



        $scope.showAbout = function(ev) {
            $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'views/dialog/aboutDialog.tmpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true,
                    fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                })
                .then(function(answer) {

                }, function() {

                });
        };


        $scope.showContact = function(ev) {
            $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'views/dialog/contactDialog.tmpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true,
                    fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                })
                .then(function(answer) {

                }, function() {

                });
        };

        function DialogController($scope, $mdDialog) {
            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

        }


    });

