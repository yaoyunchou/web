var tplMarketApp = angular.module('tplMarketApp', ['ui.tree', 'platform', 'common', 'ng.ueditor', 'ui.bootstrap', 'ui.bootstrap.pagination']);

//模板市场
tplMarketApp.controller('tplMarketCtrl', ['$scope', '$http', '$state', '$stateParams', 'utils', 'platformModalSvc', 'mobilePreviewSvc','desktopMainSvc', function ($scope, $http, $state, $stateParams, utils, platformModalSvc, mobilePreviewSvc,desktopMainSvc) {
	//筛选类型
	$scope.filterType = 'single';
	//记录选中项
	$scope.selectList = [];
	//记录筛选列表数据
	$scope.filterData = {};
	$scope.mask = false;

	//加载标签列表
	$http.get('/pccms/tpl/loadTplTag').success(function (data, status, headers, config) {
		if (data.isSuccess) {
			$scope.tagList = data.data/*.filter(function (elem, pos) {
			 if (pos === 0) {
			 data.data[0].children.splice(0, 1);
			 }
			 return data.data;
			 })*/;
			initTagState();
			//加载初始筛选列表
			filterTplList($http, $scope.selectList.join(","));
		} else {
			platformModalSvc.showWarmingMessage(nsw.Constant.TAGFAILURE,nsw.Constant.TIP);
		}
	})
		.error(function (data, status, headers, config) {
			platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
		});

	//初始化标签选择状态
	function initTagState() {
		for (var i in $scope.tagList) {
			var item = $scope.tagList[i];
			for (var j in item.children) {
				var child = item.children[j];
			}
		}
	};

	//标签选择事件
	$scope.selectTag = function (tag, tags) {
		if (tags.isDisabled) {
			return;
		}
		if (tag.selected) {
			tag.selected = false;
			removeTag(tag._id);
		} else {
			removeSelectTag(tags);
			tag.selected = true;
			$scope.selectList.push(tag._id);
		}
		filterTplList($http, $scope.selectList.join(","));
	};
	//获取当前项目类型(手机、响应式)
	$http.get('/pccms/user/findProjType').success(function (data, status, headers, config) {
		if (data.isSuccess) {
			if(data.data === '4'){
				$scope.isSelcted4 = true;
				$scope.isSelcted5 = $scope.isSelcted9 = false;
			}else if(data.data === '5'){
				$scope.isSelcted5 = true;
				$scope.isSelcted4 = $scope.isSelcted9 = false;
			}else if(data.data === '9'){
				$scope.isSelcted9 = true;
				$scope.isSelcted4 = $scope.isSelcted5 = false;
			}
			$scope.num = data.data;
			$scope.selectList.push(data.data);
			filterTplList($http, $scope.selectList.join(","));
		} else {
			platformModalSvc.showWarmingMessage(nsw.Constant.TAGFAILURE,nsw.Constant.TIP);
		}
	});
	
	
	//去除同级标签选中项
	function removeSelectTag(tags) {
		for (var i in tags.children) {
			var item = tags.children[i];
			if (item.selected) {
				item.selected = false;
				removeTag(item._id);
			}
		}
	};

	//移除选择项
	function removeTag(tagId) {
		for (var i in $scope.selectList) {
			if (tagId == $scope.selectList[i]) {
				$scope.selectList.splice(i, 1)
				return;
			}
		}
	};

	//弹出新增模板
	$scope.addTpl = function () {
		platformModalSvc.showModal({
			backdrop: 'static',
			templateUrl: globals.basAppRoot + 'temp/tplMarket/add-tpl.html',
			controller: 'addTplCtrl',
			size: 'lg',
			userTemplate: true,
			options: {
				tag: $scope.selectList.join(",")
			}
		}).then(function (data) {
			filterTplList($http, $scope.selectList.join(","));
		});

	};

	//取消
	$scope.cancelTpl = function () {
		closeDialog();
	};

	//点击模板市场 ‘预览’
	$scope.filType = function (type) {
		$scope.filterType = type;
		filterTplList($scope.filterType, $scope.selectList.join(","));
	};

	//在模板市场中预览单页,单页id为singleId
	$scope.preSinglePag = function (singleId) {

		$state.go('preview', {'id': singleId,'num': $scope.num});
	};

	//在模板市场中预览套装,套装id
	$scope.previewPackPag = function (packId) {
		
		$state.go('previewPack', {'id': packId,'num': $scope.num});
	};
	
	//删除单页模版
	$scope.singleTplRemove = function(singleId){
		platformModalSvc.showConfirmMessage('确认删除当前模版吗？','提示',true).then(function(){
			$http({
				method: 'DELETE',
				url: globals.basAppRoot + '/tpl/page/' + singleId
			}).then(function (res) {
				if(res.data.isSuccess){
					_.remove($scope.filterData.list,{_id:singleId});
					platformModalSvc.showSuccessTip(res.data.data);
				}else{
					platformModalSvc.showWarmingMessage(res.data.data,'提示');
				}
			});
		});
	};
	
	//在模板市场中手机预览
	$scope.mobilePreview = function(tplId){
		if(tplId){
			var urlLink = globals.basAppRoot + 'pageTpl/design/' +tplId+ '/view?isPubTpl=true#/';
			mobilePreviewSvc.mobilePreview(urlLink);
		}else{
			platformModalSvc.showWarmingMessage('没有预览的链接地址！', '提示');
			return;
		}
	};
	
	//筛选模板
	function filterTplList(http, tagArr) {
		var requestUrl = '/pccms/tpl/pubPageTpl/' + $scope.filterType + '/1';
		$http({
			method: 'GET',
			url: requestUrl,
			params: {'pageSize': 1000, 'tagIds': tagArr || '', 'isPubTpl': true}
		})
			.success(function (data, status, headers, config) {
				if (data.isSuccess) {
					$scope.totalItems = data.data.totalItems;
					$scope.filterData = data.data;
					for (var i in $scope.filterData) {
						var item = $scope.filterData[i];
						for (var j in item) {
							if (item[j].imgSm == undefined) {
								item[j].imgSm = '../../img/nsw.png';
							}
						}
					}
				} else {
					platformModalSvc.showWarmingMessage(nsw.Constant.TAGFAILURE,nsw.Constant.TIP);
				}
			})
			.error(function (data, status, headers, config) {
				platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
			});
	}

}]);

