(function (angular) {
    "use strict";
    angular.module('seoApp').controller('siteMapCtrl', ['siteMapCatalogSvc','siteMapListSvc','$scope', '$http', 'platformModalSvc',
        function (siteMapCatalogSvc,siteMapListSvc,$scope,$http,platformModalSvc) {
            $scope.rightNavTitle = "网站地图频道管理";
            //sitemap cagalog
            $scope.FatherAdd = function FatherAdd() {
                siteMapCatalogSvc.addDept($scope.FatherBean).then(function(){
                    $scope.FatherBean={};
                });
            };
            siteMapCatalogSvc.getCtgDetpList(true).then(function(data){
               $scope.dataList=data;
            });
            $scope.deletDept = function deletDept(item ,index){
                var massage = '确认要删除'+item.name+'网站地图频道吗?删除后当前频道里面的链接将全部删除,建议先将链接转移频道.'
                platformModalSvc.showConfirmMessage(massage,'网站操作信息提示').then(function(){
                        siteMapCatalogSvc.deletCatalog(item.id);
                });
            };
            var navListLoaded = function navListLoaded(data){
                $scope.dataList = data;
            };
            $scope.gotoPage = function gotoPage(item){
                siteMapCatalogSvc.setSelectCatalog(item);
            };
            $scope.isCatalogSelected = function isCatalogSelected(item){
                return item.id===siteMapCatalogSvc.getSelectCatalog().id;
            };
            $scope.switchSortIndex = function switchSortIndex(item1,item2){
                siteMapCatalogSvc.switchSortIndex(item1,item2);

            };
            $scope.whiteFun = function whiteFun(item) {
                if (!item.whiteSpace) {
                    item.whiteSpace = true;
                } else {
                    siteMapCatalogSvc.updataDept(item).then(function () {
                        //onlineService.getTabDataList();
                    });
                    item.whiteSpace = false;

                }
            };
            siteMapCatalogSvc.registerNavListLoaded(navListLoaded);
            $scope.$on('$destroy', function () {
                siteMapCatalogSvc.unregisterNavListLoaded(navListLoaded);
                siteMapListSvc.unregisterListLoaded(onListLoaded);
            });


            //sitemap list
            siteMapListSvc.getTabDataList();
            var onListLoaded = function onListLoaded(data) {
                $scope.tabDataList = data;
            };
            $scope.addLink = function addLink() {
                var bean = {
                    'name': $scope.link.name,
                    'url':$scope.link.url,
                    'type': {
                        'id': siteMapCatalogSvc.getSelectCatalog().id,
                        'name': siteMapCatalogSvc.getSelectCatalog().name
                    }
                };
                siteMapListSvc.addLink(bean);
                $scope.onlineServicename = {};
            };
            $scope.interchange = function interchange(item1,item2){
                siteMapListSvc.interchange(item1,item2);
            };
            //編輯在線客服
            $scope.editOnlineSvcModal = function editOnlineSvcModal(item) {
                siteMapListSvc.editOnlineSvcModal(item, $scope.dataList);
            };
            $scope.ifShow = function ifShow(item) {
                siteMapListSvc.ifShow(item);
            };
            //删除当个在线客服
            $scope.deletSingleOnlineSvc = function deletSingleOnlineSvc(item) {
                siteMapListSvc.deletSingleOnlineSvc(item);
            };
            $scope.checkAll = function checkAll() {
                siteMapListSvc.checkAll();
            };
            $scope.inverse = function inverse() {
                siteMapListSvc.inverse();
            };
            $scope.radioTop = function radioTop(e) {
                siteMapListSvc.radioTop(!e);
            };
            $scope.batchDelete = function batchDelete() {
                siteMapListSvc.batchDelete();
            };
            $scope.searchLink = function searchLink(){
                siteMapListSvc.searchLink($scope.queryName).then(function (data){
                    $scope.tabDataList = data;
                })
            };

            siteMapListSvc.registerListLoaded(onListLoaded);

        }]);
}(angular));