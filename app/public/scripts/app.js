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
        controller: 'PsCtrl',
        resolve: {
          "PsService": function(PsService) {
            return PsService;
          } 
        }
      })
      .otherwise({
        redirectTo: '/processes'
      });
  })
  .controller('mainCtrl', ['$scope', 'PsService', 'TempService', function ($scope, PsService, TempService) {
    window.setTimeout(function() {
      PsService.listen();
    }, 2000);
    
    $scope.$on('PsService_changed', function() {
      $scope.$apply(function (){
        $scope.pCPU_sum = PsService.pCPU_sum;
      });
    });
    $scope.$on('PsService_init', function() {
      $scope.pCPU_sum = PsService.pCPU_sum;
    });
    $scope.$on('TempService_init', function() {
      $scope.temp = TempService.temp;
    });
    TempService.loadTemperature();
  }])
  .factory('PsService', function ($http, $rootScope) {
    return {
      processes: undefined,
      pCPU_sum: undefined,
      listen: function() {
        console.log('started listening to process changes');
        var self = this;
        var socket = io();
        socket.on('processes', function(data) { 
          self.processes = data;
          self.pCPU_sum = self.calc_pCPU_Sum(data);
          $rootScope.$broadcast('PsService_changed');
          console.log('refreshed processes');
        });
      },
      loadProcesses: function() {
        console.log('initializing processes');
        var self = this;
        $http.get('/api/ps').success(function (data) {
          self.processes = data;
          self.pCPU_sum = self.calc_pCPU_Sum(data);
          $rootScope.$broadcast('PsService_init');
          console.log('initialized processes');
        });
      },
      calc_pCPU_Sum: function (processes) {
        var pCPU_sum = 0;

        angular.forEach(processes, function(el, index){
          pCPU_sum += el.pCPU;
        });

        return Math.round(pCPU_sum * 100.0) / 100.0;
      }
    }
  }).factory('TempService', function ($http, $rootScope){
    return {
      temp: undefined,
      loadTemperature: function() {
        var self = this;
        $http.get('/api/temp').success(function (data){
          self.temp = data;
          $rootScope.$broadcast('TempService_init');
        });
      }
    }
  });

