//文章分类录入
productApp.controller('addClassifyCtrl', ['$scope', '$http', '$state', 'utils', '$stateParams', '$rootScope', '$modal', 'platformModalSvc','desktopMainSvc',
	function ($scope, $http, $state, utils, $stateParams, $rootScope, $modal, platformModalSvc,desktopMainSvc) {
		$scope.name = $stateParams.name;
		$scope.moduleId = $stateParams.moduleId;
		$scope.bean = {};
		$scope.bean.optionFields =[];
		$scope.state = {};
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


		//存在外部链接。
		$scope.hasLink = function () {
			$scope.isLinkFlag = true;

			$scope.infoSeo = false;
			$scope.infoOther = false;
			$scope.faceCheck = false;
			$scope.productSame = false;
		};
		$scope.noLink = function () {
			$scope.isLinkFlag = false;

			$scope.infoSeo = true;
			$scope.infoOther = true;
			$scope.faceCheck = true;
			$scope.productSame = true;
		};

		$http.get(globals.basAppRoot + 'module/extend/projPorductModuleId')
			.success(function(data) {
				if (data.isSuccess) {
					$scope.state.moduleId = data.data;
				} else {
					console.log('moduleId获取失败。' + data.data);
				}
			})
			.error(function() {
				console.log('系统异常或网络不给力！');
			});

		//修改就去加载表单数据。
		if ($stateParams.id) {
			if ($stateParams.isLink === 'true') {
				$scope.hasLink();
			}
			$http.get('/pccms/productCtg/' + $stateParams.id)
				.success(function (data, status, headers, config) {
					if (data.isSuccess) {
						$scope.bean = data.data;
						$scope.bean.deleteArr =[];
						//图片。
						$scope.img = {};
						if (data.data.imgSm.urlPc || data.data.imgSm.urlPhone) {
							$scope.imageExist = true;
							$scope.isThumbnail = true;
						}

						$scope.classify.activeItemBean = {
							_id: data.data.parentCtg.id,
							name: data.data.parentCtg.name,
							url: data.data.url
						};

						$scope.listTempOk = {};
						if (data.data.pageTpl && data.data.pageTpl[0] && data.data.pageTpl[0].id) {
							$scope.listTempOk[data.data.pageTpl[0].id] = true;
						}
						if (data.data.pageTpl && data.data.pageTpl[1] && data.data.pageTpl[1].id) {
							$scope.detailTempOk[data.data.pageTpl[1].id] = true;
						}

						//设置默认广告数据
						if (!$scope.bean.data || !$scope.bean.data.ads) {
							$scope.bean.data = $scope.bean.data || {};
							$scope.bean.data.ads = $scope.bean.data.ads || null;
						}
						setAdInfo();
						$http({
							'method': 'GET',
							'url': '/pccms/orderForm/getFields',
							'params': {'formId': $stateParams.id}
						}).then(function (response) {
							if(_.isObject(response.data.data)){
								$scope.bean.optionFields  = _.sortBy( response.data.data,"orderBy");
							}
						}, function (response) {

						});
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
						if (data.data.length) {
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

		$scope.clearImageSm = function clearImageSm(){
			$scope.bean.imgSm = null;
		};

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
								};
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
							};
							$scope.bean.data = $scope.bean.data || {};
							$scope.bean.data.ads = $scope.bean.data.ads || null;
							setAdInfo();
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

		var setAdInfo = function setAdInfo() {
			if (!$scope.bean || !$scope.bean.data || !$scope.bean.pageTpl|| !$scope.bean.pageTpl[0] || !$scope.bean.pageTpl[0].id) {
				return;
			}

			var blkId = $scope.bean.pageTpl[0].id;
			$http({
				method: 'PUT',
				url: globals.basAppRoot + '/productCtg/projBlkTplADList/' + blkId,
				data: $scope.bean.data
			}).then(function (res) {
				if (res.data.isSuccess && res.data && res.data.data) {
					$scope.bean.data.ads = res.data.data.ads;
				} else {
					$scope.bean.data = {ads : null};
				}
			});
		};

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
			};
			$scope.formInfo.$setDirty(true);
			setAdInfo();
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
		$scope.clearFormBtn = function () {
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
			} else {
				$scope.bean.isLink = false;
			}

			//获取下拉树参数
			if (flagSpeedTree || !$scope.bean.path) {
				$scope.classify.activeItemBean.path
					? $scope.bean.path = $scope.classify.activeItemBean.path + $scope.classify.activeItemBean._id + ','
					: $scope.bean.path = ',' + $scope.classify.activeItemBean._id + ',';

			}

			if(_.has($scope.bean,'seo.keyword')){
				$scope.bean.seo.keyword = UniformSymbol($scope.bean.seo.keyword);
			}
			var _saveBean;
			if ($stateParams.id) { //修改。
				_saveBean = $http.put('/pccms/productCtg/' + $stateParams.id, $scope.bean);
			} else { //新增。
				_saveBean = $http.post('/pccms/productCtg', $scope.bean);
			}

			_saveBean.success(function (data) {
				var tip = $stateParams.id ? '修改成功！' : '新增成功！';
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

		//$scope.addtype = function () {
		//	$modal.open({
		//		templateUrl: 'addProperty.html',
		//		controller: 'addOtherTypeCtrl',
		//		backdrop: 'static',
		//		size: 'lg'
		//	});
		//};

		$scope.addtype = function () {
			platformModalSvc.showModal({
				backdrop: 'static',
				templateUrl: 'addProperty.html',
				controller: 'addOtherTypeCtrl',
				size: 'md',
				options:{
					data:angular.copy($scope.bean.optionFields)
				}
			}).then(function(e){
				$scope.bean.optionFields.push(e);
			});
		};
		$scope.editProduct = function  editProduct(type) {
			platformModalSvc.showModal({
				backdrop: 'static',
				templateUrl: 'addProperty.html',
				controller: 'addOtherTypeCtrl',
				size: 'md',
				options:{
					data:angular.copy($scope.bean.optionFields),
					adddata:angular.copy(type)
				}
			}).then(function(e){
				if(_.has(e,"_id")){
					type.changed = true;
				}
				if(e.formType ==="text"){
					e.data = [];
				}
				type.title = e.title;
				type.data = e.data;
				type.formType = e.formType
			});
		};
		/********其他属性  新建end**************/
		$scope.interchange = function interchange(item1,item2){
			var order =item1.orderBy;

			item1.orderBy =item2.orderBy;
			item2.orderBy =order;
			item1.changed = true;
			item2.changed = true;
			$scope.bean.optionFields = _.sortBy($scope.bean.optionFields,'orderBy');
		};
		//删除数据

		$scope.deletOtherType = function (index,file) {
			if(_.has(file,"_id")){
				file.deleted = true;
				$scope.bean.deleteArr.push(file);
			}else{
				$scope.bean.optionFields.splice(index,1);
			}
		/*	if($stateParams.id){
				$http({
					method: 'DELETE',
					url: globals.basAppRoot + '/orderForm/deleteField',
					params:{'formId':$stateParams.id,'fieldIds': file._id}
				}).then(function (response) {

				});
			}*/

		};
		$scope.saveOptions = function saveOptions(){
			for(item in $scope.bean.optionFields){
				console.log(item);
				$http({
					method: 'PUT',
					url: '/pccms/orderForm/addField',
					data:$scope.bean.optionFields[item]
				}).then(function (response) {

				});
			}

			//$scope.optionFields.
		};
		desktopMainSvc.getProjectType().then(function(){
			var isPhone = desktopMainSvc.isPoneProject();
			var isPc = desktopMainSvc.isPcProject();
			var isResponsive = desktopMainSvc.isResponsiveProject();

			$scope.showPcImage = isPc || isResponsive;
			$scope.showPhoneImage = isPhone || isResponsive;
		});

	}])
	.filter("fileOption",function(){
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
	.filter("isDelete",function(){
		return function (array) {
			if(_.isArray(array)){
				for(var i = 0; i<array.length;i++){
					if(_.has(array[i],"deleted")){
						array.splice(i,1);
					}
				}
			}
			return array;
		}
	})

//相同属性添加
	.controller('addOtherTypeCtrl', ['utils', '$scope', '$modalInstance', '$rootScope', function (utils, $scope, $modalInstance, $rootScope) {
		if(_.has($scope.modalOptions,'adddata')){
			$scope.UI ={"text":false,"radio":false,"checkbox":false,"select":false};
			switch ($scope.modalOptions.adddata.formType){
				case "text":$scope.UI.text = true; break;
				case "radio":$scope.UI.radio = true; break;
				case "checkbox":$scope.UI.checkbox = true; break;
				case "select":$scope.UI.select = true; break;
			}
			$scope.adddata = $scope.modalOptions.adddata;
			var index = $scope.adddata.data.length;
			$scope.inputlist=[];
			for(var i=0;i<$scope.adddata.data.length;i++){
				$scope.inputlist.push({"num": i+1,"sx":$scope.adddata.data[i].name,"id":$scope.adddata.data[i].id,"orderBy":$scope.adddata.data[i].orderBy});
			}

		}else{
			$scope.UI ={"text":true,"radio":true,"checkbox":true,"select":true};
			$scope.adddata= {};
			$scope.adddata.formType = 'text';
			$scope.adddata.data=[];
			var index = 5;
			$scope.inputlist = [{"num": "1"}, {"num": "2"}, {"num": "3"}, {"num": "4"}, {"num": "5"}];
		}
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
		};

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


		$scope.addtext = function () {
			index++;
			$scope.inputlist.push({'num': index});
		};
		//添加数据
		$scope.adddatafun = function () {
			var current;
			if($scope.adddata.title){
				if(_.isArray($scope.modalOptions.data)&&$scope.modalOptions.data.length<1){
					$scope.adddata.orderBy = 1;
					current = 0;
					$scope.adddata.fieldName = 'file'+(current+1);
				}else{
					 current = _.maxBy($scope.modalOptions.data,'orderBy').orderBy;
					$scope.adddata.orderBy =current + 1;
					$scope.adddata.fieldName = 'file'+(current+1);
				}
			}

			if($scope.adddata.formType!='text'){
				for(var i = 0;i<$scope.inputlist.length;i++){
					var current;
					if($scope.adddata.data.length<1){
						current = 0;
					}else {
						current = _.maxBy($scope.adddata.data, 'orderBy').orderBy;
					}
					if(_.has($scope.inputlist[i],"id")){
						$scope.adddata.data[i].name = $scope.inputlist[i].sx;
					}else{
						$scope.adddata.data[i] = {"name":$scope.inputlist[i].sx ,"defaultValue":'optionKey'+(current+1),"orderBy":current+1}
					}

				}
			}

			for(var i =$scope.adddata.data.length-1; i>=0;i--){
				if(_.has($scope.adddata.data[i],'name')){
					if(!$scope.adddata.data[i].name||$scope.adddata.data[i].name=='undefined'){
						$scope.adddata.data.splice(i,1);
					}
				}else{
					scope.adddata.data.splice(i,1);
				}
			}


			$scope.closeModal(true,$scope.adddata);
		}
	}]);
