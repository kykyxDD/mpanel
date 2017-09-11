angular.module("mpanelApp").config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
           templateUrl: 'home.html',
           controller: 'homeController'
       })
       .when('/user', {
           templateUrl: 'user.html',
           controller: 'userController'
       })
       .when('/project', {
           templateUrl: 'project.html',
           controller: 'projectController'
       })
       .when('/fabric', {
           templateUrl: 'fabric.html',
           controller: 'fabricController'
       })
       .when('/fittings', {
           templateUrl: 'fitting.html',
           controller: 'fittingController'
       })
       .when('/shape', {
           templateUrl: 'shape.html',
           controller: 'shapeController'
       })
       .when('/review', {
           templateUrl: 'review.html',
           controller: 'reviewController'
       })
        .when('/seams', {
           templateUrl: 'seams.html',
           controller: 'seamsController'
       })
        .when('/pattern', {
           templateUrl: 'pattern.html',
           controller: 'patternController'
       })
        .otherwise({
          redirectTo: '/'
        });


    //$locationProvider.html5Mode(true);
});