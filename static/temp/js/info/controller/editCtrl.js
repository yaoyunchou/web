//文章录入。
infoApp.controller('editCtrl', ['$scope','$http','$state','$stateParams','commonTool','utils','platformModalSvc',
						function($scope,$http,$state,$stateParams,commonTool,utils,platformModalSvc) {

		$scope.name = $stateParams.name;
	    $scope.moduleId = $stateParams.moduleId;
	    
	    $scope.beanStatus = $stateParams.name + '录入';
		
		var loadCtgTree = function loadCtgTree(){
			//加载下拉树。
		   $http.get('/pccms/proj/infoCtg/tree/all?moduleId='+$stateParams.moduleId)
					.success(function(data, status, headers, config) {
						if (data.isSuccess) {
							$scope.collectionBean = data.data;
							//设置初始值
							if(!$stateParams.id,data.data.length){
									$scope.classify.activeItemBean = {
										_id: data.data[0]._id,
										name: data.data[0].name
									};
							}

							
						} else {
							platformModalSvc.showWarmingMessage(data.data,'提示');
						}
					})
					.error(function(data, status, headers, config) {
						console.log('系统异常或网络不给力！');
					});			
		};
		
		//init.
		$scope.init = function() {
			$scope.bean = {};
			$scope.bean.seo = {};
			$scope.classify = {};
			$scope.bean.imgSm = {};
			$scope.classify.activeItemBean ={};
			$scope.imageExist = false; //是否存在缩略图，默认为false。

			$scope.categoryDialog = false;
			$scope.mask = false;

			$scope.isLinkFlag = false; //是否有外部链接。
			$scope.isThumbnail = false; //是否有缩略图。

			$scope.infoSeo = true;
			$scope.infoOther = true;			

			$scope.configContent = {
				maximumWords: 20000,
				initialFrameWidth: 750,
				initialFrameHeight: 450,
			};
			$scope.configDesc = {
				maximumWords: 300,
				initialFrameWidth: '100%',
				initialFrameHeight: 100,
				toolbars: [
				   			[
							 'fullscreen', 'source', '|', 'undo', 'redo', '|',
							 'bold', 'italic', 'underline', 'fontborder',  '|', 'forecolor', 'backcolor',  '|',
							 'fontfamily', 'fontsize', '|',
							 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
							 'link'
							]
				        ]
			};
			$scope.configSeoDesc = {
				maximumWords: 150,
				initialFrameHeight: 150,
				toolbars: [
				   			[
							 'fullscreen', 'source', '|', 'undo', 'redo', '|',
							 'bold', 'italic', 'underline', 'fontborder',  '|', 'forecolor', 'backcolor',  '|',
							 'fontfamily', 'fontsize', '|',
							 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
							 'link'
							]
				        ]
			};			
			
				
			loadCtgTree();
			
			//修改就去加载表单数据。
			if ($stateParams.id) {
				//if($stateParams.isLink) $scope.hasLink();
				if($stateParams.isLink === 'true'){

					$scope.hasLink();
				}
				$scope.beanStatus = $stateParams.name + '修改';
				$http.get('/pccms/proj/infoArticle/' + $stateParams.id)
					.success(function(data, status, headers, config) {
						if (data.isSuccess) {
							$scope.bean = data.data;
							//图片。
							if (data.data.imgSm.url) {
								$scope.imageExist = true;
								$scope.isThumbnail = true;
								$scope.img = {};
								$scope.img.thumbnail = [];
								$scope.img.thumbnail[0] = {};
								$scope.img.thumbnail[0].url = data.data.imgSm.url;

							}
							$scope.classify ={}
							$scope.classify.activeItemBean={}
							$scope.classify.activeItemBean = {
								"_id": data.data.ctgs[0].id,
								"name": data.data.ctgs[0].name
							};
							console.log($scope.classify.activeItemBean)
						} else {
							platformModalSvc.showWarmingMessage(data.data,'提示');
						}
					}).error(function(data, status, headers, config) {
						console.log('系统异常或网络不给力！');
					});
			} else {

				$scope.bean = {};
				$scope.bean.seo = {};
				$scope.classify = {};
				$scope.bean.imgSm = {};
                $scope.bean.content = '';
				$scope.classify.activeItemBean ={};
				$scope.bean.clicks = 1;
			}
		};

		//验证网页访问地址是否重复
		$scope.verRepeat = function() {

			var id = '';
			if ($scope.bean._id) {
				id = $scope.bean._id;
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
				console.log('系统异常或网络不给力！');
			});

		};

		$scope.setNetAddress = function() {		
			if (!$scope.bean.title) {	
				$scope.titlelostflag=true;
				$scope.bean.seo = {};
				$scope.bean.seo.staticPageName = '';
			} else {
				
				$scope.titlelostflag=false;
				$http({
					method: 'GET',
					url: '/pccms/proj/infoArticle/page',
					params: {
						'staticPageName': codefans_net_CC2PY($scope.bean.title),
						'id': ''
					}
				}).success(function(data, status, headers, config) {
					if (data.isSuccess) {
						if ($stateParams.id == undefined) {
							// if($scope.isLinkFlag){
					  //       	$scope.bean.seo = {};
					  //       }else{
					        		/*$scope.bean.seo = {};*/
							$scope.bean.seo.staticPageName = data.data;
					       // }
						
						}
					} else {
						platformModalSvc.showWarmingMessage(data.data,'提示');
					}
				}).error(function(data, status, headers, config) {
					console.log('系统异常或网络不给力！');
				});

			}
		};

		$scope.keyWordErr = false;
		$scope.keyWordInvalid = false;
		$scope.$watch('bean.seo.keyword', function(newOptions, oldOptions) {	
			(newOptions && (newOptions.split(',').length > 5 ||
				newOptions.split(' ').length > 5 ||
				newOptions.split('|').length > 5)) ?
			($scope.keyWordErr = true, $scope.keyWordInvalid = true) :
			($scope.keyWordErr = false, $scope.keyWordInvalid = false);		
		}, true);

		//提交操作。(文章录入)
		$scope.saveAirticle = function() {
			if ($stateParams.moduleId) {
				$scope.bean.moduleId = $stateParams.moduleId;
			}

			$scope.bean.ctgs = [];

			$scope.bean.ctgs[0] = {
				id: $scope.classify.activeItemBean._id,
				name: $scope.classify.activeItemBean.name
			};

			$scope.bean.imgSm.url = $('#thumbnail').attr('src');
			 if($scope.isLinkFlag){
				 $scope.bean.seo = {};
				 console.log("!!!")
				}
			console.log("$scope.bean")
			var _saveAirticle;			
			if ($stateParams.id) { //修改。	
				_saveAirticle = $http.put('/pccms/proj/infoArticle/' + $stateParams.id, $scope.bean);
			} else { //新增。
				_saveAirticle = $http.post('/pccms/proj/infoArticle', $scope.bean);
			}			
			_saveAirticle.success(function(data, status) {
				var tip = $stateParams.id ? '修改成功！':'新增成功！';
				if (data.isSuccess) {
					platformModalSvc.showSuccessTip(tip);
						if ($stateParams.moduleId && $stateParams.name && $stateParams.page){
							$state.go('list', {
								'moduleId': $stateParams.moduleId,
								'name': $stateParams.name,
								'page': $stateParams.page
							});
						}else{
							$state.go('list');
						}							
					} else {
						platformModalSvc.showWarmingMessage(data.data,'提示');
					}
				}).error(function(data, status, headers, config) {
					console.log('系统异常或网络不给力！');
				});

		};

		//添加分类
		$scope.addCategory = function() {
			platformModalSvc.showModal({				
				templateUrl: '/pccms/temp/info/info-add-classification.html',
				controller: 'infoAddClassificationCtrl',
				size: 'lg'
			}).then(function(data){
				platformModalSvc.showSuccessTip('保存成功');
				loadCtgTree();
			});

		};
		
		//清空表单。
		$scope.clearFormBtn = function() {
			$state.go('add', {
				'moduleId': $stateParams.moduleId,
				'name': $stateParams.name,
				'page': $stateParams.page
			}, {
				reload: true
			});
		};

		//存在外部链接。
		$scope.hasLink = function() {
			$scope.bean.isLink = true;
			$scope.isLinkFlag = true;
			$scope.infoSeo = false;
			$scope.infoOther = false;
		};
		$scope.noLink = function() {
			$scope.bean.isLink = false;
			$scope.isLinkFlag = false;
			$scope.infoSeo = true;
			$scope.infoOther = true;
		};

		//没有缩略图。
		$scope.hasNotThumbnail = function() {
			$scope.isThumbnail = false;
		};

		//有缩略图。
		$scope.hasThumbnail = function() {
			$scope.isThumbnail = true;
		};
	}
]).controller('editModalBoxCtrl', ['$scope', '$modalInstance', '$http', 'utils', '$animate', '$state', '$stateParams', 'editId',
                           		function ($scope, $modalInstance, $http, utils, $animate, $state, $stateParams, editId) {

	$http.get('/pccms/product/' + editId)
		.success(function (data, status, headers, config) {
			if (data.isSuccess) {
				$scope.editBean = data.data;
				//加载下拉树。
				$scope.activeItemEdit = {
					_id: data.data.ctgs[0].id,
					name: data.data.ctgs[0].name
				};
				$http.get('/pccms/productCtg/tree/all?moduleId=' + $stateParams.moduleId)
					.success(function (data, status, headers, config) {
						if (data.isSuccess) {
							$scope.collectionEdit = data.data;
						} else {
							platformModalSvc.showWarmingMessage(data.data,'提示');
						}
					})
					.error(function (data, status, headers, config) {
						console.log('系统异常或网络不给力！');
					});

			} else {
				platformModalSvc.showWarmingMessage(data.data,'提示');
			}
		}).error(function (data, status, headers, config) {
			console.log('系统异常或网络不给力！');
		});

	$scope.ok = function () {

		$scope.editBean.ctgs[0].id = $scope.activeItemEdit._id;

		$http.put('/pccms/product/' + $scope.editBean._id, $scope.editBean)
			.success(function (data, status, headers, config) {
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
					platformModalSvc.showWarmingMessage(data.data,'提示');
				}
			}).error(function (data, status, headers, config) {
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
		}).success(function (data, status, headers, config) {
			if (data.isSuccess) {
				$scope.editBean.seo.staticPageName = data.data;
			} else {
				platformModalSvc.showWarmingMessage(data.data,'提示');
			}
		}).error(function (data, status, headers, config) {
			console.log('系统异常或网络不给力！');
		});
	};

}]).controller('infoAddClassificationCtrl', ['$scope','platformModalSvc', '$modalInstance', '$http', 'utils', '$animate', '$state', '$stateParams',
function ($scope,platformModalSvc, $modalInstance, $http, utils, $animate, $state, $stateParams) {
	//$scope.cTitle = '';
	//$scope.classify={};
	//$scope.classify.activeItemBean = {};
	
	//加载下拉树
	$http.get('/pccms/proj/infoCtg/tree/all?moduleId='+$stateParams.moduleId)
		.success(function(data, status, headers, config) {
			if (data.isSuccess) {
				$scope.ksCollectionBean = data.data;
				//$scope.classify.activeItemBean = {
				//	_id: data.data[0]._id,
				//	name: data.data[0].name
				//};
			} else {
				platformModalSvc.showWarmingMessage(data.data,'提示');
			}
		}).error(function(data, status, headers, config) {
			console.log('系统异常或网络不给力！');
		});
	
	//快速添加分类。
	$scope.saveAddCategory = function() {
		
		var obj = {};
		    obj.name = $scope.cTitle;
		    obj.path = $scope.classify.ksActiveItemBean.path ? 
		    		   $scope.classify.ksActiveItemBean.path +$scope.classify.ksActiveItemBean._id+','  :
		               ','+$scope.classify.ksActiveItemBean._id+',';
		    obj.moduleId=$stateParams.moduleId;  
		    
			
		$http.post('/pccms/proj/infoCtg', obj)
			.success(function(data, status, headers, config) {
			if(data.isSuccess) {
				$scope.categoryDialog = false;
				$scope.mask = false;

				//加载下拉树。
				$scope.classify.activeItemBean = {};						 
				$http.get('/pccms/proj/infoCtg/tree/all?moduleId='+$stateParams.moduleId)
					.success(function(data, status, headers, config) {
						if (data.isSuccess) {
							$scope.collectionBean = data.data;
							$scope.closeModal(true);							
						} else {
							platformModalSvc.showWarmingMessage(data.data,'提示');
						}
					})
					.error(function(data, status, headers, config) {
						console.log('系统异常或网络不给力！');
					});
				
			} else {
				platformModalSvc.showWarmingMessage(data.data,'提示');
			}
		}).error(function(data, status, headers, config) {
			console.log('系统异常或网络不给力！');
		});

	};
	
    $scope.cancel = function(){
    	$scope.closeModal(false);
    }
	
}]);
