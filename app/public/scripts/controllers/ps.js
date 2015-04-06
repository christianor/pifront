 'use strict';

/**
 * @ngdoc function
 * @name pifrontApp.controller:PsCtrl
 * @description
 * # PsCtrl
 * Controller of the pifrontApp
 */
angular.module('pifrontApp')
  .controller('PsCtrl', ['$scope', 'psService', function ($scope, psService) {
    $scope.predicate = '-pCPU';
    $scope.reverse = false;

  	psService.getRunningProcesses(function (data) {
      $scope.processes = data;
      $scope.pCPU_sum = psService.calc_pCPU_Sum(data);
  	});

    window.setTimeout(function() {
      var socket = io();
      socket.on('processes', function(processes) {
        $scope.$apply(function() { 
          $scope.processes = processes;
          $scope.pCPU_sum = psService.calc_pCPU_Sum(processes);
        });
      });
    }, 3000);

  }])
  .service('psService', function ($http) {
  	return {
    	getRunningProcesses: function (success) {
      	$http.get('/api/ps').success(success);
    	},
      calc_pCPU_Sum: function (processes) {
        var pCPU_sum = 0;

        angular.forEach(processes, function(el, index){
          pCPU_sum += el.pCPU;
        });

        return Math.round(pCPU_sum).toFixed(2);
      }
  	}
  });