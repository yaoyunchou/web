/*global angular, codefans_net_CC2PY*/
(function (angular) {
	"use strict";

	//快速编辑。
	angular.module('productApp').controller('editModalBoxCtrl', ['$scope', '$modalInstance', '$http', 'utils', '$animate', '$state', '$stateParams', 'editId',
		function ($scope, $modalInstance, $http, utils, $animate, $state, $stateParams, editId) {

			$http.get('/pccms/product/' + editId)
				.success(function (data/*, status, headers, config*/) {
					if (data.isSuccess) {

						$scope.editBean = data.data;
						//加载下拉树。
						$scope.activeItemEdit = {
							_id: data.data.ctgs[0].id,
							name: data.data.ctgs[0].name
						};
						$http.get('/pccms/productCtg/tree/all?moduleId=' + $stateParams.moduleId)
							.success(function (data/*, status, headers, config*/) {
								if (data.isSuccess) {
									$scope.collectionEdit = data.data;
								} else {
									console.log('操作失败。' + data.data);
								}
							})
							.error(function (/*data, status, headers, config*/) {
								console.log('系统异常或网络不给力！');
							});

					} else {
						console.log('操作失败。' + data.data);
					}
				}).error(function (/*data, status, headers, config*/) {
				console.log('系统异常或网络不给力！');
			});

			$scope.ok = function () {

				$scope.editBean.ctgs[0].id = $scope.activeItemEdit._id;

				$http.put('/pccms/product/' + $scope.editBean._id, $scope.editBean)
					.success(function (data/*, status, headers, config*/) {
						if (data.isSuccess) {

							$modalInstance.close();

							$state.go('list', {
								'moduleId': $stateParams.moduleId,
								'name': $stateParams.name,
								'page': $stateParams.page
							}, {
								reload: true
							});

						} else {
							utils.alertBox('修改失败', data.data);
						}
					}).error(function (/*data, status, headers, config*/) {
					console.log('系统异常或网络不给力！');
				});
			};

			$scope.cancel = function () {
				$modalInstance.dismiss();
			};
			//验证网页访问地址是否重复
			$scope.verRepeat = function () {
				var id = '';
				if ($scope.editBean._id) {
					id = $scope.editBean._id;
				}
				$http({
					method: 'GET',
					url: '/pccms/proj/infoArticle/page',
					params: {
						'staticPageName': codefans_net_CC2PY($scope.editBean.seo.staticPageName),
						'id': id
					}
				}).success(function (data/*, status, headers, config*/) {
					if (data.isSuccess) {
						$scope.editBean.seo.staticPageName = data.data;
					} else {
						console.log('操作失败。' + data.data);
					}
				}).error(function (/*data, status, headers, config*/) {
					console.log('系统异常或网络不给力！');
				});
			};

		}]);
}(angular));