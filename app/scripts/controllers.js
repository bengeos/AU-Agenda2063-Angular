
function MainCtrl() {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAm_CG2_L_J0jOEk6cIkad4xkaiXuf7gyM",
        authDomain: "agendaafrica-370bd.firebaseapp.com",
        databaseURL: "https://agendaafrica-370bd.firebaseio.com",
        projectId: "agendaafrica-370bd",
        storageBucket: "agendaafrica-370bd.appspot.com",
        messagingSenderId: "48863795461"
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