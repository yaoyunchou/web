var expandApp = angular.module('expandApp', ['ui.tree', 'platform', 'common', 'ng.ueditor', 'ui.bootstrap', 'ui.bootstrap.pagination', 'ui.nested.combobox']);

var module;

//频道扩展。
expandApp.controller('channelCtrl', ['$scope', '$rootScope', '$http', '$state', 'utils', 'platformModalSvc', '$modal',
	function ($scope, $rootScope, $http, $state, utils, platformModalSvc, $modal) {
		getExtendList();
		//加载列表数据
		function getExtendList(params) {
			$http({
				method: 'GET',
				url: '/pccms/module/extend/list/all',
				params: params
			}).success(function (data, status, headers, config) {
				if (data.isSuccess) {
					if (data.data) {
						$scope.modules = data.data;
					} else {
						return;
					}
				} else {
					platformModalSvc.showWarmingMessage(data.data,nsw.Constant.TIP);
				}
			}).error(function (data, status, headers, config) {
				platformModalSvc.showWarmingMessage('系统异常或网络不给力！',nsw.Constant.TIP);
			});
		}

		//复制模板
		$scope.copyModule = function (params) {
			if (params.isDisabled) {
				//alert("你访问的被锁了");
				platformModalSvc.showWarmingMessage('你访问的被锁了', '提示');
			} else {
				$http.post('/pccms/module/extend/' + params._id + '/copy')
					.success(function (data, status, headers, config) {
						if (data.isSuccess) {
							getExtendList();
							$scope.$emit('onMenuUpdated');
						} else {
							platformModalSvc.showWarmingMessage(data.data,nsw.Constant.TIP);
						}
					}).error(function (data, status, headers, config) {
					platformModalSvc.showWarmingMessage('系统异常或网络不给力！',nsw.Constant.TIP);
					});
			}
		}

		//打开lock 提示弹窗
		$scope.lockinfo = function (params) {
			"use strict";
			module = params;
			if (params.isDisabled) {

				platformModalSvc.showConfirmMessage('确定要启用当前模块吗？', '提示').then(function () {
					$scope.updModule();

				});
				$scope.updModule = function updModule() {
					if (module.isDisabled === true) {

						module.isDisabled = false;
					} else {
						module.isDisabled = true;
					}

					$http.put('/pccms/module/extend/' + module._id, module)
						.success(function (data, status, headers, config) {
							if (data.isSuccess){
								getExtendList();
								$scope.$emit('onMenuUpdated');
							} else {
								platformModalSvc.showWarmingTip(data.data, '提示');
							}
						}).error(function (data, status, headers, config) {
							platformModalSvc.showWarmingTip('系统异常或网络不给力', '提示');
						});
				};

			} else {
				platformModalSvc.showConfirmMessage('确定要关闭当前页面吗？关闭后，后台编辑人员将不能访问这个模块。', '提示').then(function () {
					$scope.updModule();

				});
				$scope.updModule = function () {

					if (module.isDisabled === true) {
						module.isDisabled = false;
					} else {
						module.isDisabled = true;
					}

					$http.put('/pccms/module/extend/' + module._id, module)
						.success(function (data, status, headers, config) {
							if (data.isSuccess){
								getExtendList();
								$scope.$emit('onMenuUpdated');
							} else {
								platformModalSvc.showWarmingTip(data.data);
							}
						}).error(function (data, status, headers, config) {
						platformModalSvc.showWarmingMessage('系统异常或网络不给力！',nsw.Constant.TIP);
						});
				};
			}
		};
		//打开删除弹窗
		$scope.deletebox = function (params) {
			$scope.deleteModuleMsg = "";
			$scope.deleteboxHttp = function deleteboxHttp(){
				$http({
					method: 'GET',
					url: '/pccms/module/extend/' + params._id + '/ctgNum',
					params: {'pageSize': 20, 'tagIds': 'TAG001'}
				}).success(function (data, status, headers, config) {
					if (data.isSuccess) {
						$scope.deleteModuleMsg  = ( data.data.ctgNum|| data.data.articleNum) ? ' 系统检查到您已经在此模块录入了'+ data.data.ctgNum+'个栏目，'+ data.data.articleNum+'篇文章删除当前模块，则此模块将被移至回收站，你可以从回收站找回当前模块。' : ' 系统检查到此模块为新添加模块，没有录入任何栏目和文章，删除当前模块后台不受影响，则此模块被移至回收站，你可以从回收站找回当前模块'
						console.log($scope.deleteModuleMsg);
						platformModalSvc.showConfirmMessage($scope.deleteModuleMsg , '提示').then(function () {
							$scope.delModule();
						});
					} else {
						platformModalSvc.showWarmingMessage(data.data, nsw.Constant.TIP);
					}
				}).error(function (data, status, headers, config) {
					platformModalSvc.showWarmingTip('系统异常或网络不给力', nsw.Constant.TIP);
				});
			}
			$scope.deleteboxHttp();
			$scope.delModule = function delModule() {
				$http({
					method: 'DELETE',
					url: '/pccms/module/extend/' + params._id,
					params: {}
				}).success(function (data, status, headers, config) {
					if (data.isSuccess){
						$scope.$emit('onMenuUpdated');
						getExtendList();
					} else {
						platformModalSvc.showWarmingMessage(data.data, nsw.Constant.TIP);
					}
				}).error(function (data, status, headers, config) {
					platformModalSvc.showWarmingTip('系统异常或网络不给力', nsw.Constant.TIP);
				});
			}
		};
		//打开增加频道弹窗
		$scope.addChannel = function () {
			platformModalSvc.showModal({
				templateUrl: 'addChannelmodalBox.html',
				controller: 'addChannelmodalBoxCtrl',
				size: 'md',
				options: {
					type: 'add'
				}
			}).then(function () {
				getExtendList();
				$scope.$emit('onMenuUpdated');
			});
		};

		$scope.editChannel = function editChannel(data) {
			if (data.isDefault) {
				return;
			}
			platformModalSvc.showModal({
				templateUrl: 'addChannelmodalBox.html',
				controller: 'addChannelmodalBoxCtrl',
				size: 'md',
				options: {
					type: 'edit',
					data: data
				}
			}).then(function () {
				getExtendList();
				$scope.$emit('onMenuUpdated');
			});

		};
	}])