//单页面预览
tplMarketApp.controller('previewCtrl', ['$scope', '$http', '$state', '$stateParams', 'platformTemplatePreviewSvc','platformModalSvc', function ($scope, $http, $state, $stateParams, previewSvc,platformModalSvc) {
	$scope.tplId = $stateParams.id;
	//筛选类型
	$scope.filterType = $stateParams.type;
	//手机、pc、响应式
	$scope.filterNum = $stateParams.num;
	//效果图、框架图之间的切换
	$scope.isShow = true;


	if(!$scope.tplId){
		$state.go('tplMarket');
	}

	$scope.breadNavs = [
		{name: '首页', href: '/js/personal/index.html#/personalInfo'},
		{href: '#', name: '我要建站'},
		{href: '#', name: '模板市场'},
		{href: '#', name: '单页预览'}
	];

	/*if(_.last($scope.breadNavs).name !== '单页预览') {
		$scope.breadNavs.push({href: '#', name: '单页预览'});
	}*/

	//取消
	$scope.cancelTpl = function () {
		closeDialog();
	}
	//关闭弹框
	function closeDialog() {
		$scope.mask = false;
	}

	//筛选模板
	$http.get('/pccms/tpl/pubPageTpl/' + $stateParams.id)
		.success(function (data, status, headers, config) {
			if (data.isSuccess) {
				$scope.dat = data.data;
			} else {
				platformModalSvc.showWarmingMessage(nsw.Constant.OPERATION,nsw.Constant.TIP);
			}
		}).error(function (data, status, headers, config) {
			platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
		});

	//右侧菜单效果图
	$scope.desket = true;
	$scope.clickDesSketch = function () {
		$scope.frmchat = $scope.design = $scope.source = $scope.tpldes = $scope.used = false;
		$scope.isShow = true;
		$scope.desket = true;
	}
	//右侧菜单框架图
	$scope.clickFrmChart = function () {
		$scope.desket = $scope.design = $scope.source = $scope.tpldes = $scope.used = false;
		$scope.isShow = false;
		$scope.frmchat = true;

	}

	var _tplId;
	//编辑公有页面源码
	$scope.editSource = function (tplId) {
		_tplId = tplId;
		$scope.mask = true;
		$scope.desket = $scope.frmchat = $scope.design = $scope.tpldes = $scope.used = false;
		$scope.source = true;
		$http({
			method: 'GET',
			url: '/pccms/tpl/page/load/' + tplId + '/?isPubTpl =' + GetRequest(),
		}).success(function (data, status, headers, config) {
			if (data.isSuccess) {
				$scope.name = data.name;
				//设计思路
				$scope.designIdea = data.designIdea;

				$scope.content = data.htmlContent;
				$scope.res = [];
				$scope.res[0] = {};
				$scope.res[0].url = data.imgSm;

				$scope.res1 = [];
				$scope.res1[0] = {};
				$scope.res1[0].url = data.imgMd;

				$scope.res2 = [];
				$scope.res2[0] = {};
				$scope.res2[0].url = data.imgLg;

				$scope.res3 = [];
				$scope.res3[0] = {};
				$scope.res3[0].url = data.imgFr;

			} else {
				platformModalSvc.showWarmingMessage(nsw.Constant.OPERATION,nsw.Constant.TIP);
			}
		}).error(function (data, status, headers, config) {
			platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
		});
	}

	$scope.saveTpl = function () {
		var obj = {};
		obj.name = $scope.name;
		obj.content = $scope.content;
		//设计思路
		obj.designIdea = $scope.designIdea;
		obj.isPubTpl = true;
		if ($scope.res) obj.imgSm = $scope.res[0].url || '';
		if ($scope.res1) obj.imgMd = $scope.res1[0].url || '';
		if ($scope.res2)obj.imgLg = $scope.res2[0].url || '';
		if ($scope.res3)obj.imgFr = $scope.res3[0].url || '';
		saveCode(obj);
	}

	function saveCode(_obj) {
		$http({//保存
			method: 'POST',
			url: '/pccms/tpl/page/' + _tplId + '/?isPubTpl =' + GetRequest(),
			data: _obj
		}).success(function (data, status, headers, config) {
			if (data.isSuccess) {
				closeDialog();
				$state.go('preview', {'id': _tplId});
			} else {
				platformModalSvc.showWarmingMessage(nsw.Constant.OPERATION,nsw.Constant.TIP);
			}
		}).error(function (data, status, headers, config) {
			platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
		});
	};

	//通过url，获取参数
	function GetRequest() {
	}

	//公有页面模板的设计
	$scope.tplDesign = function (tplId) {
		$scope.desket = $scope.frmchat = $scope.source = $scope.design = $scope.used = false;
		$scope.tpldes = true;
		previewSvc.preview(tplId, 'view',true);
	}
	$scope.tplCopy = function (_tplId) {
		$http({//保存
			method: 'GET',
			url: '/pccms/tpl/page/copy/' + _tplId
		}).success(function (data, status, headers, config) {
			if (data.isSuccess) {
				platformModalSvc.showSuccessTip(data.data)
					$state.go('tplMarket');

			} else {
				platformModalSvc.showWarmingMessage(nsw.Constant.OPERATION,nsw.Constant.TIP);
			}
		}).error(function (data, status, headers, config) {
			platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
		});
	};

	//取消
	$scope.cancelTpl = function () {
		closeDialog();
	}
	//关闭弹框
	function closeDialog() {
		$scope.mask = false;
	}

	//返回
	$scope.clickRet = function () {
		$state.go('tplMarket');
	}

}]);

