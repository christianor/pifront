'use strict';

/**
 * @ngdoc overview
 * @name pifrontApp
 * @description
 * # pifrontApp
 *
 * Main module of the application.
 */
var pifrontApp = angular
  .module('pifrontApp', [
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/processes', {
        templateUrl: 'views/ps.html',
        controller: 'PsCtrl'
      })
      .otherwise({
        redirectTo: '/processes'
      });
  });
