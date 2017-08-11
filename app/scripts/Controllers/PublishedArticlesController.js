
angular
    .module('neophyte')
    .controller('PublishedArticlesCtrl', function($scope,$timeout,$filter,$state, $rootScope) {
        console.log("controller loaded");
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
        var NewsRef = databaseRef.child("published_articles");
        var storage = firebase.storage();

        $scope.isAdmin = $rootScope.isAdmin;
        $scope.isAdding = true;
        $scope.image_url = "";
        $scope.News = new Array();

        console.log("userId " + $rootScope.user_id);

        NewsRef.on('value', function (snapshot) {
            $scope.News = new Array();
            $timeout(function () {
                snapshot.forEach(function(childSnapshot) {
                    var parentKey = childSnapshot.key;
                    var childData = childSnapshot.val();
                    childData.ParentID = parentKey;
                    $scope.News.push(childData);
                });

                console.log("All articles " + $scope.News );
            });
        });

        var uploader = document.getElementById("upload_button");
        var progress_bar = document.getElementById("progress_bar");
        $scope.image_url = "";
        uploader.addEventListener('change', function (e) {
            var file = e.target.files[0];
            var storageRef = storage.ref('images/'+(new Date()));
            var task = storageRef.put(file);

            task.on('state_changed',
                function progress(snapshot) {
                    var percentage = (snapshot.bytesTransferred / snapshot.totalBytes);
                    console.log(percentage);
                    progress_bar.value = percentage;
                },
                function error() {

                },
                function complete(snapshot) {
                    console.log("Upload Completed: ",task.snapshot.downloadURL);
                    $scope.image_url = task.snapshot.downloadURL;
                }
            )

        });


        $scope.addNewNews = function (newNews) {
            console.log("Add New News: ",newNews);

            //var ts = Math.round((new Date()).getTime() / 1000);
            //$filter('date')(new Date(), 'dd/MM/yyyy');
            var now_date = new Date().getTime();

            if($scope.isAdmin) {
                if ($scope.image_url) {
                    newNews.time = now_date;
                    newNews.newsimg = $scope.image_url;

                    console.log("Adding New News: ", newNews);
                    NewsRef.push(newNews);
                    progress_bar.value = 0;
                    $scope.News_Item = {};
                }
            }

            else{
                if ($scope.image_url) {
                    newNews.time = now_date;
                    newNews.newsimg = $scope.image_url;

                    console.log("Adding New News: ", newNews);
                    databaseRef.child("unpublished_articles").push(newNews);
                    progress_bar.value = 0;
                    $scope.News_Item = {};
                }
            }

        };

        $scope.addEditedNews = function (newNews) {

            console.log("Adding New News: ",newNews);
            if(newNews.newsimg){
                NewsRef.child(newNews.ParentID).set(newNews);
            }

            $scope.News_Item = {};
        };

        $scope.removeNews = function (news) {
            NewsRef.child(news.ParentID).remove();
            $scope.News_Item = {};
        };


        $scope.editNews = function (editNews) {
            console.log("Edit New News: ",editNews);
            $scope.isAdding = false;
            $scope.isEditing = true;
            $scope.isDeleting = false;
            console.log("editting Album",editNews);
            $scope.News_Item = editNews;
        };
        $scope.deleteNews = function (editNews) {
            console.log("Delete Album: ",editNews);
            $scope.isAdding = false;
            $scope.isEditing = false;
            $scope.isDeleting = true;
            $scope.News_Item = editNews;
        };
        $scope.cancelTask = function () {
            console.log("Cancel Task: ");
            $scope.isEditing = false;
            $scope.isAdding = true;
            $scope.isDeleting = false;
            $scope.News_Item = {};
        };
    });