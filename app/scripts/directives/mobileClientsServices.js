'use strict';

(function () {
  angular.module('openshiftConsole').component('mobileClientServices', {
    controller: [
      'APIService',
      'DataService',
      MobileClientServicesController
    ],
    bindings: {
      client: '<',
      project: '<'
    },
    templateUrl: 'views/directives/mobile-client-services.html'
  });

  function MobileClientServicesController(APIService, DataService) {
    var ctrl = this;
    ctrl.serviceInstances = [];

    ctrl.$onInit = function () {
      var context = { namespace: ctrl.project };

      DataService.watch(APIService.getPreferredVersion('serviceinstances'), context, function (serviceInstancesData) {
        var data = serviceInstancesData.by("metadata.name");
        _.each(data, function (serviceInstance) {
          if (_.get(serviceInstance, 'metadata.labels', {}).mobile === 'enabled') {
            ctrl.serviceInstances.push(serviceInstance);
          }
        });
      });
    }
  }
})();