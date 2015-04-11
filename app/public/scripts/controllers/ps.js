 'use strict';

/**
 * @ngdoc function
 * @name pifrontApp.controller:PsCtrl
 * @description
 * # PsCtrl
 * Controller of the pifrontApp
 */
angular.module('pifrontApp')
  .controller('PsCtrl', ['$scope', 'PsService', function ($scope, PsService) {
    $scope.predicate = '-pCPU';
    $scope.reverse = false;
    PsService.loadProcesses();

    $scope.$on('PsService_changed', function() {
      $scope.$apply(function() {
        $scope.pCPU_sum = PsService.pCPU_sum;
        $scope.processes = PsService.processes; 
      });
    });
    $scope.$on('PsService_init', function() {
      $scope.pCPU_sum = PsService.pCPU_sum;
      $scope.processes = PsService.processes; 
    });

  }]);