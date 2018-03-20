'use strict';

(function () {
  angular.module('openshiftConsole').component('mobileClientServices', {
    controller: [
      'APIService',
      'DataService',
      'MobileServicesService',
      'NotificationsService',
      MobileClientServicesController
    ],
    bindings: {
      client: '<',
      project: '<',
    },
    templateUrl: 'views/directives/mobile-client-services.html'
  });

  function MobileClientServicesController(APIService, DataService, MobileServicesService, NotificationsService) {
    var ctrl = this;
    var context = { namespace: ctrl.project };

    ctrl.services = [];
    ctrl.title = "Mobile Services";

    ctrl.add = function () {
      console.log('add')
    }

    ctrl.exclude = function (serviceInstance) {
      MobileServicesService.excludeService(ctrl.client, serviceInstance, context)
      .then(function() {
        NotificationsService.addNotification({
          type: 'success',
          message: 'Mobile service excluded'
        });
      }).catch(function(error) {
        NotificationsService.addNotification({
          type: 'error',
          message: 'Failed to exclude mobile service',
          details: error.data.message
        });
      });
    }

    ctrl.add = function (serviceInstance) {
      MobileServicesService.removeFromExcluded(ctrl.client, serviceInstance, context)
      .then(function() {
        NotificationsService.addNotification({
          type: 'success',
          message: 'Mobile service added'
        });
      }).catch(function(error) {
        NotificationsService.addNotification({
          type: 'error',
          message: 'Failed to add mobile service',
          details: error.data.message
        });
      });
    }

    ctrl.filterResources = function(mobileClient, serviceInstances) {
      return MobileServicesService.filterNotExcluded(mobileClient, serviceInstances);
    }

    ctrl.filterExcluded = function(mobileClient, serviceInstances) {
      return MobileServicesService.filterExcluded(mobileClient, serviceInstances);
    }

    DataService.watch(APIService.getPreferredVersion('serviceinstances'), context, function (serviceInstancesData) {
      var data = serviceInstancesData.by("metadata.name");
      _.each(data, function (serviceInstance) {
        if (_.get(serviceInstance, 'metadata.labels', {}).mobile === 'enabled') {
          MobileServicesService.getIcon(serviceInstance).then(function (icon) {
            serviceInstance.resourceData = {};
            serviceInstance.resourceData.imageUrl = icon;
            serviceInstance.resourceData.name = _.get(serviceInstance, 'metadata.labels.serviceName');
            serviceInstance.resourceData.id = _.get(serviceInstance, 'metadata.name');
            
            ctrl.services.push(serviceInstance);
          });
        }
      });
    });

    // ctrl.serviceInstances = [];

    // ctrl.$onInit = function () {
    //   var context = { namespace: ctrl.project };
    //   //var isServiceInstanceReady = $filter('isServiceInstanceReady');

    //   DataService.watch(APIService.getPreferredVersion('serviceinstances'), context, function (serviceInstancesData) {
    //     var data = serviceInstancesData.by("metadata.name");
    //     _.each(data, function (serviceInstance) {
    //       if (_.get(serviceInstance, 'metadata.labels', {}).mobile === 'enabled') {
    //         if (!_.includes(ctrl.serviceInstances, serviceInstance)) {
    //           ctrl.serviceInstances.push(serviceInstance);
    //         }
    //       }
    //     });
    //     ctrl.filteredServices = MobileServicesService.filterNotExcluded(ctrl.serviceInstances, ctrl.client);
    //   });
    // }

    // ctrl.$doCheck = function () {
    //   if (ctrl.serviceInstances) {
    //     ctrl.filteredServices = MobileServicesService.filterNotExcluded(ctrl.serviceInstances, ctrl.client);
    //   }
    // };

    // ctrl.canAddMobileService = function() {
    //   return !MobileServicesService.filterExcluded(ctrl.serviceInstances, ctrl.client).length;
    // };
  }
})();