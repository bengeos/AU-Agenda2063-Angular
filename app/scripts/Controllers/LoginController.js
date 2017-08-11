/**
 * Created by Roger on 8/7/17.
 */

angular
    .module('neophyte')
    .controller('LogInCtrl', function($scope, $location, $state, $rootScope,$mdDialog) {
        $scope.login = true;
        $scope.signup = false;
        $scope.isAdmin = false;

        var database = firebase.database();
        var databaseRef = database.ref();
        var userRef = databaseRef.child("users");

        firebase.auth().onAuthStateChanged(function (user) {

            if(user){
                console.log("Sign in",user.uid);
                getUserState(user.uid);
                $rootScope.user_id = user.uid;

                $state.go("neophyte.news");

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
                $rootScope.user_id = snap.key;

                if(userData.isAdmin){
                    $rootScope.isAdmin = true;
                    $scope.isAdmin = true;
                }
                else{
                    $rootScope.isAdmin = false;
                    $scope.isAdmin = false;
                }

            }).then(function(){

            });
        }

        $scope.userSignIn = function (Users) {
            console.log(Users);
            const promise = firebase.auth().signInWithEmailAndPassword(Users.Email,Users.Password);
        };

        $scope.userSignUp = function(User){

            firebase.auth().createUserWithEmailAndPassword(User.Email, User.Password).then(function(authData){

                    userRef.child(authData.uid).set({
                        first_name: User.FirstName,
                        last_name: User.LastName,
                        email: User.Email,
                        isAdmin: false
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

