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
  	});


  }])
  .factory('psService', function($http){
  	var PsService = function() {
    	this.getRunningProcesses = function(success) {
      		$http.get('/api/ps').
		        success(success);
    	};
  	};

  	return new PsService();
});
