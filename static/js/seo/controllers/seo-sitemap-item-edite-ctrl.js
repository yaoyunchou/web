(function (angular) {
    "use strict";
    angular.module('seoApp').controller('siteMapItemEditCtrl', ['siteMapCatalogSvc','siteMapListSvc','$scope', '$http', 'platformModalSvc',
        function (siteMapCatalogSvc,siteMapListSvc,$scope,$http,platformModalSvc) {
            $scope.editBean = $scope.modalOptions.item;
            $scope.ctgList = $scope.modalOptions.dataList;
            $scope.ok = function ok() {
                siteMapListSvc.editOnlineSvc($scope.editBean);
                $scope.closeModal(true);
            };
        }]);
}(angular));