//增加页面控制器
	.controller('addChannelmodalBoxCtrl', ['$scope', 'platformModalSvc', '$http', '$state', 'utils', function ($scope, platformModalSvc, $http, $state, utils) {

		$scope.modal = {
			title: $scope.modalOptions.type === 'edit' ? '编辑内容模块' : '添加内容模块'
		};

		if ($scope.modalOptions.type === 'edit') {
			$scope.formData = angular.copy($scope.modalOptions.data);
		} else {
			$scope.formData = {name: '', dirName: '', desc: ''};
		}

		$scope.ok = function () {
			//$modalInstance.close();
			$scope.closeModal(true);
		};

		$scope.cancel = function () {
			//$modalInstance.dismiss();
			$scope.closeModal(false);
		};
		/*******name失去焦点，dirName转拼音*******/
		$scope.checkDirName = function () {
			var name = $scope.formData.name;
			if (typeof(name) !== 'undefined' && $scope.modalOptions.type === 'add') {
				$scope.formData.dirName = codefans_net_CC2PY(name);
			}

		}


		var doSaveEditData = function doSaveEditData(data) {
			$http.put('/pccms/module/extend/' + $scope.formData._id, $scope.formData)
				.success(function (data, status, headers, config) {
					if (data.isSuccess) {
						angular.extend($scope.modalOptions.data, $scope.formData);
						$scope.closeModal(true);
						platformModalSvc.showSuccessTip('保存成功!');
					} else {
						platformModalSvc.showWarmingTip(data.data);
					}
				}).error(function (data, status, headers, config) {
					platformModalSvc.showErrorMessage('系统异常或网络不给力！','提示');
				});
		};

		var doSaveNewData = function doSaveNewData() {
			$http.post('/pccms/module/extend/', $scope.formData)
				.success(function (data, status, headers, config) {
					if (data.isSuccess) {
						$scope.closeModal(true);
						platformModalSvc.showSuccessTip('保存成功!');
					} else {
						platformModalSvc.showWarmingTip(data.data);
					}
				}).error(function (data, status, headers, config) {
					platformModalSvc.showErrorMessage('系统异常或网络不给力！','提示');
				});
		};

		$scope.saveModule = function saveModule() {
			if ($scope.formData.dirName) {
				if ($scope.modalOptions.type === 'edit') {
					if ($scope.modalOptions.data.dirName !== $scope.formData.dirName) {
						platformModalSvc.showConfirmMessage('修改频道目录将影响您已经做好的搜索引擎优化，是否确认修改？', '提示').then(function () {
							doSaveEditData();
						})
					} else {
						doSaveEditData();
					}

				} else {
					doSaveNewData();
				}
			} else {
				platformModalSvc.showWarmingMessage('放置目录不为空！', '提示');
			}
		};
	}])