//套装页面预览
tplMarketApp.controller('previewPackCtrl', ['$scope', '$http', '$state', '$stateParams', 'utils','platformModalSvc', 'platformTemplatePreviewSvc',
	function ($scope, $http, $state, $stateParams, utils,platformModalSvc, previewSvc) {

		//$scope.breadNavs.push({href: '#', name: '套装预览'});
		if(_.last($scope.breadNavs).name !== '套装预览') {
			$scope.breadNavs.push({href: '#', name: '套装预览'});
		}

		$scope.packId = $stateParams.id;
		$http.get('/pccms/tpl/pubPageTplPack/' + $scope.packId)
			.success(function (data, status, headers, config) {
				if (data.isSuccess) {
					$scope.data = data.data;
				} else {
					platformModalSvc.showWarmingMessage('系统异常或网络不给力！',nsw.Constant.TIP);
				}
			})
			.error(function (data, status, headers, config) {
				platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
			});
		//套装树形结构页面返回操作
		$scope.packUsedBack = function () {
			$state.go('preview');
		};
		//树形列表，鼠标移动到缩略图，中图显示
		$scope.mdShowed = function (name) {
			$scope.nodeName = name;
		};
		//树形列表，鼠标移动到缩略图，中图隐藏
		$scope.mdHided = function (name) {
			$scope.nodeName = !name;
		};
		//树形列表，点击缩略图，进入套装效果图页面
		$scope.singlePage = function (id) {
			$state.go('preview', {'id': id, 'type': 'pack'});
		};

		var _tplId;
		//编辑公有页面源码
		$scope.editSource = function (tplId) {
			alert(GetRequest())
			_tplId = tplId;
			$scope.mask = true;
			$scope.desket = $scope.frmchat = $scope.design = $scope.tpldes = $scope.used = false;
			$scope.source = true;
			$http({
				method: 'GET',
				url: '/pccms/tpl/page/load/' + tplId + '/?isPubTpl =' + GetRequest(),
			}).success(function (data, status, headers, config) {
				if (data.isSuccess) {
					$scope.name = data.name;
					$scope.content = data.htmlContent;
					$scope.res = [];
					$scope.res[0] = {};
					$scope.res[0].url = data.imgSm;

					$scope.res1 = [];
					$scope.res1[0] = {};
					$scope.res1[0].url = data.imgMd;

					$scope.res2 = [];
					$scope.res2[0] = {};
					$scope.res2[0].url = data.imgLg;

					$scope.res3 = [];
					$scope.res3[0] = {};
					$scope.res3[0].url = data.imgFr;

				} else {
					platformModalSvc.showWarmingMessage(nsw.Constant.OPERATION,nsw.Constant.TIP);
				}
			}).error(function (data, status, headers, config) {
				platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
			});
		}

		$scope.saveTpl = function () {
			var obj = {};
			obj.name = $scope.name;
			obj.content = $scope.content;
			//设计思路
			obj.designIdea = $scope.designIdea;
			obj.isPubTpl = false;
			if ($scope.res) obj.imgSm = $scope.res[0].url || '';
			if ($scope.res1) obj.imgMd = $scope.res1[0].url || '';
			if ($scope.res2)obj.imgLg = $scope.res2[0].url || '';
			if ($scope.res3)obj.imgFr = $scope.res3[0].url || '';
			saveCode(obj);
		}

		function saveCode(_obj) {
			$http({//保存
				method: 'POST',
				url: '/pccms/tpl/page/' + _tplId + '/?isPubTpl =' + GetRequest(),
				data: _obj
			}).success(function (data, status, headers, config) {
				if (data.isSuccess) {
					closeDialog();
					$state.go('previewPack', {'id': _tplId});
				} else {
					platformModalSvc.showWarmingMessage(nsw.Constant.OPERATION,nsw.Constant.TIP);
				}
			}).error(function (data, status, headers, config) {
				platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
			});
		}

		//公有页面模板的设计
		$scope.tplDesign = function (tplId) {
			$scope.desket = $scope.frmchat = $scope.source = $scope.design = $scope.used = false;
			$scope.tpldes = true;
			previewSvc.preview(tplId,'edit',true);
		};

		//通过url，获取参数
		function GetRequest() {
			//var url = location.search; //获取url中"?"符后的字串
//	   var theRequest = new Object();   
//	   if (url.indexOf("?") != -1) {   
//	      var str = url.substr(1);   
//	      strs = str.split("&");   
//	      for(var i = 0; i < strs.length; i ++) {   
//	         theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);   
//	      }   
//	   }   
//	   return theRequest;   
		};

	}]).controller('addTplCtrl', ['$scope', 'platformModalSvc', '$modalInstance', '$http', 'utils', '$animate', '$state', '$stateParams',
	function ($scope, platformModalSvc, $modalInstance, $http, utils, $animate, $state, $stateParams) {

		//公用模板保存
		$scope.saveTpl = function () {
			var obj = {};
			obj.tag = $scope.modalOptions.tag;
			obj.name = $scope.name;
			//设计思路
			obj.designIdea = $scope.designIdea;
			obj.content = $scope.content || '';
			obj.isPubTpl = true;
			if ($scope.res)  obj.imgSm = $scope.res[0].url || '';
			if ($scope.res1) obj.imgMd = $scope.res1[0].url || '';
			if ($scope.res2) obj.imgLg = $scope.res2[0].url || '';
			if ($scope.res3) obj.imgFr = $scope.res3[0].url || '';
			$http({
				method: 'POST',
				url: '/pccms/tpl/page/add',
				data: obj
			}).success(function (data, status, headers, config) {
				if (data.isSuccess) {
					$scope.closeModal(true);
					platformModalSvc.showSuccessTip('保存成功');
				} else {
					platformModalSvc.showSuccessTip(nsw.Constant.OPERATION, nsw.Constant.TIP);
				}
			}).error(function (data, status, headers, config) {
				platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
			});
		};
		//取消
		$scope.cancelTpl = function () {
			$scope.closeModal(false);
		}
	}]);

//模板市场，路由配置
tplMarketApp.config(['$stateProvider', '$urlRouterProvider',
	function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
		$stateProvider.state('tplMarket', {
			url: '/',
			templateUrl: 'tplMarket.html',
			controller: 'tplMarketCtrl',
			key:'tools|tplMarket'
		}).state('preview', {
			url: '/preview/{id}/{type}/{num}',
			templateUrl: 'preview.html',
			controller: 'previewCtrl',
			key:'tools|tplMarket'
		}).state('previewPack', {
			url: '/previewPack/{id}/{num}',
			templateUrl: 'previewPack.html',
			controller: 'previewPackCtrl',
			key:'tools|tplMarket'
		});
	}
]);
