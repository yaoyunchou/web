(function (angular) {
    "use strict";
    angular.module('seoApp').controller('siteMapItemEditCtrl', ['siteMapCatalogSvc','siteMapListSvc','$scope', '$http', 'platformModalSvc',
        function (siteMapCatalogSvc,siteMapListSvc,$scope,$http,platformModalSvc) {

            if(_.has($scope.modalOptions,'item')) {
                $scope.editBean = $scope.modalOptions.item
            }else{
                $scope.editBean = $scope.modalOptions.ctg;
            }
            $scope.ok = function ok() {
                if(_.has($scope.modalOptions,'item')){
                    siteMapListSvc.editOnlineSvc($scope.editBean).then(function(data){
                        if(data.isSuccess){
                            $scope.closeModal(true);
                            platformModalSvc.showSuccessTip(data.data);
                        }else{
                            platformModalSvc.showSuccessTip(data.data);
                        }
                    });
                }else{
                    siteMapCatalogSvc.updataDept($scope.editBean).then(function(data){
                        if(data.isSuccess){
                            $scope.closeModal(true);
                            platformModalSvc.showSuccessTip("更新成功！");
                        }else{
                            platformModalSvc.showWarmingTip(data.data);
                        }
                    });
                }


            };
        }]);
}(angular));