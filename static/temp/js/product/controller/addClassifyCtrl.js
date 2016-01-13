//文章分类录入
productApp.controller('addClassifyCtrl', ['$scope', '$http', '$state', 'utils', '$stateParams', '$rootScope', '$modal','platformModalSvc',
	function ($scope, $http, $state, utils, $stateParams, $rootScope, $modal,platformModalSvc) {
		$scope.name = $stateParams.name;
		$scope.moduleId = $stateParams.moduleId;
		$scope.bean = {};

		$scope.bean.seo = {};
		$scope.bean.imgSm = {};
		$scope.bean.imgMd = {};
		//初始化网址字段默认为http://开头

		$scope.bean.seo = {};
		$scope.infoSeo = true;
		$scope.infoOther = true;
		$scope.faceCheck = true;
		$scope.productSame = true;

		$scope.isLinkFlag = false;

		$scope.isThumbnail = false; //是否有缩略图。

			$scope.$watch('bean.cmsTags', function(newVal) {
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
			},true);

		$scope.configDesc = {
			maximumWords: 600,
			initialFrameWidth: '100%',
			initialFrameHeight: 100,
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
			.success(function (data, status, headers, config) {
				if (data.isSuccess) {
					$scope.collectionBean = data.data;
				} else {
					platformModalSvc.showWarmingMessage(data.data, '提示');
				}
			})
			.error(function (data, status, headers, config) {
				platformModalSvc.showWarmingMessage('系统异常或网络不给力！', '提示');
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
			$scope.productSame = false;
		};
		$scope.noLink  = function () {
			$scope.isLinkFlag = false;

			$scope.infoSeo =true;
			$scope.infoOther = true;
			$scope.faceCheck = true;
			$scope.productSame = true;
		};



		//修改就去加载表单数据。
		if ($stateParams.id) {
			if ($stateParams.isLink === 'true') {
				$scope.hasLink();
			}

			$http.get('/pccms/productCtg/' + $stateParams.id)
				.success(function (data, status, headers, config) {
					if (data.isSuccess) {
						$scope.bean = data.data;

						//图片。
						$scope.img = {};
						if (data.data.imgSm.url) {
							$scope.imageExist = true;
							$scope.isThumbnail = true;
							$scope.img.thumbnail = [];
							$scope.img.thumbnail[0] = {};
							$scope.img.thumbnail[0].url = data.data.imgSm.url;
						}

						$scope.classify.activeItemBean = {
							_id: data.data.parentCtg.id,
							name: data.data.parentCtg.name,
							url: data.data.url
						};

						if (data.data.imgMd.url) {
							if (data.data.isLink) {
								$scope.img.iconClassify = [];
								$scope.img.iconClassify[0] = {};
								$scope.img.iconClassify[0].url = data.data.imgMd.url;
							} else {
								$scope.img.lmicon = [];
								$scope.img.lmicon[0] = {};
								$scope.img.lmicon[0].url = data.data.imgMd.url;
							}

						}
						try {
							$scope.listTempOk = {};
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
						platformModalSvc.showWarmingMessage(data.data, '提示');
					}
				}).error(function (data, status, headers, config) {
					platformModalSvc.showWarmingMessage('系统异常或网络不给力！', '提示');
				});

		}
		else {
			
			$http.get('/pccms/productCtg/tree/all')
				.success(function (data, status, headers, config) {
					if (data.isSuccess) {
						$scope.collectionBean = data.data;
						if(data.data.length){
							$scope.classify.activeItemBean = {
								_id: data.data[0]._id,
								name: data.data[0].name,
								url: data.data[0].url
							};
						}
					} else {
						platformModalSvc.showWarmingMessage(data.data, '提示');
					}
				})
				.error(function (data, status, headers, config) {
					platformModalSvc.showWarmingMessage('系统异常或网络不给力！', '提示');
				});

		}


		$scope.setNetAddress = function () {

			if ($scope.bean.name && !$stateParams.id) {
				$http({
					method: 'GET',
					url: '/pccms/productCtg/validateStaticPageName',
					params: {
						'id': '',
						'staticPageName': codefans_net_CC2PY($scope.bean.name)
					}
				}).success(function (data, status, headers, config) {
					if (data.isSuccess) {
						$scope.bean.seo.staticPageName = data.data;
					} else {
						platformModalSvc.showWarmingMessage(data.data, '提示');
					}
				}).error(function (data, status, headers, config) {
					platformModalSvc.showWarmingMessage('系统异常或网络不给力！', '提示');
				});
			} else if (!$scope.bean.name && !$stateParams.id) {
				$scope.bean.seo.staticPageName = '';
			}
		};

		//验证网页访问地址是否重复
		$scope.verRepeat = function () {
			id = $stateParams.id ? $stateParams.id : "";
			$http({
				method: 'GET',
				url: '/pccms/productCtg/validateStaticPageName',
				params: {'id': id, 'staticPageName': codefans_net_CC2PY($scope.bean.seo.staticPageName)}
			}).success(function (data) {
				if (data.isSuccess) {
					$scope.bean.seo.staticPageName = data.data;
				} else {
					platformModalSvc.showWarmingMessage(data.data, '提示');
				}
			}).error(function (data) {
				platformModalSvc.showWarmingMessage('系统异常或网络不给力！', '提示');
			});
		};


		//加载下拉树。
		$scope.classify = {};
		$scope.classify.activeItemBean = {};
		$scope.bean.pageTpl = [];
		//获取列表页模板
		$http({
			method: 'GET',
			url: '/pccms/productCtg/projPageTplList/type',
			params: {'pageTplType': 'LIST'}
		}).success(function (data, status, headers, config) {
			if (data.isSuccess) {
				if (data.data) {
					$scope.tempList = data.data;
					if ($scope.tempList && $scope.tempList.length) {
						var hasCheckedItem = false;
						angular.forEach($scope.tempList, function (tempItem) {
							if ($scope.listTempOk[tempItem._id]) {
								hasCheckedItem = true;
								$scope.bean.pageTpl[0] = {
									'id': tempItem._id,
									'type': 'LIST'
								}
								return false;
							}
						});
						if (!hasCheckedItem) {
							//清空脏数据
							//默认第一个打钩
							$scope.listTempOk[$scope.tempList[0]._id] = true;
							$scope.bean.pageTpl[0] = {
								'id': $scope.tempList[0]._id,
								'type': 'LIST'
							}
						}
					}
					else {
						$scope.bean.pageTpl[0] = null;
					}
				}
			} else {
				platformModalSvc.showWarmingMessage(data.data, '提示');
			}
		}).error(function (data, status, headers, config) {
			platformModalSvc.showWarmingMessage('系统异常或网络不给力！', '提示');
		});

		//获取详情页模板
		$http({
			method: 'GET',
			url: '/pccms/productCtg/projPageTplList/type',
			params: {'pageTplType': 'DETAIL'}
		}).success(function (data, status, headers, config) {
			if (data.isSuccess) {
				if (data.data) {
					$scope.tempDetail = data.data;
					if ($scope.tempDetail && $scope.tempDetail.length) {
						var hasCheckedItem = false;
						angular.forEach($scope.tempDetail, function (tempItem) {
							if ($scope.detailTempOk[tempItem._id]) {

								hasCheckedItem = true;
								//赋予对应的值

								$scope.bean.pageTpl[1] = {
									'id': tempItem._id,
									'type': 'DETAIL'
								}
								return false;
							}
						});
						if (!hasCheckedItem) {
							//清空脏数据
							//默认第一个打钩
							$scope.detailTempOk[$scope.tempDetail[0]._id] = true;
							//赋予对应的值
							$scope.bean.pageTpl[1] = {
								'id': $scope.tempDetail[0]._id,
								'type': 'DETAIL'
							}
						}
					}
					else {
						$scope.bean.pageTpl[1] = null;
					}
				}
			} else {
				platformModalSvc.showWarmingMessage(data.data, '提示');
			}
		}).error(function (data, status, headers, config) {
			platformModalSvc.showWarmingMessage('系统异常或网络不给力！', '提示');
		});


		//列表模板选中。
		$scope.listTempOk = {};
		for (var k in $scope.listTempOk) {
			$scope.listTempOk[k] = false;
		}
		$scope.selectListImageOne = function (row) {
			for (var k in $scope.listTempOk) {
				$scope.listTempOk[k] = false;
			}
			$scope.listTempOk[row._id] = true;
			$scope.bean.pageTpl[0] = {
				'id': row._id,
				'type': 'LIST'
			}
		};

		//详情模板选中。
		$scope.detailTempOk = {};
		for (var k in $scope.detailTempOk) {
			$scope.detailTempOk[k] = false;
		}

		$scope.selectDetailImageOne = function (row) {
			for (var k in $scope.detailTempOk) {
				$scope.detailTempOk[k] = false;

			}
			$scope.detailTempOk[row._id] = true;
			$scope.bean.pageTpl[1] = {
				'id': row._id,
				'type': 'DETAIL'
			}

		};

		var flagSpeedTree = false;
		$scope.itemTreeChanged = function () {
			flagSpeedTree = true;

		};
		$scope.clearFormBtn = function() {
			$state.go('addproductclass', {
				'moduleId': $stateParams.moduleId,
				'name': $stateParams.name,
				'page': $stateParams.page
			}, {
				reload: true
			});
		};
		//提交保存。
		$scope.saveBean = function () {
 
			//获取moduleId
			if ($stateParams.moduleId) {
				$scope.bean.moduleId = $stateParams.moduleId;
			}
			if ($scope.isLinkFlag) {
				$scope.bean.isLink = true;
				$scope.bean.seo = null;
			}else{
				$scope.bean.isLink = false;
			}

			//获取下拉树参数
			if (flagSpeedTree || !$scope.bean.path) {
				$scope.classify.activeItemBean.path
					? $scope.bean.path = $scope.classify.activeItemBean.path + $scope.classify.activeItemBean._id + ','
					: $scope.bean.path = ',' + $scope.classify.activeItemBean._id + ',';

			}


			$scope.bean.imgSm.url = $('#thumbnail').attr('src') || '';
			if ($scope.isLinkFlag) {
				$scope.bean.imgMd.url = $('#wlicon').attr('src') || '';
			} else {
				$scope.bean.imgMd.url = $('#lmicon').attr('src') || '';

			}

			var _saveBean;
			if ($stateParams.id) { //修改。
				_saveBean = $http.put('/pccms/productCtg/' + $stateParams.id, $scope.bean);
			} else { //新增。
				_saveBean = $http.post('/pccms/productCtg', $scope.bean);
			}

			_saveBean.success(function (data) {
				var tip = $stateParams.id ? '修改成功！':'新增成功！';
				if (data.isSuccess) {
					platformModalSvc.showSuccessTip(tip);
					$state.go('productClassList', {
						'moduleId': $stateParams.moduleId,
						'name': $stateParams.name,
						'page': $stateParams.page
					});
				} else {
					platformModalSvc.showWarmingMessage(data.data, '提示');
				}
			}).error(function (data) {
				platformModalSvc.showWarmingMessage('系统异常或网络不给力！', '提示');
			});
		};


		/********  其他属性  新建 end**************/
		$scope.addtype = function () {
			$modal.open({
				templateUrl: 'addProperty.html',
				controller: 'addOtherTypeCtrl',
				backdrop: 'static',
				size: 'lg'
			});
		};
		/********其他属性  新建end**************/
		$rootScope.lists = [];
		$rootScope.long = 1;
		$rootScope.mylist = [];
		//修改数据  传入序号与方式
		$scope.changtype = function (index, way) {
			console.log($rootScope.long);
			for (list in $scope.mylist) {
				if (way == "up") {
					if ($scope.mylist[list].index == index) {

						$scope.mylist[list].index = index - 1;
					} else if ($scope.mylist[list].index == (index - 1)) {
						console.log("ok");
						$scope.mylist[list].index = index;
					}
				} else if (way == "down") {
					if ($scope.mylist[list].index == index) {
						$scope.mylist[list].index = index + 1;
					} else if ($scope.mylist[list].index == (index + 1)) {
						$scope.mylist[list].index = index;
					}
				}
			}
			jtou();
			pxun();
		}
		//箭头状态
		function jtou() {
			for (list in $scope.mylist) {
				if ($rootScope.long == 1) {
					$scope.mylist[list].up = false;
					$scope.mylist[list].down = false;

				} else if ($scope.mylist[list].index == 1) {
					$scope.mylist[list].down = true;
					$scope.mylist[list].up = false;
				} else if ($scope.mylist[list].index == $rootScope.long - 1) {
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
					if ($scope.lists[j].index == (i + 1)) {
						$rootScope.mylist.push($scope.lists[j]);
					}
				}
			}

			console.log($scope.mylist)
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
		}
		//修改数据
		$rootScope.tochange = function (ele) {

			$scope.mylist.splice(index, 1);
			$scope.lists.splice(index, 1);
			$rootScope.long--;
			console.log($scope.mylist);
		}

	}])


//相同属性添加
	.controller('addOtherTypeCtrl', ['utils', '$scope', '$modalInstance', '$rootScope', function (utils, $scope, $modalInstance, $rootScope) {
		$scope.ok = function () {

			$modalInstance.close();
		};

		$scope.cancel = function () {
			$modalInstance.dismiss();
		};
		//选择文件类型
		var type = "text";
		$scope.checkway = function (mod) {
			type = "mod";
			if (mod == "text") {

				$(".textbox,.tishi,.txmore").show();
				$(".dtbox").hide();
			} else {
				$(".textbox,.smwd,.tishi,.txmore").hide();
				$(".dtbox").show();
			}
		}

		//显示input  还是textarea

		$scope.moretoggle = function () {

			if ($('.smwd').is(":hidden")) {
				$(".smwd").show();
			} else {
				$(".smwd").hide();

			}
		}


		//添加属性个数
		var index = 5;
		$scope.inputlist = [{"num": "1"}, {"num": "2"}, {"num": "3"}, {"num": "4"}, {"num": "5"}];

		$scope.addtext = function () {
			index++;
			$scope.inputlist.push({'num': index})


		}

		//定义数据
		$scope.adddata = {};//定义一级容器


		//添加数据
		$scope.adddatafun = function () {

			if (type == "text") {
				$scope.adddata.value = $scope.zdcd ? $scope.zdcd : $scope.zdcdbg;
			} else {
				$scope.adddata.value = [];
				for (var i = 0; i < $scope.inputlist.length; i++) {
					if ($scope.inputlist[i].sx) {
						$scope.adddata.value.push($scope.inputlist[i].sx)

					}
				}

			}
			$scope.adddata.index = $rootScope.long;
			$scope.lists.push($scope.adddata);
			$rootScope.mylist.push($scope.adddata);
			jtou();
			$rootScope.long++;
			//console.log($rootScope.mylist);
			$scope.adddata = {};
			$modalInstance.close();
		}

		//总数据

		//通过序号判断上下箭头
		function jtou() {
			for (list in $scope.lists) {
				if ($rootScope.long == 1) {
					$scope.mylist[list].up = false;
					$scope.mylist[list].down = false;

				} else if ($scope.mylist[list].index == 1) {
					$scope.mylist[list].down = true;
					$scope.mylist[list].up = false;
				} else if ($scope.mylist[list].index == $rootScope.long) {
					$scope.mylist[list].up = true;
					$scope.mylist[list].down = false;
				} else {
					$scope.mylist[list].up = true;
					$scope.mylist[list].down = true;
				}
			}
		}
	}]);
