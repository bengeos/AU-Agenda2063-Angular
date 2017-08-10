/**
 * Created by Roger on 8/9/17.
 */

angular
    .module('neophyte')
    .controller('MentorCtrl', function($scope,$timeout,$filter,$state,$rootScope,$mdDialog) {
        var user = firebase.auth().currentUser;
        if (!user) {
            console.log("Invalid user");
            $state.go("login.signin");
        }
        $scope.userSignOut = function (Users) {
            firebase.auth().signOut().then(function () {
                console.log("Sign out");
            }, function (error) {
                console.log("Sign out error");
            });
        };

        var database = firebase.database();
        var databaseRef = database.ref();
        var userRef = databaseRef.child("users");
        var storage = firebase.storage();

        $scope.image_url = "";
        $scope.users = new Array();

        userRef.on('value', function (snapshot) {
            $scope.users = new Array();
            $timeout(function () {
                snapshot.forEach(function(childSnapshot) {
                    var parentKey = childSnapshot.key;
                    var childData = childSnapshot.val();
                    childData.ParentID = parentKey;

                    if(childData.mentor){
                        var currentUserState = $rootScope.user_stage_id;

                        if(childData.state  == (currentUserState + 1) ){
                            $scope.users.push(childData);

                        }
                    }
                });
            });
        });


        $scope.showConfirm = function(ev, User) {
            var confirm = $mdDialog.confirm()
                .title('Would you like to select this mentor?')
                .textContent('Click Yes to continue')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Yes, select')
                .cancel('No, cancel it!');

            $mdDialog.show(confirm).then(function() {
                performMentorSelect(User);
            }, function() {

            });
        };

        function performMentorSelect(User){
            console.log("Selected user " + User.ParentID);
            var user1 = {userId: $rootScope.user_id};
            databaseRef.child("mentorMentee").child(User.ParentID).child($rootScope.user_id).set(user1);
        }

    });