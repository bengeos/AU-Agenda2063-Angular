
function config($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/neophyte/mentor");
    $stateProvider
        .state('neophyte', {
            abstract: true,
            url: "/neophyte",
            templateUrl: "views/common/content.html",
        })
        .state('neophyte.mentor', {
            url: "/mentor",
            templateUrl: "views/mentor.html",
            controller: 'MentorCtrl',
            data: { pageTitle: 'Mentor' }
        })
        .state('neophyte.mentee', {
            url: "/mentee",
            templateUrl: "views/mentee.html",
            controller: 'MenteeCtrl',
            data: { pageTitle: 'Mentee' }
        })
        .state('neophyte.profile', {
            url: "/profile",
            templateUrl: "views/profile.html",
            controller: 'ProfileCtrl',
            data: { pageTitle: 'Profile' }
        })
        .state('login', {
            abstract: true,
            url: "/user",
            templateUrl: "views/login.html"
        })
        .state('login.signin', {
            url: "/login",
            templateUrl: "views/login.html",
            controller: 'LogInCtrl',
            data: { pageTitle: 'Log in' }
        })
}
angular
    .module('neophyte')
    .config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });