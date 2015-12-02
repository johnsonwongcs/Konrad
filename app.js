var app = angular.module('MLB', ['ngRoute','ngCookies']);


  app.config(function($routeProvider) {
    $routeProvider
    .when('/home', {
      templateUrl: 'home.html',
      controller: 'homeCtrl as Ctrl'
    })
    .when('/details/:index', {
      templateUrl: 'gameDetails.html',
      controller: 'gameDetailsCtrl as Ctrl'
    })
    .when('/games', {
      templateUrl: 'games.html',
      controller: 'getDateCtrl as Ctrl'
    })
    .otherwise({
      redirectTo: '/home'
    });
  });


