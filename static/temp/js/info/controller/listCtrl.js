//文章列表。
infoApp.controller('listCtrl', ['$scope', '$http', '$state', 'utils', '$stateParams', '$location', '$modal', 'platformModalSvc', 'platformTemplatePreviewSvc',
	function ($scope, $http, $state, utils, $stateParams, $location, $modal, platformModalSvc, platformTemplatePreviewSvc) {

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

		//高级搜索。
		$scope.advancedBtn = function () {
			$scope.advancedSearch ? $scope.advancedSearch = false : $scope.advancedSearch = true;
			//下拉树
			$http.get('/pccms/proj/infoCtg/tree/all?moduleId=' + $stateParams.moduleId)
				.success(function (data, status, headers, config) {
					if (data.isSuccess) {
						$scope.collectionAdvanced = data.data;
						//设置初始值
						$scope.activeItemAdvanced = {
							_id: data.data[0]._id,
							name: data.data[0].name
						};
					} else {
						platformModalSvc.showWarmingMessage(data.data, '提示');
					}
				})
				.error(function (data, status, headers, config) {
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
				var item = $scope.dataList[key];
				item.isChecked = $scope.isCheckAll;
			}
		};

		//全选
		$scope.check = function (dataList) {
			var arr = [];
			$scope.isCheckAll = true;
			for (var key in $scope.dataList) {
				var item = $scope.dataList[key];
				item.isChecked = true;
				arr.push(item._id);
			}
		}

		//反选
		$scope.fanCheck = function (dataList) {
			var arr = [];
			for (var key in $scope.dataList) {
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
			if (arr.length != dataList.length) {
				$scope.isCheckAll = false;
			} else {
				$scope.isCheckAll = true;
			}
		}

		//单行选中
		$scope.checkItem = function (item) {
			item.isChecked = !item.isChecked;
			$scope.isCheckAll = checkAllList();
		};

		//检查是否全选
		function checkAllList() {
			var flag = true;
			if ($scope.dataList.length == 0) {
				flag = false;
			} else {
				for (var key in $scope.dataList) {
					var item = $scope.dataList[key];
					if (!item.isChecked) {
						flag = false;
						break;
					}
				}
			}
			return flag;
		}

		//批量删除
		$scope.deleteBatch = function () {
			var idArr = [];
			for (var key in $scope.dataList) {
				var item = $scope.dataList[key];
				if (item.isChecked) {
					idArr.push(item._id);
				}
			}
			$scope.delInfoArticle(idArr.join(','));
		};

		//关闭弹框
		$scope.closeClassifiForm = function () {
			$scope.classifiForm = $scope.mask = false;
		}

		//资讯--转移分类
		$scope.classification = function () {
			$scope.newDataList = [];
			for (var k in $scope.dataList) {
				if ($scope.dataList[k].isChecked) {
					$scope.newDataList.push($scope.dataList[k]);
				}
			}

			if ($scope.newDataList.length > 0) {
				platformModalSvc.showModal({
					backdrop: 'static',
					templateUrl: '/pccms/temp/info/info-transfer-classification.html',
					controller: 'infoTransferClassifyCtrl',
					size: 'lg',
					options: {
						newDataList: $scope.newDataList
					}
				});
			} else {
				platformModalSvc.showWarmingMessage('请选择要转移的资讯！', '提示');
				return;
			}

		};

		//关键字查询
		$scope.searchInfoArticle = function () {

			if ($scope.queryParams.title && $scope.queryParams.title.length > 64) {
				platformModalSvc.showWarmingMessage('关键字查询字符应为0~64个字符', '提示');
				$scope.queryParams = {'title': ''};
				return;
			}
			//获取参数，进行查询操作
			getInfoArticleList(setParam());
		};

		//文章列表刷新
		$scope.reloadInfoArticle = function () {

			$state.go('list', {
				'moduleId': $stateParams.moduleId,
				'name': $stateParams.name,
				'page': $stateParams.page
			}, {reload: true});

		};

		//分页查询。
		$scope.pageChanged = function () {
			$scope.advancedSearch ? getInfoArticleList(setAdvancedParam()) : getInfoArticleList(setParam());
		};

		var update = function update(item) {
			var id;
			item = angular.copy(item);
			if (!item.hasOwnProperty('_id')) {
				return;
			} else {
				id = item._id;
				delete item._id;
			}
			$http({
				method: 'PUT',
				url: '/pccms/proj/infoArticle/updStatus/' + id,
				data: item
			}).success(function (data) {
				if (!data.isSuccess) {
					platformModalSvc.showWarmingMessage(data.data, '提示');
				}
			}).error(function (data) {
				console.log('系统异常或网络不给力！');
			});
		};

		//推荐
		$scope.recommend = function (item) {
			item.isRecommend = !item.isRecommend;
			update(item);
		};

		//置顶
		$scope.displayTop = function (item) {
			item.isDisplayTop = !item.isDisplayTop;
			update(item);
		};

		//显示
		$scope.display = function (item) {
			item.isDisplay = !item.isDisplay;
			update(item);
		};

		//预览
		$scope.preview = function (id, isLink, linkUrl, ctg0) {
			if (isLink == true) {
				window.open(linkUrl);
			} else {
				if (ctg0 != "") {
					//根据ctg0.id查询是否存在DETAIL
					$http.get('/pccms/proj/infoCtg/pageTplType/' + ctg0.id + '?pageTplType=DETAIL')
						.success(function (data) {
							if (data.isSuccess) {
								platformTemplatePreviewSvc.previewDetail('proj/infoArticle/{id}/view', id);
							} else {
								platformModalSvc.showWarmingMessage(data.data, '提示');
							}
						})
						.error(function (data, status, headers, config) {
							console.log('系统异常或网络不给力！');
						});
				} else {
					platformModalSvc.showWarmingMessage("该产品不存在详情页模板!", '提示');
				}
			}
		};

		//删除文章
		$scope.delInfoArticle = function (ids) {
			if (!ids) {
				platformModalSvc.showWarmingMessage('请选择要放入回收站的条目！', '提示');
				return;
			}

			platformModalSvc.showConfirmMessage('确定删除吗？', '提示', true)
				.then(function () {
					$http({
						method: 'POST',
						url: '/pccms/recycleBin/addItem',
						data: {'ids': ids, 'objName': 'InfoArticle'}
					}).success(function (data, status, headers, config) {
						if (data.isSuccess) {
							var idArr = ids.split(',');
							for (var i in idArr) {
								for (var key in $scope.dataList) {
									var item = $scope.dataList[key];
									if (idArr[i] == item._id) {
										$scope.dataList.splice(key, 1);
										break;
									}
								}
							}

							$state.go('list', {
								'moduleId': $stateParams.moduleId,
								'name': $stateParams.name,
								'page': $stateParams.page
							}, {reload: true});
							platformModalSvc.showSuccessTip('删除成功！');
						} else {
							platformModalSvc.showWarmingMessage(data.data, '提示');
						}
					}).error(function (data, status, headers, config) {
						console.log('系统异常或网络不给力！');
					});
				});
		};

		//快速编辑
		$scope.editInfo = function (_data) {
			platformModalSvc.showModal({
				templateUrl: '../../module/extend/' + $stateParams.moduleId + '/info/speedEdit/render/',
				controller: 'editModalBoxCtrl',
				size: 'lg',
				page: 'info',
				options: {
					editId: _data._id,
					isLinkFlag: _data.isLink
				}
			}).then(function (data) {
				getInfoArticleList(setParam());
			});
		};

		//修改。
		$scope.goEdit = function (item) {
			if ($stateParams.moduleId) {
				$state.go('edit', {
					'id': item._id,
					'isLink': item.isLink,
					'moduleId': $stateParams.moduleId,
					'name': $stateParams.name,
					'page': 'info'
				});
			} else {
				$state.go('info-edit', {
					'id': item._id,
					'isLink': item.isLink,
					'moduleId': $stateParams.moduleId,
					'name': $stateParams.name,
					'page': 'info'
				});
			}

		};

		//新增。
		$scope.goAdd = function () {
			$state.go('add', {
				'moduleId': $stateParams.moduleId,
				'name': $stateParams.name,
				'page': 'info'
			});
		};

		//init query list.
		getInfoArticleList(setParam());


		//设置参数。(普通搜索)
		$scope.queryParams = {}
		function setParam() {
			var obj = new Object();
			obj.pageNum = $scope.currentPage;
			obj.pageSize = $scope.pageSize;
			if ($stateParams.moduleId)  obj.moduleId = $stateParams.moduleId;
			if ($scope.queryParams && $scope.queryParams.title) {
				obj.title = $scope.queryParams.title;
			} else {
				obj.title = '';
			}
			return obj;
		}

		//设置参数(高级搜索)。
		function setAdvancedParam() {
			var obj = new Object();
			obj.pageNum = $scope.currentPage;
			obj.pageSize = $scope.pageSize;
			if ($stateParams.moduleId)  obj.moduleId = $stateParams.moduleId;
			if ($scope.advanced.title) obj.title = $scope.advanced.title || '';
			if ($scope.activeItemAdvanced._id) obj.ctgId = $scope.activeItemAdvanced._id;
			if ($scope.advanced.isRecommend) obj.isRecommend = $scope.advanced.isRecommend;
			if ($scope.advanced.isDisplayTop) obj.isDisplayTop = $scope.advanced.isDisplayTop;
			obj.isDisplay = $scope.advanced.isDisplay;
			return obj;
		}

		//加载列表数据
		function getInfoArticleList(params) {

			$http({
				method: 'GET',
				url: '/pccms/proj/infoArticle/list/all',
				params: params
			}).success(function (data, status, headers, config) {
				if (data.isSuccess) {
					$scope.isCheckAll = false;
					if (data.data) {
						$scope.dataList = data.data.list;
						$scope.totalItems = data.data.totalItems;

					} else {
						$scope.dataList = [];
						$scope.totalItems = 0;
						$scope.currentPage = 1;
						platformModalSvc.showWarmingMessage('暂无数据！', '提示');
						return;
					}
				} else {
					platformModalSvc.showWarmingMessage(data.data, '提示');
				}
			}).error(function (data, status, headers, config) {
				console.log('系统异常或网络不给力！');
			});
		};

		//验证网页访问地址是否重复
		$scope.verRepeat = function () {
			var id = '';
			if ($scope.bean._id) {
				id = $scope.bean._id;
			}
			$http({
				method: 'GET',
				url: '/pccms/proj/infoArticle/page',
				params: {

					'staticPageName': codefans_net_CC2PY($scope.editBean.seo.staticPageName),

					'id': id
				}
			}).success(function (data, status, headers, config) {
				if (data.isSuccess) {
					$scope.bean.seo.staticPageName = data.data;
				} else {
					platformModalSvc.showWarmingMessage(data.data, '提示');
				}
			}).error(function (data, status, headers, config) {
				console.log('系统异常或网络不给力！');
			});
		};
	}])

	//快速编辑。
	.controller('editModalBoxCtrl', ['$scope', 'platformModalSvc', '$http', 'utils', '$animate', '$state', '$stateParams',
		function ($scope, platformModalSvc, $http, utils, $animate, $state, $stateParams) {
			$scope.classify = {};
			$scope.classify.activeItemBean = {};

			$scope.isLinkFlag = $scope.modalOptions.isLinkFlag;

			$http.get('/pccms/proj/infoArticle/' + $scope.modalOptions.editId)
				.success(function (data, status, headers, config) {
					if (data.isSuccess) {
						$scope.bean = data.data;
						//加载下拉树。
						$scope.classify.activeItemBean = {
							_id: data.data.ctgs[0].id,
							name: data.data.ctgs[0].name
						};
						$http.get('/pccms/proj/infoCtg/tree/all?moduleId=' + $stateParams.moduleId)
							.success(function (data, status, headers, config) {
								if (data.isSuccess) {
									$scope.collectionBean = data.data;
								} else {
									platformModalSvc.showWarmingMessage(data.data, '提示');
								}
							})
							.error(function (data, status, headers, config) {
								console.log('系统异常或网络不给力！');
							});
					} else {
						platformModalSvc.showWarmingMessage(data.data, '提示');
					}
				}).error(function (data, status, headers, config) {
					console.log('系统异常或网络不给力！');
				});
			$scope.$watch('bean.cmsTags', function (newVal) {
				function toString(array) {
					var _arr = [];
					if (array instanceof Array) {
						for (var k in array) {
							_arr.push(array[k].name);
						}
					}
					return _arr.join(',');
				}

				$scope.tig = toString(newVal);
			}, true);

			$scope.ok = function () {

				$scope.bean.ctgs[0].id = $scope.classify.activeItemBean._id;

				$http.put('/pccms/proj/infoArticle/' + $scope.bean._id, $scope.bean)
					.success(function (data, status, headers, config) {
						if (data.isSuccess) {
							$scope.closeModal(true, {
								'moduleId': $stateParams.moduleId,
								'name': $stateParams.name,
								'page': $stateParams.page
							});
							platformModalSvc.showSuccessTip('修改成功！');
						} else {
							platformModalSvc.showWarmingMessage('修改失败！');
						}
					}).error(function (data, status, headers, config) {
						console.log('系统异常或网络不给力！');
					});
			};

			$scope.cancel = function () {
				$scope.closeModal(false);
			};

			//验证网页访问地址是否重复
			$scope.verRepeat = function () {
				var id = $scope.modalOptions.editId || '';
				$http({
					method: 'GET',
					url: '/pccms/proj/infoArticle/page',
					params: {
						'staticPageName': codefans_net_CC2PY($scope.bean.seo.staticPageName),
						'id': id
					}
				}).success(function (data, status, headers, config) {
					if (data.isSuccess) {
						$scope.bean.seo.staticPageName = data.data;
					} else {
						platformModalSvc.showWarmingMessage(data.data, '提示');
					}
				}).error(function (data, status, headers, config) {
					console.log('系统异常或网络不给力！');
				});
			};

		}]).controller('infoTransferClassifyCtrl', ['$scope', '$modalInstance', '$http', 'utils', '$animate', '$state', '$stateParams', 'platformModalSvc',
		function ($scope, $modalInstance, $http, utils, $animate, $state, $stateParams, platformModalSvc) {

			$scope.newDataList = $scope.modalOptions.newDataList;
			//加载下拉树
			$scope.activeItemTransfer = {};
			$http.get('/pccms/proj/infoCtg/tree/all?moduleId=' + $stateParams.moduleId)
				.success(function (data, status, headers, config) {
					if (data.isSuccess) {
						$scope.collectionTransfer = data.data;
						$scope.activeItemTransfer = {
							_id: data.data[0]._id,
							name: data.data[0].name
						};
					} else {
						platformModalSvc.showWarmingMessage(data.data, '提示');
					}
				})
				.error(function (data, status, headers, config) {
					console.log('系统异常或网络不给力！');
				});

			function isEmptyObject(o) {
				var flag = false;
				for (var k in o) {
					flag = true;
				}
				return flag;
			}

			//分类转移
			$scope.transfer = function () {
				var arr = [];
				for (var k in $scope.newDataList) {
					if ($scope.newDataList[k].isChecked) {
						arr.push($scope.newDataList[k]._id);
					}
				}

				var obj = {};
				if (arr && arr.length > 0) obj.ids = arr.join(',');
				if (isEmptyObject($scope.activeItemTransfer)) {
					obj.ctgId = $scope.activeItemTransfer._id;
				} else {
					platformModalSvc.showWarmingMessage('请选择要转移的分类名称！', '提示');
					return;
				}

				$http({
					method: 'PUT',
					url: '/pccms/proj/infoArticle/list/all',
					data: obj
				}).success(function (data, status, headers, config) {
					if (data.isSuccess) {
						$state.go('list', {
							'moduleId': $stateParams.moduleId,
							'name': $stateParams.name,
							'page': $stateParams.page
						}, {reload: true});
						$scope.closeModal(false);
						platformModalSvc.showSuccessTip('转移成功！')
					} else {
						platformModalSvc.showWarmingMessage(data.data, '提示');
					}
				}).error(function (data, status, headers, config) {
					console.log('系统异常或网络不给力！');
				});

			};

			//关闭
			$scope.cancel = function () {
				$scope.closeModal(false);
			};
		}]);

