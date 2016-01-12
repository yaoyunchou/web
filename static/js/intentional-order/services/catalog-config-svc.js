/**
 * Created by yaoyc on 2016/1/12.
 */
/*global angular*/
(function (angular) {
    "use strict";
    var intentionalOrderApp = angular.module('intentionalOrderApp');
    intentionalOrderApp.factory('intentionalOrderSvc',['$http','$q',function($http,$q){
        var service = {},
            updatadone = new PlatformMessenger(),
            navListLoaded = new PlatformMessenger(),
        //����tab �б�
            serviceList,
        //���沿�ŵ�ѡ�ж���
            selectedCatalog;
        service.getServiceList = function getServiceList() {
            return serviceList;
        };
        //����Ҳಿ��
        service.addDept = function addDept(data) {
            var defer = $q.defer();
            $http({
                'method': 'POST',
                'url': '/pccms/siteMap/addLinkType',
                'data': data
            }).then(function (response) {
                if (response.data.isSuccess) {
                    deptList.push(response.data.data);
                    defer.resolve(deptList);
                    service.getCtgDetpList(true);
                    platformModalSvc.showSuccessTip("��ӳɹ�!");
                }

            }, function (response) {
                platformModalSvc.showWarmingTip(response.data.data);
            });
            return defer.promise;
        };
        //�޸��Ҳಿ��
        service.updataDept = function updataDept(data) {
            var defer = $q.defer();
            $http({
                'method': 'POST',
                'url': '/pccms/siteMap/updateLinkType',
                'data': data
            }).then(function (response) {
                if (response.data.isSuccess) {
                    deptList.push(response.data.data);
                    defer.resolve(deptList);
                    service.getCtgDetpList(true);
                    platformModalSvc.showSuccessTip("��ӳɹ�!");
                }

            }, function (response) {
                platformModalSvc.showWarmingTip(response.data.data);
            });
            return defer.promise;
        };
        /*����б�*/
        var deptList;
        service.getCtgDetpList = function getCtgDetpList(flog) {
            var defer = $q.defer();
            $http.get('/pccms/siteMap/getInfoLinkType?isMade='+flog).then(function (response) {
                deptList = response.data.data||[];
                deptList = _.sortBy(deptList,'orderBy');

                if (flog) {
                    service.setSelectCatalog(deptList[0]);
                }
                defer.resolve(deptList);
                navListLoaded.fire(deptList);
            }, function (response) {
                if(!response.data.isSuccess){
                    platformModalSvc.showWarmingTip(response.data.msg);
                }
            });
            return defer.promise;
        };

        //ɾ������  optimized
        service.deletCatalog = function deletCatalog(catalog) {
            $http.get('/pccms/siteMap/deleteLinkType?id=' + catalog).then(function (response) {
                if (response.data.isSuccess) {
                    platformModalSvc.showSuccessTip(response.data.data);
                    _.remove(deptList,{_id:catalog});
                    service.getCtgDetpList(true);
                }
            }, function (response) {
                platformModalSvc.showWarmingTip(response.data.msg);
            });
        };

        //ɾ������
        service.deletDetp = function deletDetp(id, index) {
            $http.delete('/pccms/deleteOnlineSrvDept?deptId=' + id).then(function (response) {
                if (response.data.isSuccess) {
                    platformModalSvc.showSuccessTip(response.data.data);
                    deptList.splice(index, 1);
                    service.getCtgDetpList();
                }
            }, function (response) {
                service.getCtgDetpList();
                platformModalSvc.showWarmingTip(response.data.msg);
            });
        };

        //��������
        service.sortCtg = function sortCtg(data) {
            $http({
                method: 'GET',
                url: '/pccms/siteMap/orderBySiteMapType',
                params: data
            }).then(function () {
                service.getCtgDetpList(false);
            });
        };
        //���������ֶ� optimized
        service.switchSortIndex = function switchSortIndex(item1, item2) {
            service.sortCtg({id: item1.id, id2: item2.id});
        };
        //��ȡѡ�в��Ŷ���
        service.getSelectCatalog = function getSelectCatalog() {
            return selectedCatalog || {};
        };
        //����ѡ�в��Ŷ���
        service.setSelectCatalog = function setSelectCatalog(catalog) {
            selectedCatalog = catalog;
            updatadone.fire(selectedCatalog);

        };

        service.registerNavListLoaded = function registerNavListLoaded(handler) {
            navListLoaded.register(handler);
        };
        service.registerUpdatadone = function registerUpdatadone(handler) {
            updatadone.register(handler);
        };

        service.unregisterNavListLoaded = function unregisterNavListLoaded(handler) {
            navListLoaded.unregister(handler);
        };
        service.unregisterUpdatadone = function unregisterUpdatadone(handler) {
            updatadone.unregister(handler);
        };
        return service;
    }]);
}(angular));
