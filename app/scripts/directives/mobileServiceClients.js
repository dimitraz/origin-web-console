'use strict';

(function() {
  angular.module('openshiftConsole').component('mobileServiceClients', {
    controller: [
      '$filter',
      'MobileClientsService',
      'NotificationsService',
      MobileServiceClientsCtrl
    ],
    bindings: {
      project: '<',
      serviceInstance: '<',
      mobileClients: '<'
    },
    templateUrl: 'views/directives/mobile-service-clients.html'
  });

  function MobileServiceClientsCtrl(
                       $filter,
                       MobileClientsService,
                       NotificationsService) {
    var ctrl = this;
    var context = { namespace: _.get(ctrl, 'project.metadata.name') };
    var getErrorDetails = $filter('getErrorDetails');
    ctrl.title = "Mobile Clients";

    ctrl.$doCheck = function() {
      ctrl.filteredClients = MobileClientsService.filterNotExcluded(ctrl.serviceInstance, ctrl.mobileClients);
    };

    ctrl.excludeClient = function(mobileClient) {
      var clientName = _.get(mobileClient, 'spec.name');
      var serviceName = _.get(ctrl.serviceInstance, 'metadata.name');
      
      MobileClientsService.excludeClient(mobileClient, ctrl.serviceInstance, context)
      .then(function() {
          NotificationsService.addNotification({
            type: 'success',
            message: 'Mobile client ' + clientName + ' excluded from ' + serviceName + '.'
          });
        }).catch(function(error) {
          NotificationsService.addNotification({
            type: 'error',
            message: 'Failed to exclude mobile client ' + clientName + ' from service ' + serviceName + '.',
            details: getErrorDetails(error)
          });
        });
    };

    ctrl.addClient = function(mobileClient) {
      var clientName = _.get(mobileClient, 'spec.name');
      var serviceName = _.get(ctrl.serviceInstance, 'metadata.name');

      MobileClientsService.removeFromExcluded(mobileClient, ctrl.serviceInstance, context)
      .then(function() {
          NotificationsService.addNotification({
            type: 'success',
            message: 'Mobile client ' + clientName + ' added to service ' + serviceName + '.'
          });
        }).catch(function(error) {
          NotificationsService.addNotification({
            type: 'error',
            message: 'Failed to add mobile client ' + clientName + ' to service ' + serviceName + '.',
            details: getErrorDetails(error)
          });
        });
    }

    ctrl.filterResources = function(serviceInstance, mobileClients) {
      return MobileClientsService.filterNotExcluded(serviceInstance, mobileClients);
    }

    ctrl.filterExcluded = function(serviceInstance, mobileClients) {
      return MobileClientsService.filterExcluded(serviceInstance, mobileClients);
    }

    // ctrl.canAddMobileClient = function() {
    //   return !MobileClientsService.filterExcluded(ctrl.serviceInstance, ctrl.mobileClients).length;
    // };
  }
})();
