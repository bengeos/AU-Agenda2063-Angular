
function MainCtrl() {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyC0AY-Sz_QSfkkcQPgJxczAaJh-GoOIPDI",
        authDomain: "neophyte-sample.firebaseapp.com",
        databaseURL: "https://neophyte-sample.firebaseio.com",
        projectId: "neophyte-sample",
        storageBucket: "neophyte-sample.appspot.com",
        messagingSenderId: "660363107196"
    };

    firebase.initializeApp(config);

    console.log("Main Ctrl Loaded");
};
angular
    .module('neophyte')
    .controller('MainCtrl', MainCtrl)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });