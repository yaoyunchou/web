//文章录入。
productApp.controller('editCtrl', ['$scope', '$http', '$state', '$stateParams', 'commonTool', 'utils','$modal','$rootScope','platformModalSvc',
	function($scope, $http, $state, $stateParams, commonTool, utils,$modal,$rootScope,platformModalSvc) {

		$scope.name = $stateParams.name;
		$scope.moduleId = $stateParams.moduleId;

		$scope.beanStatus = $stateParams.name + '录入';
		$scope.findId=false;


		/* // 设置轮播图图片间隔
	    $scope.myInterval = 5000;
	    // 轮播图数据初始化
	     var slides = $scope.slides = [];
		*/
		$scope.init = function() {

			$scope.bean = {};
			$scope.bean.seo = {};
			$scope.classify = {};
			$scope.bean.tabContents = [];

			$scope.bean.tabContents[0] = {"name":"详情","value":'',"checked":true};
		
			$scope.bean.imgSm = {};
			$scope.classify.activeItemBean = {};
			$scope.imageExist = false; //是否存在缩略图，默认为false。
			$scope.addedClass = [];//定义关联类容器

			$scope.categoryDialog = false;
			$scope.mask = false;

			$scope.isLinkFlag = false; //是否有外部链接。
			$scope.isHx = false; //是否是回显。
			$scope.ExternalLinks = false; //是否有缩略图。

			$scope.infoSeo = true;
			$scope.infoOther = true;
			$rootScope.img = {};
			$rootScope.img.productlist =[];

			$scope.configContent = {
				maximumWords: 20000,
				initialFrameWidth: '90%',
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
			$scope.configDesc = {
				maximumWords: 300,
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
			$scope.configSeoDesc = {
				maximumWords: 150,
				initialFrameWidth: '90%',
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
			$scope.configxq = {
				initialFrameWidth: '100%',
				maximumWords: 20000,
				initialFrameHeight: 450,
				
			};

            //$scope.init();
			//加载下拉树。
			$scope.classify.activeItemBean = {};

			$http.get('/pccms/productCtg/tree/all?moduleId=' + $stateParams.moduleId)
				.success(function(data, status, headers, config) {
					if (data.isSuccess) {
						$scope.collectionBean = data.data;
						//设置初始值
						if(!$stateParams.id&&data.data.length){
							    $scope.classify.activeItemBean = {
									_id: data.data[0]._id,
									name: data.data[0].name
								}
						}
						
					} else {
						console.log('操作失败。' + data.data);
					}
				})
				.error(function(data, status, headers, config) {
					console.log('系统异常或网络不给力！');
				});

			//修改就去加载表单数据。
			if ($stateParams.id) {
				$scope.findId=true;
				$scope.isHx = true;
				//console.log($stateParams.isLink);
				//if($stateParams.isLink) $scope.hasLink();
				if ($stateParams.isLink === 'true') {

					$scope.hasLink();
				}
				$scope.beanStatus = $stateParams.name + '修改';
				$http.get('/pccms/product/' + $stateParams.id)
					.success(function(data, status, headers, config) {
						if (data.isSuccess) {
							$scope.bean = data.data;
							try{
								for (var i = 1; i < data.data.ctgs.length; i++) {
									$scope.addedClass[i-1] = data.data.ctgs[i]
								};
							}catch(e){}
							$rootScope.img.product =[]
							//$rootScope.img.product = data.data.imgs;
							$rootScope.xqindex=0;
							try{
								$scope.classify.activeItemBean = {"_id":data.data.ctgs[0].id,"name":data.data.ctgs[0].name};
							}catch(e){}
						
							try{
								$scope.bean.tabContents[0].checked=true;
								$scope.bean.contentxq = $scope.bean.tabContents[0].value; 
								for (var i = 0; i < data.data.imgs.length ; i++) {				
							          $rootScope.img.product[i] = {"url":data.data.imgs[i].url,"alt":data.data.imgs[i].alt};
					                };
							}catch(e){
								
							}
												
							$scope.addCategory();                                                                                                                                                            
						} else {
							console.log('操作失败。' + data.data);
						}
					}).error(function(data, status, headers, config) {
						console.log('系统异常或网络不给力！');
					});
			} else {
				$scope.bean = {};
				$scope.bean.clicks = 1;
				$scope.bean.seo = {};
				$scope.classify = {};
				$scope.bean.imgSm = {};
				$scope.classify.activeItemBean = {};
				$scope.bean.tabContents = [];

				$rootScope.img.productlist =[];
				$rootScope.img = {}
				$scope.bean.tabContents[0]= {"name":"详情","value":'',"checked":true};
				$scope.bean.contentxq = $scope.bean.tabContents[0].value;
			}
		};

		//验证网页访问地址是否重复
		$scope.$watch('img.productlist',function(newvalue,oldvalue){
			$scope.img.product = $scope.img.product?$scope.img.product :[];
			$scope.addImgList(newvalue);
		});

		$scope.addImgList = function(val){
			var imglen = $rootScope.img.product ? $rootScope.img.product.length:0;
			angular.forEach(val,function(img, index){
				$rootScope.img.product[imglen+index]=img;
			});
		}

		$scope.verRepeat = function() {

			var id = '';
			if ($scope.bean._id) {
				id = $scope.bean._id;
			}

			$http({
				method: 'GET',
				url: '/pccms/product/validateStaticPageName',
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
				$scope.titlelostflag = true;
			//	$scope.bean.seo = {};
				$scope.bean.seo.staticPageName = '';
				platformModalSvc.showWarmingMessage('输入不能为空！','提示');
			} else {
				$scope.titlelostflag = false;
				$http({
					method: 'GET',
					url: '/pccms/product/validateStaticPageName',
					params: {
						'staticPageName': codefans_net_CC2PY($scope.bean.title),
						'id': ''
					}
				}).success(function(data, status, headers, config) {
					if (data.isSuccess) {
						if ($stateParams.id == undefined) {
							if ($scope.isLinkFlag) {
								$scope.bean.seo = {};
							} else {
								//$scope.bean.seo = {};
								$scope.bean.seo.staticPageName = data.data;
							}

						}
					} else {
						console.log('操作失败。' + data.data);
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

		//提交操作。(产品录入)
		$scope.saveAirticle = function() {
			"use strict";
			if ($stateParams.moduleId) {
				$scope.bean.moduleId = $stateParams.moduleId;
			}

			$scope.bean.ctgs = [];
			try{
				$scope.bean.tabContents[$rootScope.xqindex].value = $scope.bean.contentxq;

				for (var i = 0; i < $scope.bean.tabContents.length ; i++) {
					
					$scope.bean.tabContents[i]={"name":$scope.bean.tabContents[i].name,"value":$scope.bean.tabContents[i].value};
				}
			}catch(e){}
			
			$scope.bean.contentxq =null;
			$scope.bean.ctgs[0] = {
				id: $scope.classify.activeItemBean._id,
				name: $scope.classify.activeItemBean.name
			}
			for (var i = 0; i < $scope.addedClass.length ; i++) {
				$scope.bean.ctgs[i+1] =  $scope.addedClass[i];
			}
			
			$scope.bean.imgs=[];
			try{
                for (var i = 0; i < $rootScope.img.product.length ; i++) {
					$scope.bean.imgs[i] = {"url":$rootScope.img.product[i].url,"alt":$rootScope.img.product[i].alt};
		    	}
			}catch(e){
				
			}
			
            try{
            	$scope.bean.imgSm.url = $('#thumbnail').attr('src');
            }catch(e){
            	
            }
			
			if ($scope.isLinkFlag) {
				$scope.bean.seo = {};
			}

			
			var _saveAirticle;
			if ($stateParams.id) { //修改。	
				_saveAirticle = $http.put('/pccms/product/' + $stateParams.id, $scope.bean);
			} else { //新增。
				_saveAirticle = $http.post('/pccms/product', $scope.bean);
			}
			_saveAirticle.success(function(data, status, headers, config) {
				var tip = $stateParams.id ? '修改成功！':'新增成功！';
				if (data.isSuccess) {
					platformModalSvc.showSuccessTip(tip);
					if ($stateParams.moduleId && $stateParams.name && $stateParams.page) {
						$state.go('list', {
							'moduleId': $stateParams.moduleId,
							'name': $stateParams.name,
							'page': $stateParams.page
						});
						platformModalSvc.showSuccessTip('录入成功！');
					} else {
						$state.go('list');
					}
				} else {
					platformModalSvc.showWarmingMessage(data.data,'提示');
				}
			}).error(function(data, status, headers, config) {
				platformModalSvc.showWarmingMessage('系统异常或网络不给力！');
			});

		}

		//添加分类。
		$scope.addCategory = function() {
			if($(".guanlian").hasClass('hidden')){
				 $(".guanlian").removeClass("hidden").addClass("show");
				 $(".addattra").addClass("addattraon").removeClass("addattra");
					//加载下拉树。
					$scope.classify.ksActiveItemBean = {};

					$http.get('/pccms/productCtg/tree/all')
						.success(function(data, status, headers, config) {
							if (data.isSuccess) {
								$scope.productClassList = data.data;
							} else {
								console.log('操作失败。' + data.data);
							}
						})
						.error(function(data, status, headers, config) {
							console.log('系统异常或网络不给力！');
						});
			}else{
				$(".addattraon").addClass("addattra").removeClass("addattraon");
				$(".guanlian").removeClass("show").addClass("hidden");
			}
		}

		//快速添加分类。
		$scope.saveAddCategory = function() {
			var obj = {};
			obj.name = $scope.cTitle;
			obj.path = $scope.classify.ksActiveItemBean.path ?
				$scope.classify.ksActiveItemBean.path + $scope.classify.ksActiveItemBean._id + ',' :
				',' + $scope.classify.ksActiveItemBean._id + ',';
			obj.moduleId = $stateParams.moduleId;

			$http.post('/pccms/proj/infoCtg', obj)
				.success(function(data, status, headers, config) {
					if (data.isSuccess) {
						$scope.categoryDialog = false;
						$scope.mask = false;

						//加载下拉树。
						$scope.classify.activeItemBean = {};
						$http.get('/pccms/productCtg/tree/all?moduleId=' + $stateParams.moduleId)
							.success(function(data, status, headers, config) {
								if (data.isSuccess) {
									$scope.collectionBean = data.data;
								} else {
									console.log('操作失败。' + data.data);
								}
							})
							.error(function(data, status, headers, config) {
								console.log('系统异常或网络不给力！');
							});

					} else {
						console.log('失败。' + data.data);
						platformModalSvc.showWarmingMessage(data.data,'提示');
					}
				}).error(function(data, status, headers, config) {
					console.log('系统异常或网络不给力！');
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
		$scope.hasNotExternalLinks = function() {
			$scope.ExternalLinks = false;
		};

		//有缩略图。
		$scope.hasExternalLinks = function() {
			$scope.ExternalLinks = true;
		};


		/*产品新增功能*/
		//图片轮番组件
		$scope.mov = function() {
			$(".loopbox ul").addClass("mov").removeClass("back");
		}
		$scope.back = function() {
			$(".loopbox ul").addClass("back").removeClass("mov");
		}


		$scope.movClass = function(itme){
			var i = {"name" :itme.name,"id":itme._id}
			var added = false;
			//检查addedclass 是否已经有了这个分类

			if($scope.addedClass.length>0){
			

                for(productClass in $scope.addedClass){
                		
					if(itme._id == $scope.addedClass[productClass].id||$scope.classify.activeItemBean._id ==itme._id){
                          added = true;
                        
					}
			    } ;
			    if (!added) {
			    	$scope.addedClass.push(i);
			    };
			}else {
				if($scope.classify.activeItemBean._id ==itme._id){
				
                    
				}else{
					$scope.addedClass.push(i);
				}
			}	
		}
		$scope.deltClass = function(index){
			
		    	//var i = {"name" :itme.name,"id":itme._id}
                $scope.addedClass.splice(index,1);
			
			
		}
		$scope.itemChanged = function () {
			$scope.addedClass = [];
	    };
	    $rootScope.xqindex = 0;
	    
	    
	    $scope.goChange = function (itme,index) {
	    	
	    	if($rootScope.xqindex == index){
	    		
	    	}else{
	    		$scope.bean.tabContents[$rootScope.xqindex].checked=false;
	    		$scope.bean.tabContents[$rootScope.xqindex].value = deletHtmlTag($scope.bean.contentxq);
	    		$scope.bean.contentxq = itme.value;
	    		$rootScope.xqindex = index
			     itme.checked=true;
	    	}
			
	    };
	    $rootScope.addXqList = function (i) {
			$scope.bean.tabContents.push(i);
	    };
	    $scope.deltXqList = function (i) {
			$scope.bean.tabContents.splice(i,1);
	    };
	     //打开增加详情
	    $scope.addXq = function () {
		    if($scope.bean.tabContents.length>=5){
			    platformModalSvc.showWarmingMessage('最多添加5条标签！','提示');
		    }else{
			    $modal.open({
				    templateUrl: 'addXq.html',
				    controller: 'addXqCtrl',
				    backdrop: 'static',
				    size: 'md'
			    });
		    }

	    };
	}
])

.controller('addXqCtrl', ['$scope', '$modalInstance','$http','$state','utils','$rootScope', function($scope,$modalInstance,$http,$state,utils,$rootScope) {

	$scope.ok = function() {		
		
		$modalInstance.close();
	};
	$scope.cancel = function() {
		$modalInstance.dismiss();
	};
	$scope.adddatafun = function () {
		var i ={"name":$scope.name,"value":''}
			$rootScope.addXqList(i);
			$scope.ok ();
	};
	
}]);
