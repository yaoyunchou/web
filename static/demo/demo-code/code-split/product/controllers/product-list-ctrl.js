/*global angular, codefans_net_CC2PY*/
(function (angular) {
	"use strict";

	//产品列表
	angular.module('productApp').controller('listCtrl', ['$scope', '$http', '$state', 'utils', '$stateParams', '$location', '$modal', function ($scope, $http, $state, utils, $stateParams, $location, $modal) {

		$scope.name = $stateParams.name;
		$scope.moduleId = $stateParams.moduleId;

		$scope.totalItems = 0; //总条数
		$scope.currentPage = 1; //当前页，默认第一页
		$scope.pageSize = 10; //每页显示多少条
		$scope.maxSize = 5; //设置分页条的长度。

		$scope.advanced = {};
		//$scope.editForm = false;
		$scope.advancedSearch = false;
		$scope.classifiForm = false;
		$scope.mask = false;

		$scope.breadNavs =
			[
				{href: '../index.html', name: '首页'},
				{href: 'index.html', name: '产品管理'},
				{href: '.', name: '产品列表'}
			];

		//高级搜索。
		$scope.advancedBtn = function () {
			$scope.advancedSearch = !$scope.advancedSearch;
			//$scope.advancedSearch ? $scope.advancedSearch = false : $scope.advancedSearch = true;
			//下拉树
			$http.get('/pccms/productCtg/tree/all')
				.success(function (data/*, status, headers, config*/) {

					if (data.isSuccess) {
						$scope.collectionAdvanced = data.data;
						//设置初始值
						$scope.activeItemAdvanced = {
							_id: data.data[0]._id,
							name: data.data[0].name
						};
					} else {
						console.log('操作失败。' + data.data);
					}
				})
				.error(function (/*data, status, headers, config*/) {
					console.log('系统异常或网络不给力！');
				});
		};

		//高级搜索查询。
		$scope.advancedSearchList = function () {
			var obj = setAdvancedParam();
			getInfoArticleList(obj);

		};

		//勾选
		$scope.checkAll = function () {
			$scope.isCheckAll = !$scope.isCheckAll;
			for (var key in $scope.dataList) {
				if ($scope.dataList.hasOwnProperty(key)) {
					var item = $scope.dataList[key];
					item.isChecked = $scope.isCheckAll;
				}
			}
		};

		//全选
		$scope.check = function (/*dataList*/) {
			var arr = [];
			$scope.isCheckAll = true;
			for (var key in $scope.dataList) {
				if ($scope.dataList.hasOwnProperty(key)) {
					var item = $scope.dataList[key];
					item.isChecked = true;
					arr.push(item._id);
				}
			}
		};

		//反选
		$scope.fanCheck = function (dataList) {
			var arr = [];
			for (var key in $scope.dataList) {
				if ($scope.dataList.hasOwnProperty(key)) {
					var item = $scope.dataList[key];
					if (item.isChecked) {
						item.isChecked = false;
						$scope.isCheckAll = false;
					} else {
						item.isChecked = true;
						$scope.isCheckAll = true;
						arr.push(item._id);
					}
				}
			}
			if (arr.length !== dataList.length) {
				$scope.isCheckAll = false;
			} else {
				$scope.isCheckAll = true;
			}
		};

		//单行选中
		$scope.checkItem = function (item) {
			item.isChecked = !item.isChecked;
			$scope.isCheckAll = checkAllList();
		};

		//检查是否全选
		function checkAllList() {
			var flag = true;
			if ($scope.dataList.length === 0) {
				flag = false;
			} else {
				for (var key in $scope.dataList) {
					if ($scope.dataList.hasOwnProperty(key)) {
						var item = $scope.dataList[key];
						if (!item.isChecked) {
							flag = false;
							break;
						}
					}
				}
			}
			return flag;
		}

		//批量删除
		$scope.deleteBatch = function () {
			var idArr = [];
			for (var key in $scope.dataList) {
				if ($scope.dataList.hasOwnProperty(key)) {
					var item = $scope.dataList[key];
					if (item.isChecked) {
						idArr.push(item._id);
					}
				}
			}
			$scope.delInfoArticle(idArr.join(','));
		};

		//关闭弹框
		$scope.closeClassifiForm = function () {
			$scope.classifiForm = $scope.mask = false;
		};

		//转移分类
		$scope.classification = function () {
			$scope.newDataList = [];
			for (var k in $scope.dataList) {
				if ($scope.dataList.hasOwnProperty(k) && $scope.dataList[k].isChecked) {
					$scope.newDataList.push($scope.dataList[k]);
				}
			}

			if ($scope.newDataList.length > 0) {
				$scope.classifiForm = true;
				$scope.mask = true;
				//加载下拉树。
				$scope.activeItemTransfer = {};
				$http.get('/pccms/productCtg/tree/all')
					.success(function (data/*, status, headers, config*/) {
						if (data.isSuccess) {
							$scope.collectionTransfer = data.data;
							$scope.activeItemTransfer = {
								_id: data.data[0]._id,
								name: data.data[0].name
							};
						} else {
							console.log('操作失败。' + data.data);
						}
					})
					.error(function (/*data, status, headers, config*/) {
						console.log('系统异常或网络不给力！');
					});
			} else {
				utils.alertBox('提示', '请选择要转移的产品！');
				return;
			}

		};

		function isEmptyObject(o) {
			var flag = false;
			for (var k in o) {
				if (o.hasOwnProperty(k)) {
					flag = true;
				}
			}
			return flag;
		}

		//分类转移。
		$scope.transfer = function () {
			var arr = [];
			for (var k in $scope.newDataList) {
				if ($scope.newDataList[k].isChecked) {
					arr.push($scope.newDataList[k]._id);
				}
			}

			var obj = {};
			if (arr && arr.length > 0) {
				obj.ids = arr.join(',');
			}
			if (isEmptyObject($scope.activeItemTransfer)) {
				obj.ctgId = $scope.activeItemTransfer._id;
			} else {
				utils.alertBox('提示', '请选择要转移的分类名称！');
				return;
			}

			$http({
				method: 'PUT',
				url: '/pccms/productList/transferCtg',
				data: obj
			}).success(function (data/*, status, headers, config*/) {
				if (data.isSuccess) {
					$state.go('list', {
						'moduleId': $stateParams.moduleId,
						'name': $stateParams.name,
						'page': $stateParams.page
					}, {reload: true});
				} else {
					utils.alertBox('提示', data.data);
				}
			}).error(function (/*data, status, headers, config*/) {
				console.log('系统异常或网络不给力！');
			});

		};

		//关闭
		$scope.closeTrans = function () {
			$scope.classifiForm = $scope.mask = false;
		};


		//关键字查询
		$scope.searchInfoArticle = function () {

			if ($scope.queryParams.title && $scope.queryParams.title.length > 64) {
				utils.alertBox('提示', '关键字查询字符应为0~64个字符');
				$scope.queryParams = {'title': ''};
				return;
			}
			//获取参数，进行查询操作
			getInfoArticleList(setParam());
		};

		//产品列表刷新
		$scope.reloadInfoArticle = function () {
			$state.go('list', {
				//'moduleId': $stateParams.moduleId,
				'name': $stateParams.name,
				'page': $stateParams.page
			}, {reload: true});

		};

		//分页查询。
		$scope.pageChanged = function () {
			if ($scope.advancedSearch) {
				getInfoArticleList(setAdvancedParam());
			} else {
				getInfoArticleList(setParam());
			}
		};

		//推荐
		$scope.recommend = function (item) {
			$scope.item = item;
			$http({
				method: 'PUT',
				url: '/pccms/product/updStatus/' + item._id,
				data: {
					'isRecommend': !$scope.item.isRecommend
				}
			}).success(function (data/*, status, headers, config*/) {
				if (data.isSuccess) {
					$scope.item.isRecommend = !item.isRecommend;
				} else {
					utils.alertBox('提示', data.data);
				}
			}).error(function (/*data, status, headers, config*/) {
				console.log('系统异常或网络不给力！');
			});
		};

		//置顶
		$scope.displayTop = function (item) {
			$scope.item = item;
			$scope.item.isDisplayTop = !item.isDisplayTop;
			$http({
				method: 'PUT',
				url: '/pccms/product/updStatus/' + item._id,
				data: {'isDisplayTop': $scope.item.isDisplayTop}
			}).success(function (/*data, status, headers, config*/) {
			}).error(function (/*data, status, headers, config*/) {
				console.log('系统异常或网络不给力！');
			});

		};

		//显示
		$scope.display = function (item) {
			$scope.item = item;
			$scope.item.isDisplay = !item.isDisplay;
			$http({
				method: 'PUT',
				url: '/pccms/product/updStatus/' + item._id,
				data: {'isDisplay': $scope.item.isDisplay}
			})/*.success(function (data, status, headers, config) {
			 })*/.error(function (/*data, status, headers, config*/) {
				console.log('系统异常或网络不给力！');
			});
		};

		//预览
		$scope.preview = function (id, isLink, linkUrl, ctg0) {
			if (isLink === true) {
				window.open(linkUrl);
			} else {
				if (ctg0 !== "") {
					//根据ctg0.id查询是否存在DETAIL
					$http.get('/pccms/productCtg/pageTplDetailType/' + ctg0.id)
						.success(function (data/*, status, headers, config*/) {
							if (data.isSuccess) {
								window.open('/pccms/product/preview/' + id);
							} else {
								utils.alertBox('预览失败', data.data);
							}
						})
						.error(function (/*data, status, headers, config*/) {
							console.log('系统异常或网络不给力！');
						});
				} else {
					utils.alertBox('预览失败', "该产品不存在详情页模板!");
				}

			}
		};

		//删除产品
		$scope.delInfoArticle = function (ids) {
			if (!ids) {
				utils.alertBox('提示', '请选择要放入回收站的条目！');
				return;
			}
			utils.confirmBox('提示', '确认放入回收站吗？', function () {
				$http({
					method: 'POST',
					url: '/pccms/recycleBin/addItem',
					data: {'ids': ids, 'objName': 'Product'}
				}).success(function (data/*, status, headers, config*/) {
					if (data.isSuccess) {
						var idArr = ids.split(',');
						for (var i in idArr) {
							if (idArr.hasOwnProperty(i)) {
								for (var key in $scope.dataList) {
									if ($scope.dataList.hasOwnProperty(key)) {
										var item = $scope.dataList[key];
										if (idArr[i] === item._id) {
											$scope.dataList.splice(key, 1);
											break;
										}
									}
								}
							}
						}

						$state.go('list', {
							//'moduleId': $stateParams.moduleId,
							'name': $stateParams.name,
							'page': $stateParams.page
						}, {reload: true});

					} else {
						console.log('获取数据失败：' + data.data);
					}
				}).error(function (/*data, status, headers, config*/) {
					console.log('系统异常或网络不给力！');
				});
			});
		};

		//快速编辑
		$scope.editInfo = function (_data) {
			$modal.open({
				backdrop: 'static',
				templateUrl: '/pccms/temp/product/editModalBox.html',
				//templateProvider: ['$stateParams', '$http', function ($stateParams,$http) {
				// return $http
				//     .get('../../module/extend/'+$stateParams.moduleId+'/'+$stateParams.page+'/render/')
				//     .then(function(response) {
				//            return response.data;
				//      });
				// }],
				controller: 'editModalBoxCtrl',
				size: 'lg',
				resolve: {
					editId: function () {
						return _data._id;
					}
				}
			});
		};


		//修改。
		$scope.goEdit = function (item) {
			$state.go('product-edit', {
				'id': item._id,
				'isLink': item.isLink,
				//'moduleId': $stateParams.moduleId,
				'name': $stateParams.name,
			});
		};


		//新增。
		$scope.goAdd = function () {
			$state.go('add', {
				//'moduleId': $stateParams.moduleId,
				'name': $stateParams.name,

			});
		};


		//设置参数。(普通搜索)
		$scope.queryParams = {};
		function setParam() {
			var obj = {};
			obj.pageNum = $scope.currentPage;
			obj.pageSize = $scope.pageSize;
			// if($stateParams.moduleId)  obj.moduleId = $stateParams.moduleId;
			if ($scope.queryParams && $scope.queryParams.title) {
				obj.title = $scope.queryParams.title;
			} else {
				obj.title = '';
			}
			return obj;
		}


		//设置参数(高级搜索)。
		function setAdvancedParam() {
			var obj = {};
			obj.pageNum = $scope.currentPage;
			obj.pageSize = $scope.pageSize;
			//if($stateParams.moduleId)  obj.moduleId = $stateParams.moduleId;
			if ($scope.advanced.title) {
				obj.title = $scope.advanced.title || '';
			}
			if ($scope.activeItemAdvanced._id) {
				obj.prodCtgId = $scope.activeItemAdvanced._id;
			}
			if ($scope.advanced.isRecommend) {
				obj.isRecommend = $scope.advanced.isRecommend;
			}
			if ($scope.advanced.isDisplayTop) {
				obj.isDisplayTop = $scope.advanced.isDisplayTop;
			}
			obj.isDisplay = $scope.advanced.isDisplay;
			return obj;

		}

		//加载列表数据
		function getInfoArticleList(params) {
			$http({
				method: 'GET',
				url: '/pccms/productList',
				params: params
			}).success(function (data, status, headers, config) {
				if (data.isSuccess) {
					if (data.data) {
						$scope.dataList = data.data.list;
						$scope.totalItems = data.data.totalItems;
					} else {
						$scope.dataList = [];
						$scope.totalItems = 0;
						$scope.currentPage = 1;
						console.log('暂无数据！');
						return;
					}
				} else {
					console.log('获取数据失败：' + data.data);
				}
			}).error(function (data, status, headers, config) {
				console.log('系统异常或网络不给力！');
			});
		}

		//init query list.
		getInfoArticleList(setParam());

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



