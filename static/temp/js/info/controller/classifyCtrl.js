//文章分类列表
infoApp.controller('classifyCtrl',['$scope', '$http','$modal', '$state', 'utils','$stateParams','$location','$modal','platformModalSvc','platformTemplatePreviewSvc',
	function($scope,   $http, $modal ,  $state,   utils,  $stateParams,$location ,$modal, platformModalSvc, platformTemplatePreviewSvc){

		$scope.name = $stateParams.name;
		$scope.moduleId = $stateParams.moduleId

		//高级
		$scope.advancedSearch = false;
		$scope.queryParams = {'title':''};
		//高级搜索。
		$scope.advancedBtn = function() {
			//高级搜索隐藏、显示
			$scope.advancedSearch ? $scope.advancedSearch = false : $scope.advancedSearch = true;

		};

		//资讯分类快速录入
		$scope.quickAdd = function() {
			platformModalSvc.showModal({
				backdrop: 'static',
				templateUrl: globals.basAppRoot + 'temp/info/info-rapid-entry.html',
				controller: 'infoRapidEntryCtrl',
				size: 'lg',
				userTemplate:true
			});
		};


		$scope.itemTreeChanged = function(){

			console.log($scope.editree.activeItem);

			if($scope.editree.activeItem.path == null){
				path = ','+$scope.editree.activeItem._id+ ',';
			}else{
				path = $scope.editree.activeItem.path + $scope.editree.activeItem._id+ ',';
			}
		};

		//资讯分类快速编辑
		//快速编辑
		$scope.editInfo = function (_data) {

			platformModalSvc.showModal({
				backdrop: 'static',
				templateUrl:'../../module/extend/' + $stateParams.moduleId + '/ctg/speedEdit/render/',
				controller: 'editCLassCtrl',
				size: 'lg',
				page: 'ctg',
				resolve: {
					editId: function () {
						return angular.copy(_data._id);
					},
					isLinkFlag: function () {
						return angular.copy(_data.isLink);
					}
				}
			});


		};


		//修改。
		$scope.goEdit = function(item) {
			if ($stateParams.moduleId) {
				$state.go('classifyEdit', {
					'id': item._id,
					'isLink': item.isLink,
					'moduleId': $stateParams.moduleId,
					'name': $stateParams.name,
					'page': 'ctg'
				});
			} else {
				$state.go('info-classifyEdit', {
					'id': item._id,
					'isLink': item.isLink,
					'moduleId': $stateParams.moduleId,
					'name': $stateParams.name,
					'page': 'ctg'
				});
			}
		};

		//验证网页访问地址是否重复
		$scope.verRepeat = function() {
			$http({
				method: 'GET',
				url: '/pccms/proj/infoCtg/page',
				params: {'staticPageName': codefans_net_CC2PY($scope.editBean.seo.staticPageName), 'id': $scope.editBean._id}
			}).success(function(data, status, headers, config) {
				if (data.isSuccess) {
					if($stateParams.id == undefined){
						$scope.editBean.seo.staticPageName = data.data;
					}
				} else {
					platformModalSvc.showWarmingMessage(data.data,'提示');
				}
			}).error(function(data, status, headers, config) {
				platformModalSvc.showWarmingMessage('系统异常或网络不给力！','提示');
			});
		};

//	//预览
//	$scope.preview = function(id,isLink,linkUrl){
//		if(isLink == true){
//			window.open(linkUrl);
//		}else{
//			window.open('/pccms/proj/infoCtg/'+id+'/view');
//		}
//	};
		//预览(暂且不做)
		$scope.preview = function(id,isLink,linkUrl,pageTpl){
			//LIST DETAIL
			if(isLink){
				window.open(linkUrl);
			}else{
				if(pageTpl){
					//根据ctg0.id查询是否存在DETAIL
					$http.get('/pccms/proj/infoCtg/pageTplType/'+id+'?pageTplType=LIST')
						.success(function(data, status, headers, config) {
							if (data.isSuccess) {
								platformTemplatePreviewSvc.previewDetail('proj/infoCtg/{id}/view', id);
							} else {
								platformModalSvc.showWarmingMessage(data.data, '提示');
							}
						})
						.error(function(data, status, headers, config) {
							platformModalSvc.showWarmingMessage('系统异常或网络不给力！', '提示');
						});
				}else{
					platformModalSvc.showWarmingMessage('该分类不存在列表页模板!', '提示');
				}
			}
		};

		//删除前验证文章分类下的数量
		$scope.delInfoCtg = function(id){
			$http({
				method: 'GET',
				url: '/pccms/proj/infoCtg/infoArticle',
				params: {'ids': id}
			}).success(function(data, status, headers, config){
				if(data.isSuccess){
					var mes = data.data;
					if(!mes){
						mes = '该分类下无资讯';
					}

					platformModalSvc.showConfirmMessage(mes,'提示').then(function(){
						deleteCtgs(id);
						platformModalSvc.showSuccessTip('删除成功！');
					});
				}
			}).error(function(data, status, headers, config) {
				platformModalSvc.showWarmingMessage('系统异常或网络不给力！','提示');
			});

		}
		//删除分类
		function deleteCtgs(id){
			$http({
				method: 'DELETE',
				url: '/pccms/proj/infoCtg/list/all',
				params: {'ids': id}
			}).success(function(data, status, headers, config){
				if(data.isSuccess){
					$scope.reloadInfoArticle();
				}else{
				}
			}).error(function(data, status, headers, config) {
				platformModalSvc.showWarmingMessage('系统异常或网络不给力！','提示');
			});
		}

		//批量删除前验证文章分类下的数量
		$scope.deleteBatch = function(){
			var idArr = [];
			for(var key in $scope.dataList){
				var item = $scope.dataList[key];
				if(item.isChecked){
					idArr.push(item._id);
				}
			};
			if(!idArr.join(',')){
				platformModalSvc.showWarmingMessage('请选择需要删除的资讯分类！', '提示');
				return;
			}else{
				$scope.delInfoCtg(idArr.join(','));
			};
		};

		//文章分类列表刷新
		$scope.reloadInfoArticle = function(){
			$scope.currentPage = 1;
			//清空关键字。
			$scope.queryParams={'title':''};
			//获取参数，进行查询操作、
			getInfoArticleList(setParam());
		};

		//推荐
		$scope.recommend = function(item){
			$scope.item = item;
			$scope.item.isRecommend = !item.isRecommend;
			$http({
				method: 'PUT',
				url: '/pccms/proj/infoCtg/updStatus/'+item._id,
				data: {'isRecommend': $scope.item.isRecommend}
			}).success(function(data, status, headers, config) {
			}).error(function(data, status, headers, config) {
				platformModalSvc.showWarmingMessage('系统异常或网络不给力！','提示');
			});
		}

		//置顶
		$scope.displayTop = function(item){
			$scope.item = item;
			$scope.item.isDisplayTop = !item.isDisplayTop;
			$http({
				method: 'PUT',
				url: '/pccms/proj/infoCtg/updStatus/'+item._id,
				data: {'isDisplayTop': $scope.item.isDisplayTop}
			}).success(function(data, status, headers, config) {
			}).error(function(data, status, headers, config) {
				platformModalSvc.showWarmingMessage('系统异常或网络不给力！','提示');
			});

		};

		//显示
		$scope.display = function(item){
			$scope.item = item;
			$scope.item.isDisplay = !item.isDisplay;
			$http({
				method: 'PUT',
				url: '/pccms/proj/infoCtg/updStatus/'+item._id,
				data: {'isDisplay': $scope.item.isDisplay}
			}).success(function(data, status, headers, config) {
			}).error(function(data, status, headers, config) {
				platformModalSvc.showWarmingMessage('系统异常或网络不给力！','提示');
			});
		};

		//向上排序
		$scope.arrowUp = function(elem,up){
			$http({
				method: 'PUT',
				url: '/pccms/proj/infoCtg/updIndex',
				data: {'id': elem._id,'path': elem.path, 'indexType': up, 'moduleId':$stateParams.moduleId}
			}).success(function(data, status, headers, config){
				if(data.isSuccess == false){
					console.log(data.data);
				};
				if(data.isSuccess == true){
					console.log(data.data);
				};
				getInfoArticleList(setParam());
			}).error(function(data, status, headers, config){
				platformModalSvc.showWarmingMessage('系统异常或网络不给力！','提示');
			});
		};

		//向下排序
		$scope.arrowDown = function(elem,down){
			console.log($stateParams.moduleId);
			$http({
				method: 'PUT',
				url: '/pccms/proj/infoCtg/updIndex',
				data: {'id': elem._id,'path': elem.path, 'indexType': down, 'moduleId':$stateParams.moduleId}
			}).success(function(data, status, headers, config){
				if(data.isSuccess == false){

				};
				if(data.isSuccess == true){

				};

				getInfoArticleList(setParam());

				//	getInfoArticleList();
			}).error(function(data, status, headers, config){
				platformModalSvc.showWarmingMessage('系统异常或网络不给力！','提示');
			});
		};

		//关键字查询
		$scope.searchInfoArticle = function(){
			if ($scope.queryParams.title.length > 64) {
				platformModalSvc.showWarmingMessage('关键字查询字符应为0~64个字符', '提示');
				$scope.queryParams={'title':''};
				return;
			}
			//获取参数，进行查询操作
			getInfoArticleList(setParam());
		};



		//高级搜索查询。
		$scope.advancedSearchList = function(){
			var obj = setAdvancedParam();
			getInfoArticleList(obj);
		};

		//检查是否全选
		function checkAllList(){
			var flag = true;
			if($scope.dataList.length == 0){
				flag = false;
			}else{
				for(var key in $scope.dataList){
					var item = $scope.dataList[key];
					if(!item.isChecked){
						flag = false;
						break;
					}
				}
			}
			return flag;
		}

		//勾选
		$scope.checkAll = function(){
			$scope.isCheckAll = !$scope.isCheckAll;
			for(var key in $scope.dataList){
				var item = $scope.dataList[key];
				item.isChecked = $scope.isCheckAll;
			}
		};

		//全选
		$scope.check = function(dataList){
			var arr = [];
			$scope.isCheckAll = true;
			for(var key in $scope.dataList){
				var item = $scope.dataList[key];
				item.isChecked = true;
				arr.push(item._id);
			}
		}

		//反选
		$scope.fanCheck = function(dataList){
			var arr = [];
			for(var key in $scope.dataList){
				var item = $scope.dataList[key];
				if(item.isChecked){
					item.isChecked = false;
					$scope.isCheckAll = false;
				}else{
					item.isChecked = true;
					$scope.isCheckAll = true;
					arr.push(item._id);
				}
			}
			if(arr.length != dataList.length){
				$scope.isCheckAll = false;
			}else{
				$scope.isCheckAll = true;
			}
		}


		//-------------------table tree start---------------------------

		//单行选中
		$scope.checkItem = function(item) {
			item.isChecked = !item.isChecked;
			$scope.isCheckAll = checkAllList();
			//父选子全选。
			checkSelectedChildren(item);
			function checkSelectedChildren(_item) {
				//子级
				for (var k in $scope.dataList) {
					var tmp = $scope.dataList[k].path.split(',');
					if (tmp.length > _item.path.split(',').length &&
						tmp[tmp.length - 2] == _item._id) {
						checkSelectedChildren($scope.dataList[k]);
						$scope.dataList[k].isChecked = item.isChecked;
					}
				}
			};
			checkSelectedParent(item);
			function checkSelectedParent(_item){
				var pid = _item.path.split(',')[_item.path.split(',').length-2];
				if(!checkedStatus(_item.path)){
					for(var k in $scope.dataList){
						if($scope.dataList[k]._id == pid){
							$scope.dataList[k].isChecked = false;
							checkSelectedParent($scope.dataList[k]);
						}
					}
				}
			};

		};
		//判断相同的checkBox是否是全部选中。
		function checkedStatus(_path) {
			var status = true;
			for (var k in $scope.dataList) {
				if ($scope.dataList[k].path == _path) {
					if (!$scope.dataList[k].isChecked) {
						status = false;
					}
				}
			}
			return status;
		};

		//表格折叠树效果。
		$scope.collapsed = true;
		var _pid = {};
		$scope.toggleData = function(item,collapsed){
			if(!collapsed){
				_pid[item._id] = item._id;
			}else{
				_pid[item._id] = -1;
			}
		};
		$scope.showData = function(item){
			var flag = true;
			for(var k in _pid){
				if(item.path)	var arr = item.path.split(',');
				for(var i in arr){
					if(arr[i] == _pid[k])  flag = false;
				}
			}
			return flag;
		};
		//-------------------table tree end---------------------------

		//加载列表数据
		function getInfoArticleList(params){
			$http({
				method: 'GET',
				url: '/pccms/proj/infoCtg/list/all',
				params: params
			}).success(function(data, status, headers, config) {
				if(data.isSuccess){
					$scope.isCheckAll = false;
					if(data.data){
						$scope.dataList = data.data;
						for(var k in $scope.dataList){
							$scope.dataList[k].isChecked = false;
							if($scope.dataList[k].hasChildren){
								$scope.dataList[k].hasChildren = true;
							}
						}
					}
				}else{
					platformModalSvc.showWarmingMessage(data.data,'提示');
				}
			}).error(function(data, status, headers, config) {
				platformModalSvc.showWarmingMessage('系统异常或网络不给力！','提示');
			});
		};

		//init quuery.
		getInfoArticleList(setParam());


		//设置参数(高级搜索)。
//	$scope.advanced = {};
		function setAdvancedParam() {
			var obj = new Object();

			console.info($scope.advanced);
			if ($scope.advanced) {

				console.info($scope.moduleId);
				if ($scope.advanced.title){
					obj.title = $scope.advanced.title || ''; //资讯分类名称
				}
				if($scope.advanced.isRecommend){
					obj.isRecommend = $scope.advanced.isRecommend; //推荐
				}
				if($scope.advanced.isDisplayTop){
					obj.isDisplayTop = $scope.advanced.isDisplayTop; //置顶
				}

				obj.isDisplay = $scope.advanced.isDisplay; //显示、隐藏、不限

			};
			if($scope.moduleId){
				obj.moduleId = $scope.moduleId;
			}
			return obj;
		};

		//设置参数。(普通查询)
		function setParam() {
			var obj = new Object();

			if ($scope.queryParams.title) {
				obj.title = $scope.queryParams.title;
			} else {
				obj.title = '';
			}

			if($scope.moduleId){
				obj.moduleId = $scope.moduleId;
			}
			return obj;
		};

	}]).controller('editCLassCtrl',['$scope', '$modalInstance', '$http', 'utils','$animate','$state','$stateParams','editId','isLinkFlag','platformModalSvc',
	function($scope,   $modalInstance,   $http,   utils,  $animate,  $state,  $stateParams,  editId,isLinkFlag,platformModalSvc) {
		$scope.classify={};
		$scope.classify.activeItemBean = {};
		$scope.isLinkFlag =isLinkFlag;

		$http.get('/pccms/proj/infoCtg/' + editId)
			.success(function(data, status, headers, config) {
				if (data.isSuccess) {

					$scope.bean = data.data;
					//加载下拉树。
					$scope.classify.activeItemBean = {
						_id: data.data.parentCtg.id,
						name: data.data.parentCtg.name
					};
					$http.get('/pccms/proj/infoCtg/tree/all?moduleId=' + $stateParams.moduleId)
						.success(function(data, status, headers, config) {
							if (data.isSuccess) {
								$scope.collectionBean = data.data;
							} else {
								platformModalSvc.showWarmingMessage(data.data,'提示');
							}
						})
						.error(function(data, status, headers, config) {
							platformModalSvc.showWarmingMessage('系统异常或网络不给力！','提示');
						});

				} else {
					platformModalSvc.showWarmingMessage(data.data,'提示');
				}
			}).error(function(data, status, headers, config) {
				platformModalSvc.showWarmingMessage('系统异常或网络不给力！','提示');
			});


		//加载下拉树。

		$http.get('/pccms/proj/infoCtg/tree/all?moduleId='+$stateParams.moduleId)
			.success(function(data, status, headers, config) {
				if (data.isSuccess) {
					$scope.collectionEdit = data.data;
				} else {
					platformModalSvc.showWarmingMessage(data.data,'提示');
				}
			})
			.error(function(data, status, headers, config) {
				platformModalSvc.showWarmingMessage('系统异常或网络不给力！','提示');
			});

		var flagSpeedTree = false;
		$scope.itemChanged = function(){
			flagSpeedTree = true;
		};
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
		$scope.ok = function() {
			if(flagSpeedTree){
				$scope.classify.activeItemBean.path
					? $scope.bean.path = $scope.classify.activeItemBean.path + $scope.classify.activeItemBean._id + ','
					: $scope.bean.path = ',' + $scope.classify.activeItemBean._id + ',';

			}
			$scope.bean.parentCtg.id = $scope.classify.activeItemBean._id;

			$http.put('/pccms/proj/infoCtg/' + $scope.bean._id, $scope.bean)
				.success(function(data, status, headers, config) {
					if (data.isSuccess) {

						$modalInstance.close();

						$state.go('classify', {
							'moduleId': $stateParams.moduleId,
							'name': $stateParams.name,
							'page': $stateParams.page
						}, {
							reload: true
						});
						platformModalSvc.showSuccessTip('修改成功！');

					} else {
						platformModalSvc.showWarmingMessage(data.data, '修改失败');
					}
				}).error(function(data, status, headers, config) {
					platformModalSvc.showWarmingMessage('系统异常或网络不给力！', '提示');
				});
		};

		$scope.cancel = function() {
			$modalInstance.dismiss();
		};


//			$scope.setNetAddress = function() {
//				console.log("!!!!");
//				if (!$scope.bean.name) {
//
//
//					//utils.alertBox('提示', "输入不能为空！");
//				} else {
//
//					$scope.titlelostflag=false;
//					$http({
//						method: 'GET',
//						url: '/pccms/proj/infoArticle/page',
//						params: {
//							'staticPageName': codefans_net_CC2PY($scope.bean.name),
//							'id': ''
//						}
//					}).success(function(data, status, headers, config) {
//						if (data.isSuccess) {
//							if ($stateParams.id == undefined) {
//
//								$scope.bean.seo.staticPageName = data.data;
//
//
//							}
//						} else {
//							console.log('操作失败。' + data.data);
//						}
//					}).error(function(data, status, headers, config) {
//						console.log('系统异常或网络不给力！');
//					});
//
//				}
//			};
		//验证网页访问地址是否重复
		$scope.verRepeat = function() {
			var id = '';
			if (editId) {
				id = editId;
			}
			$http({
				method: 'GET',
				url: '/pccms/proj/infoArticle/page',
				params: {
					'staticPageName': codefans_net_CC2PY($scope.bean.seo.staticPageName),
					'id': id
				}
			}).success(function(data, status, headers, config) {
				if (data.isSuccess) {
					$scope.bean.seo.staticPageName = data.data;
				} else {
					platformModalSvc.showWarmingMessage(data.data,'提示');
				}
			}).error(function(data, status, headers, config) {
				platformModalSvc.showWarmingMessage('系统异常或网络不给力！','提示');
			});
		};

	}]).controller('infoRapidEntryCtrl', ['$scope','platformModalSvc', '$modalInstance', '$http', '$q', '$animate', '$state', '$stateParams',
	function ($scope,platformModalSvc, $modalInstance, $http, $q, $animate, $state, $stateParams){
		$scope.enter={};
		$scope.enter.activeItem = {};

		var setNetAddress = function () {
			var defer = $q.defer();
			$scope.beanEnter.seo = $scope.beanEnter.seo ||{};
			if ($scope.beanEnter.name && !$scope.beanEnter.id) {
				$http({
					method: 'GET',
					url: '/pccms/proj/infoArticle/page',
					params: {
						'staticPageName': codefans_net_CC2PY($scope.beanEnter.name),
						'id': ''
					}
				}).success(function (data, status, headers, config) {
					if (data.isSuccess) {
						$scope.beanEnter.seo.staticPageName = data.data;
					} else {
						platformModalSvc.showWarmingMessage(data.data, '提示');
					}
					defer.resolve(true);
				}).error(function (data, status, headers, config) {
					platformModalSvc.showWarmingMessage('系统异常或网络不给力！', '提示');
					defer.resolve(true);
				});
			} else if (!$scope.beanEnter.name && !$scope.beanEnter.id) {
				$scope.beanEnter.seo.staticPageName = '';
				defer.resolve(true);
			}

			return defer.promise;
		};

		$http.get('/pccms/proj/infoCtg/tree/all?moduleId='+$stateParams.moduleId)
			.success(function(data, status, headers, config) {
				if (data.isSuccess) {
					$scope.collectionEnter = data.data;
					$scope.enter.activeItem = {
						_id: data.data[0]._id,
						name: data.data[0].name
					};
				} else {
					platformModalSvc.showWarmingMessage(data.data, '提示')
				}
			})
			.error(function(data, status, headers, config) {
				platformModalSvc.showWarmingMessage('系统异常或网络不给力！','提示')
			});

		//快速录入.
		$scope.editComfirm = function(){
			if ($scope.enter.activeItem.path ) {
				$scope.beanEnter.path = $scope.enter.activeItem.path + $scope.enter.activeItem._id + ',';
			} else {
				$scope.beanEnter.path = ',' + $scope.enter.activeItem._id + ',';
			}

			if($stateParams.moduleId){
				$scope.beanEnter.moduleId = $stateParams.moduleId;
			}

			setNetAddress().then(function () {
				$http.post('/pccms/proj/infoCtg', $scope.beanEnter)
					.success(function (data, status, headers, config) {
						if (data.isSuccess) {
							$state.go('classify', {
								'moduleId': $stateParams.moduleId,
								'name': $stateParams.name,
								'page': $stateParams.page
							}, {reload: true});
							$scope.closeModal(false);
							platformModalSvc.showSuccessTip('录入成功！');
						} else {
							platformModalSvc.showWarmingMessage(data.data, '提示');
						}
					}).error(function (data, status, headers, config) {
						platformModalSvc.showWarmingMessage('系统异常或网络不给力！', '提示');
					});
			});

		};

		$scope.closeForm = function(){
			$scope.closeModal(false);
		};

	}]);
