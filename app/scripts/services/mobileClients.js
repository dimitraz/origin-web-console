'use strict';

angular.module("openshiftConsole")
  .factory("MobileClientsService", function ($filter,
                                             $q,
                                             $uibModal,
                                             APIService,
                                             DataService,
                                             Logger,
                                             NotificationsService) {

    var mobileclientVersion = {group:"mobile.k8s.io",version:"v1alpha1",resource:"mobileclients"};
    var remove = function(apiObject){
      var context = {
        namespace: _.get(apiObject, 'metadata.namespace')
      };
      NotificationsService.hideNotification("remove-mobileclient-error");
      DataService.delete(mobileclientVersion, apiObject.metadata.name, context, {
        gracePeriodSeconds: 0
      }).then(
        // success
        _.noop,
        // failure
        function(err) {
          NotificationsService.addNotification({
            id: "remove-mobileclient-error",
            type: "error",
            message: "An error occurred while deleting provisioned service " + apiObject.metadata.name + ".",
            details: $filter('getErrorDetails')(err)
          });
          Logger("An error occurred while deleting mobileclient " + apiObject.metadata.name + ".", err);
        });
    };

    var getClients = function() {
      var clients = [];

    }


    var deleteClient = function (apiObject) {
      var modalInstance;

      var modalScope = {
        kind: apiObject.kind,
        displayName: apiObject.metadata.name,
        okButtonText: 'Delete',
        okButtonClass: 'btn-danger',
        cancelButtonText: 'Cancel',
        delete: function () {
          modalInstance.close('delete');
        }
      };

      modalInstance = $uibModal.open({
        templateUrl: 'views/modals/delete-resource.html',
        controller: 'ConfirmModalController',
        resolve: {
          modalConfig: function () {
            return modalScope;
          }
        }
      });

      return modalInstance.result.then(function () {
        remove(apiObject);
      });
    };
    return{
      deleteClient: deleteClient,
    };

  });
