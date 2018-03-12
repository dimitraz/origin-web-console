'use strict';

(function () {
  angular.module('openshiftConsole').component('mobileClientService', {
    controller: [
      'APIService',
      'CatalogService',
      'DataService',
      MobileClientServiceController
    ],
    bindings: {
      service: '<'
    },
    templateUrl: 'views/directives/mobile-client-service.html'
  });

  function MobileClientServiceController(APIService, CatalogService, DataService) {
    var ctrl = this;
    ctrl.serviceName = _.get(ctrl.service, "metadata.labels.serviceName");

    CatalogService.getCatalogItems().then(function(catalogServices) {
      ctrl.doRender = false;
      _.each(catalogServices, function (catalogService) {
        if (_.get(catalogService, "resource.spec.externalMetadata.serviceName", "not_found") === ctrl.serviceName) {
          ctrl.serviceData = {};
          ctrl.serviceData.name = ctrl.serviceName;
          ctrl.serviceData.imageData = {
            iconClass: catalogService.iconClass,
            imageUrl: catalogService.imageUrl
          };
        }
      });
    });
  }
})();