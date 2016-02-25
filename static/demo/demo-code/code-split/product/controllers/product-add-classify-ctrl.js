/*global angular, codefans_net_CC2PY*/
(function (angular) {
	"use strict";

	//文章分类录入
	angular.module('productApp').controller('addClassifyCtrl', ['$scope', '$http', '$state', 'utils', '$stateParams', '$rootScope', '$modal',
		function ($scope, $http, $state, utils, $stateParams, $rootScope, $modal) {

			$scope.name = $stateParams.name;
			$scope.moduleId = $stateParams.moduleId;
			$scope.bean = {};
			$scope.bean.seo = {};
			$scope.bean.imgSm = {};
			$scope.bean.imgMd = {};

			$scope.bean.seo = {};
			$scope.infoSeo = true;
			$scope.infoOther = true;
			$scope.faceCheck = true;
			$scope.productSame = true;

			$scope.isLinkFlag = false;

			$scope.isThumbnail = false; //是否有缩略图。

			$scope.breadNavs =
				[
					{href: '../index.html', name: '首页'},
					{href: 'index.html', name: '产品管理'},
					{href: '.', name: '添加分类'}
				];

			$scope.configDesc = {
				maximumWords: 600,
				initialFrameHeight: 150,
				toolbars: [
					[
						'fullscreen', 'source', '|', 'undo', 'redo', '|',
						'bold', 'italic', 'underline', 'fontborder', '|', 'forecolor', 'backcolor', '|',
						'fontfamily', 'fontsize', '|',
						'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
						'link'
					]
				]
			};

			//加载下拉树。
			$scope.classify = {};
			$scope.classify.activeItemBean = {};
			$http.get('/pccms/productCtg/tree/all')
				.success(function (data/*, status, headers, config*/) {
					if (data.isSuccess) {
						$scope.collectionBean = data.data;
					} else {
						console.log('操作失败。' + data.data);
					}
				})
				.error(function (/*data, status, headers, config*/) {
					console.log('系统异常或网络不给力！');
				});


			//没有缩略图。
			$scope.hasNotThumbnail = function () {
				$scope.isThumbnail = false;
			};
			//有缩略图。
			$scope.hasThumbnail = function () {
				$scope.isThumbnail = true;
			};
			//存在外部链接。
			$scope.hasLink = function () {
				$scope.isLinkFlag = true;

				$scope.infoSeo = false;
				$scope.infoOther = false;
				$scope.faceCheck = false;
			};


			//修改就去加载表单数据。
			if ($stateParams.id) {
				if ($stateParams.isLink === 'true') {
					$scope.hasLink();
				}

				$http.get('/pccms/productCtg/' + $stateParams.id)
					.success(function (data/*, status, headers, config*/) {
						if (data.isSuccess) {
							$scope.bean = data.data;

							//图片。
							$scope.img = {};
							if (data.data.imgSm.url) {
								$scope.imageExist = true;
								$scope.isThumbnail = true;
								/*$scope.img.thumbnail = [];
								$scope.img.thumbnail[0] = {};
								$scope.img.thumbnail[0].path = data.data.imgSm.url;*/
							}

							$scope.classify.activeItemBean = {
								_id: data.data.parentCtg.id,
								name: data.data.parentCtg.name,
								path: data.data.path
							};

							/*if (data.data.imgMd.url) {
								if (data.data.isLink) {
									$scope.img.iconClassify = [];
									$scope.img.iconClassify[0] = {};
									$scope.img.iconClassify[0].path = data.data.imgMd.url;
								} else {
									$scope.img.lmicon = [];
									$scope.img.lmicon[0] = {};
									$scope.img.lmicon[0].path = data.data.imgMd.url;
								}*/

							//}
							try {
								if (data.data.pageTpl[0].id) {
									$scope.listTempOk[data.data.pageTpl[0].id] = true;
								}
								if (data.data.pageTpl[1].id) {
									$scope.detailTempOk[data.data.pageTpl[1].id] = true;
								}
							}
							catch (e) {

							}


						} else {
							console.log('操作失败。' + data.data);
							utils.alertBox('操作失败', data.data);
						}
					}).error(function (/*data, status, headers, config*/) {
					console.log('系统异常或网络不给力！');
				});

			}
			else {

				$scope.bean = {};
				$scope.bean.seo = {};
				$scope.classify = {};
				$scope.bean.imgSm = {};
				$scope.bean.imgMd = {};


				$http.get('/pccms/productCtg/tree/all')
					.success(function (data/*, status, headers, config*/) {
						if (data.isSuccess) {
							$scope.collectionBean = data.data;
							$scope.classify.activeItemBean = {
								_id: data.data[0]._id,
								name: data.data[0].name,
								path: data.data[0].path
							};
						} else {
							console.log('操作失败。' + data.data);
						}
					})
					.error(function (/*data, status, headers, config*/) {
						console.log('系统异常或网络不给力！');
					});

			}


			$scope.setNetAddress = function () {
				//console.log(JSON.stringify($scope.bean));
				if ($scope.bean.name && !$stateParams.id) {
					$http({
						method: 'GET',
						url: '/pccms/productCtg/validateStaticPageName',
						params: {
							'id': '',
							'staticPageName': codefans_net_CC2PY($scope.bean.name)
						}
					}).success(function (data/*, status, headers, config*/) {
						if (data.isSuccess) {
							$scope.bean.seo.staticPageName = data.data;
						} else {
							console.log('操作失败。' + data.data);
						}
					}).error(function (/*data, status, headers, config*/) {
						console.log('系统异常或网络不给力！');
					});
				} else if (!$scope.bean.name && !$stateParams.id) {
					$scope.bean.seo.staticPageName = '';
				}
			};

			//验证网页访问地址是否重复
			$scope.verRepeat = function () {
				var id = $stateParams.id ? $stateParams.id : "";
				$http({
					method: 'GET',
					url: '/pccms/productCtg/validateStaticPageName',
					params: {'id': id, 'staticPageName': codefans_net_CC2PY($scope.bean.seo.staticPageName)}
				}).success(function (data/*, status, headers, config*/) {
					if (data.isSuccess) {
						$scope.bean.seo.staticPageName = data.data;
					} else {
						console.log('操作失败。' + data.data);
					}
				}).error(function (/*data, status, headers, config*/) {
					console.log('系统异常或网络不给力！');
				});
			};


			//加载下拉树。
			$scope.classify = {};
			$scope.classify.activeItemBean = {};

			//获取列表页模板
			$http({
				method: 'GET',
				url: '/pccms/productCtg/projPageTplList/type',
				params: {'pageTplType': 'LIST'}
			}).success(function (data/*, status, headers, config*/) {
				if (data.isSuccess) {
					if (data.data) {
						$scope.tempList = data.data;
					}
				} else {
					console.log('获取数据失败：' + data.data);
				}
			}).error(function (/*data, status, headers, config*/) {
				console.log('系统异常或网络不给力！');
			});

			//获取详情页模板
			$http({
				method: 'GET',
				url: '/pccms/productCtg/projPageTplList/type',
				params: {'pageTplType': 'DETAIL'}
			}).success(function (data/*, status, headers, config*/) {
				if (data.isSuccess) {
					if (data.data) {
						$scope.tempDetail = data.data;
					}
				} else {
					console.log('获取数据失败：' + data.data);
				}
			}).error(function (/*data, status, headers, config*/) {
				console.log('系统异常或网络不给力！');
			});

			$scope.bean.pageTpl = [];
			//列表模板选中。
			$scope.listTempOk = {};
			for (var index in $scope.listTempOk) {
				if (angular.isDefined($scope.listTempOk[index])) {
					$scope.listTempOk[index] = false;
				}
			}
			$scope.selectListImageOne = function (row) {
				for (var k in $scope.listTempOk) {
					if(angular.isDefined($scope.listTempOk[k])) {
						$scope.listTempOk[k] = false;
					}
				}
				$scope.listTempOk[row._id] = true;
				$scope.bean.pageTpl[0] = {
					'id': row._id,
					'type': 'LIST'
				};
			};

			//详情模板选中。
			$scope.detailTempOk = {};
			for (var k in $scope.detailTempOk) {
				if(angular.isDefined($scope.detailTempOk[k])) {
					$scope.detailTempOk[k] = false;
				}
			}
			$scope.selectDetailImageOne = function (row) {
				for (var k in $scope.detailTempOk) {
					if(angular.isDefined($scope.detailTempOk[k])) {
						$scope.detailTempOk[k] = false;
					}
				}
				$scope.detailTempOk[row._id] = true;
				$scope.bean.pageTpl[1] = {
					'id': row._id,
					'type': 'DETAIL'
				};
			};

			var flagSpeedTree = false;
			$scope.itemTreeChanged = function () {
				flagSpeedTree = true;

			};

			//提交保存。
			$scope.saveBean = function () {

				//获取moduleId。
				if ($stateParams.moduleId) {
					$scope.bean.moduleId = $stateParams.moduleId;
				}
				if ($scope.isLinkFlag) {
					$scope.bean.isLink = true;
					$scope.bean.seo = null;
				}

				//获取下拉树参数、

				if (flagSpeedTree || !$scope.bean.path) {
					if($scope.classify.activeItemBean.path){
						$scope.bean.path = $scope.classify.activeItemBean.path + $scope.classify.activeItemBean._id + ',';
					}else{
						$scope.bean.path = ',' + $scope.classify.activeItemBean._id + ',';
					}
				}


				//$scope.bean.imgSm.url = $('#thumbnail').attr('src') || '';
				/*if ($scope.isLinkFlag) {
					$scope.bean.imgMd.url = $('#wlicon').attr('src') || '';
				} else {
					$scope.bean.imgMd.url = $('#lmicon').attr('src') || '';

				}*/

				var _saveBean;
				if ($stateParams.id) { //修改。
					_saveBean = $http.put('/pccms/productCtg/' + $stateParams.id, $scope.bean);

				} else { //新增。
					_saveBean = $http.post('/pccms/productCtg', $scope.bean);
				}

				_saveBean.success(function (data/*, status, headers, config*/) {

					if (data.isSuccess) {
						$state.go('productClassList', {
							'moduleId': $stateParams.moduleId,
							'name': $stateParams.name,
							'page': $stateParams.page
						});
					} else {
						console.log('分类录入失败。' + data.data);
						utils.alertBox('操作提示', data.data);
					}
				}).error(function (/*data, status, headers, config*/) {
					console.log('系统异常或网络不给力！');
				});
			};


			/********  其他属性  新建 end**************/
			$scope.addtype = function () {
				$modal.open({
					templateUrl: 'addProperty.html',
					controller: 'addOtherTypeCtrl',
					backdrop: 'static',
					size: 'md'
				});
			};
			/********其他属性  新建end**************/
			$rootScope.lists = [];
			$rootScope.long = 1;
			$rootScope.mylist = [];
			//修改数据  传入序号与方式
			$scope.changtype = function (index, way) {
				for (var list in $scope.mylist) {
					if (way === 'up') {
						if ($scope.mylist[list].index === index) {

							$scope.mylist[list].index = index - 1;
						} else if ($scope.mylist[list].index === (index - 1)) {
							$scope.mylist[list].index = index;
						}
					} else if (way === "down") {
						if ($scope.mylist[list].index === index) {
							$scope.mylist[list].index = index + 1;
						} else if ($scope.mylist[list].index === (index + 1)) {
							$scope.mylist[list].index = index;
						}
					}
				}
				jtou();
				pxun();
				//console.log($scope.lists);
			};
			//箭头状态
			function jtou() {
				for (var list in $scope.mylist) {
					if ($rootScope.long === 1) {
						$scope.mylist[list].up = false;
						$scope.mylist[list].down = false;

					} else if ($scope.mylist[list].index === 1) {
						$scope.mylist[list].down = true;
						$scope.mylist[list].up = false;
					} else if ($scope.mylist[list].index === $rootScope.long - 1) {
						$scope.mylist[list].up = true;
						$scope.mylist[list].down = false;
					} else {
						$scope.mylist[list].up = true;
						$scope.mylist[list].down = true;
					}
				}
			}

			//对数据排序
			function pxun() {
				$rootScope.mylist = [];
				for (var i = 0; i < $scope.lists.length; i++) {
					for (var j = 0; j < $scope.lists.length; j++) {
						if ($scope.lists[j].index === (i + 1)) {
							$rootScope.mylist.push($scope.lists[j]);
						}
					}
				}
			}

			//删除数据
			$scope.deletOtherType = function (index) {
				for (var i = index; i < $scope.mylist.length; i++) {
					if ($scope.mylist[i].index > (index + 1)) {
						$scope.mylist[i].index = $scope.mylist[i].index - 1;
					}
				}
				$scope.mylist.splice(index, 1);
				$scope.lists.splice(index, 1);
				$rootScope.long--;
				console.log($scope.mylist);
			};
			//修改数据
			$rootScope.tochange = function (/*ele*/) {

				$scope.mylist.splice(index, 1);
				$scope.lists.splice(index, 1);
				$rootScope.long--;
				console.log($scope.mylist);
			};

		}]);
}(angular));