//分类配置。
expandApp.controller('categoryCtrl', ['$scope', '$state', '$http', '$stateParams', '$modal', 'utils', '$rootScope', 'platformModalSvc', function ($scope, $state, $http, $stateParams, $modal, utils, $rootScope, platformModalSvc) {

	$scope.pagename = $stateParams.page == "ctg" ? "分类配置" : "文章配置";
	$scope.optionFields =[];

	$scope.fromData = {};
	$scope.infoBases;
	$scope.infoSEOs = [];
	$scope.todata = function (obj, value) {
		obj.isShow = value;
	};


	/********分类配置start**************/
	$scope.getHttp = function () {
		$http({
			method: 'GET',
			url: "/pccms/module/extend/" + $stateParams.moduleId + "/" + $stateParams.page + "/compotent",
		}).success(function (data, status, headers, config) {
			if (data.isSuccess) {
				$scope.basedata = data.data;
				$scope.infoBases = data.data.infoBase;
				$scope.infoSeos = data.data.infoSeo;
				$scope.infoOthers = data.data.infoOther;
				if(data.data.optionFields){
					$scope.optionFields = data.data.optionFields;
				}
			} else {
				platformModalSvc.showWarmingMessage(data.data, nsw.Constant.TIP);
			}
		}).error(function (data, status, headers, config) {
			platformModalSvc.showErrorMessage('系统异常或网络不给力！',nsw.Constant.TIP);
		});
	}
	$scope.getHttp();
	/********分类配置end**************/

	/********提交修改start**************/
	$scope.changeOK = function () {
		$http({
			method: 'PUT',
			url: '/pccms/module/extend/compotent',
			data: $scope.basedata
		}).success(function (data, status, headers, config) {
			if (data.isSuccess) {
				$state.go('channel');
				platformModalSvc.showSuccessTip(nsw.Constant.SAVESUC);
			} else {
				platformModalSvc.showWarmingTip('获取失败！');
			}
		}).error(function (data, status, headers, config) {
			platformModalSvc.showErrorMessage('系统异常或网络不给力！',nsw.Constant.TIP);
		});
	};
	/********提交修改end**************/


	/*重置start*/
	$scope.reset = function () {
		"use strict";
		mforeach($scope.infoBases);
		mforeach($scope.infoSeos);
		mforeach($scope.infoOthers);

		function mforeach(eles) {
			angular.forEach(eles, function (ele) {
				ele.isShow = true;
			});
		}
	}
	/*重置end*/


	/********  其他属性  新建 end**************/
	$scope.addtype = function () {
		platformModalSvc.showModal({
			backdrop: 'static',
			templateUrl: 'addProperty.html',
			controller: 'addOtherTypeCtrl',
			size: 'md',
			options:{
				data:angular.copy($scope.optionFields)
			}
		}).then(function(e){
			e.formId = $stateParams.moduleId;
			if($stateParams.page==="ctg"){
				e.type="MODULE_CTG";
			}else{
				e.type="MODULE_ARTICLE";
			};
			$scope.optionFields.push(e);
		});
	};
	$scope.addtypex = function () {
		platformModalSvc.showModal({
			backdrop: 'static',
			templateUrl: 'addProperty.html',
			controller: 'addOtherTypeCtrl',
			size: 'md',
			options:{
				data:angular.copy($scope.optionFields)
			}
		}).then(function(e){
			$scope.optionFields.push(e);
		});
	};
	/********其他属性  新建end**************/
	$scope.interchange = function interchange(item1,item2){
		var order =item1.orderBy;
		item1.orderBy =item2.orderBy;
		item2.orderBy =order;
		$scope.optionFields = _.sortBy($scope.optionFields,'orderBy');
	};

	//删除数据
	$scope.deletOtherType = function (index) {
		$scope.optionFields.splice(index,1);
	}
	$scope.saveOptions = function saveOptions(){
		for(item in $scope.optionFields){
			console.log(item);
			$http({
				method: 'PUT',
				url: '/pccms/orderForm/addField',
				data:$scope.optionFields[item]
			}).then(function (response) {

			});
		}

		//$scope.optionFields.
	};
}]);

