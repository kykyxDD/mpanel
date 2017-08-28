angular.module("mpanelApp").config(function($routeProvider, $locationProvider) {
   $routeProvider
        .when('/', {
           templateUrl: './html/home.html',
           // templateUrl:'viewStudents.htm',
           controller: 'homeController'
       })
       .when('/user', {
           templateUrl: './html/user.html',
           // templateUrl:'viewStudents.htm',
           controller: 'userController'
       })
       .when('/project', {
           templateUrl: './html/project.html',
           // templateUrl:'viewStudents.htm',
           controller: 'projectController'
       })
       .when('/fabric', {
           templateUrl: './html/fabric.html',
           // templateUrl:'viewStudents.htm',
           controller: 'fabricController'
       })
       .when('/fittings', {
           templateUrl: './html/fitting.html',
           // templateUrl:'viewStudents.htm',
           controller: 'fittingController'
       })
       .when('/shape', {
           templateUrl: './html/shape.html',
           // templateUrl:'viewStudents.htm',
           controller: 'shapeController'
       })
       .when('/review', {
           templateUrl: './html/review.html',
           // templateUrl:'viewStudents.htm',
           controller: 'reviewController'
       })
        .when('/seams', {
           templateUrl: './html/seams.html',
           // templateUrl:'viewStudents.htm',
           controller: 'seamsController'
       })
        .when('/pattern', {
           templateUrl: './html/pattern.html',
           // templateUrl:'viewStudents.htm',
           controller: 'patternController'
       });

    //$locationProvider.html5Mode(true);
})