//文章配置。
expandApp.controller('airticleCtrl', ['$scope', function ($scope) {


}]);


//其他属性添加
expandApp.filter("fileOption",function(){
	return function (array) {
		var str='';
		for(var i = 0; i<array.length;i++){
			if(array[i].name){
				if(i===array.length-1){
					str+= array[i].name;
				}else {
					str += array[i].name+','
				}
			}

		}
		return str;
	}
})
	.controller('addOtherTypeCtrl', ['utils', '$scope', '$modalInstance', '$rootScope', function (utils, $scope, $modalInstance) {

	$scope.adddata= {};
	$scope.adddata.formType = 'text';
	$scope.ok = function () {
		$modalInstance.close();
	};
	$scope.$watch('adddata.formType', function(newValue, oldValue) {
		if(newValue == 'text'&&!flag){
			angular.element(".smwd").show();
			angular.element(".txmore").show();
		}else if(newValue == 'text'){
			angular.element(".txmore").show();
		}else{
			angular.element(".smwd").hide();
			angular.element(".txmore").hide();
		};
	});
	$scope.cancel = function () {
		$modalInstance.dismiss();
	};
	//选择文件类型
	var type = "text";
	$scope.checkway = function (mod) {
		type = "mod";
		if (mod == "text") {

			$(".textbox").show();
			$(".dtbox").hide();
		} else {
			$(".textbox,.smwd").hide();
			$(".dtbox").show();
		}
	}

	//显示input  还是textarea
	var flag = true;
	$scope.moretoggle = function () {

		if (flag) {
			$(".smwd").show();
			flag = false;
		} else {
			$(".smwd").hide();
			flag = true;
		}
	};


	//添加属性个数
	var index = 5;
	$scope.inputlist = [{"num": "1"}, {"num": "2"}, {"num": "3"}, {"num": "4"}, {"num": "5"}];

	$scope.addtext = function () {
		index++;
		$scope.inputlist.push({'num': index});
	};
	//添加数据
	$scope.adddatafun = function () {
		if($scope.adddata.title){
			if($scope.modalOptions.data.length<1){
				$scope.adddata.orderBy = 1;
			}else{
				var current = _.maxBy($scope.modalOptions.data,'orderBy').orderBy;
				$scope.adddata.orderBy =current + 1;
			}
		}
		$scope.adddata.optionFields=[];
		if($scope.adddata.formType!='text'){
			for(var i = 0;i<$scope.inputlist.length;i++){
				$scope.adddata.optionFields[i] = {"name":$scope.inputlist[i].sx ,"defaultValue":'file'+(current + 1)}
			}
		}
		$scope.closeModal(true,$scope.adddata);
	}
	//总数据

	//通过序号判断上下箭头
	/*function jtou() {
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
	}*/
}]);

//路由配置。
expandApp.config(['$stateProvider', '$urlRouterProvider',
	function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/channel');
		$stateProvider.state('channel', { //频道扩展。
			url: '/channel',
			templateUrl: 'channel.html',
			controller: 'channelCtrl'
		}).state('category', { //分类配置。
			url: '/category?moduleId&page',
			templateUrl: 'category.html',
			controller: 'categoryCtrl'
		})
	}
]);