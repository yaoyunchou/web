/*global angular, codefans_net_CC2PY, deletHtmlTag*/
(function (angular) {
	"use strict";

	angular.module('productApp').controller('editCtrl', ['$scope', '$http', '$state', '$stateParams', 'commonTool', 'utils', '$modal', '$rootScope',
		function ($scope, $http, $state, $stateParams, commonTool, utils, $modal, $rootScope) {

			$scope.name = $stateParams.name;
			$scope.moduleId = $stateParams.moduleId;

			$scope.beanStatus = $stateParams.name + '录入';


			/* // 设置轮播图图片间隔
			 $scope.myInterval = 5000;
			 // 轮播图数据初始化
			 var slides = $scope.slides = [];
			 */
			$scope.init = function () {

				$scope.bean = {};
				$scope.bean.seo = {};
				$scope.classify = {};
				$scope.bean.tabContents = [];

				$scope.bean.tabContents[0] = {"name": "详情", "value": '', "checked": true};

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
				$rootScope.img.product = [];

				$scope.breadNavs =
					[
						{href: '../index.html', name: '首页'},
						{href: 'index.html', name: '产品管理'},
						{href: '.', name: '产品录入'}
					];

				$scope.configContent = {
					maximumWords: 20000,
					initialFrameWidth: 700,
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
				$scope.configDesc = {
					maximumWords: 300,
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
				$scope.configSeoDesc = {

					maximumWords: 150,
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
				$scope.configxq = {
					initialFrameWidth: 700,
					maximumWords: 20000,
					initialFrameHeight: 300,

				};


				//$scope.init();
				//加载下拉树。
				$scope.classify.activeItemBean = {};

				$http.get('/pccms/productCtg/tree/all?moduleId=' + $stateParams.moduleId)
					.success(function (data/*, status, headers, config*/) {
						if (data.isSuccess) {
							$scope.collectionBean = data.data;
							//设置初始值
							if (!$stateParams.id) {
								$scope.classify.activeItemBean = {
									_id: data.data[0]._id,
									name: data.data[0].name
								};
							}

						} else {
							console.log('操作失败。' + data.data);
						}
					})
					/*	.error(function(data, status, headers, config) {
					 console.log('系统异常或网络不给力！');
					 })*/;

				//修改就去加载表单数据。
				if ($stateParams.id) {
					$scope.isHx = true;
					//console.log($stateParams.isLink);
					//if($stateParams.isLink) $scope.hasLink();
					if ($stateParams.isLink === 'true') {

						$scope.hasLink();
					}
					$scope.beanStatus = $stateParams.name + '修改';
					$http.get('/pccms/product/' + $stateParams.id)
						.success(function (data/*, status, headers, config*/) {
							var i;
							if (data.isSuccess) {
								$scope.bean = data.data;
								try {
									for (i = 1; i < data.data.ctgs.length; i++) {
										$scope.addedClass[i - 1] = data.data.ctgs[i];
									}
								} catch (e) {
								}


								$rootScope.img.product = [];
								//$rootScope.img.product = data.data.imgs;
								$rootScope.xqindex = 0;
								try {
									$scope.classify.activeItemBean = {
										"_id": data.data.ctgs[0].id,
										"name": data.data.ctgs[0].name
									};
								} catch (e) {
								}

								try {
									$scope.bean.tabContents[0].checked = true;
									$scope.bean.contentxq = $scope.bean.tabContents[0].value;
									for (i = 0; i < data.data.imgs.length; i++) {
										$rootScope.img.product[i] = {
											"path": data.data.imgs[i].url,
											"alt": data.data.imgs[i].alt
										};
									}
								} catch (e) {

								}


								$scope.addCategory();
							} else {
								console.log('操作失败。' + data.data);
								utils.alertBox('操作失败', data.data);
							}
						}).error(function (/*data, status, headers, config*/) {
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
					$rootScope.img.product = [];
					$rootScope.img = {};
					$scope.bean.tabContents[0] = {"name": "详情", "value": '', "checked": true};
					$scope.bean.contentxq = $scope.bean.tabContents[0].value;
				}
			};

			//验证网页访问地址是否重复
			$scope.verRepeat = function () {

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
				}).success(function (data/*, status, headers, config*/) {

					if (data.isSuccess) {
						$scope.bean.seo.staticPageName = data.data;
					} else {
						utils.alertBox('提示', data.data);
					}

				}).error(function (/*data, status, headers, config*/) {
					console.log('系统异常或网络不给力！');
				});

			};

			$scope.setNetAddress = function () {
				if (!$scope.bean.title) {
					$scope.titlelostflag = true;
					//	$scope.bean.seo = {};
					$scope.bean.seo.staticPageName = '';

					//utils.alertBox('提示', "输入不能为空！");
				} else {

					$scope.titlelostflag = false;
					$http({
						method: 'GET',
						url: '/pccms/product/validateStaticPageName',
						params: {
							'staticPageName': codefans_net_CC2PY($scope.bean.title),
							'id': ''
						}
					}).success(function (data/*, status, headers, config*/) {
						if (data.isSuccess) {
							if ($stateParams.id === undefined) {
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
					}).error(function (/*data, status, headers, config*/) {
						console.log('系统异常或网络不给力！');
					});

				}
			};

			$scope.keyWordErr = false;
			$scope.keyWordInvalid = false;
			$scope.$watch('bean.seo.keyword', function (newOptions/*, oldOptions*/) {
				if (newOptions) {
					if (newOptions.split(/,\s|/).length > 4) {
						$scope.keyWordErr = true;
						$scope.keyWordInvalid = true;
					} else {
						$scope.keyWordErr = false;
						$scope.keyWordInvalid = false;
					}
					/*(newOptions && (newOptions.split(',').length > 5 ||
					 newOptions.split(' ').length > 5 ||
					 newOptions.split('|').length > 5)) ?
					 ($scope.keyWordErr = true, $scope.keyWordInvalid = true) :
					 ($scope.keyWordErr = false, $scope.keyWordInvalid = false);*/
				}
			}, true);


			//提交操作。(产品录入)
			$scope.saveAirticle = function () {
				var i;
				if ($stateParams.moduleId) {
					$scope.bean.moduleId = $stateParams.moduleId;
				}

				$scope.bean.ctgs = [];
				try {
					$scope.bean.tabContents[$rootScope.xqindex].value = $scope.bean.contentxq;

					for (i = 0; i < $scope.bean.tabContents.length; i++) {
						$scope.bean.tabContents[i] = {
							"name": $scope.bean.tabContents[i].name,
							"value": $scope.bean.tabContents[i].value
						};
					}
				} catch (e) {
				}

				$scope.bean.contentxq = null;
				$scope.bean.ctgs[0] = {
					id: $scope.classify.activeItemBean._id,
					name: $scope.classify.activeItemBean.name
				};
				for (i = 0; i < $scope.addedClass.length; i++) {
					$scope.bean.ctgs[i + 1] = $scope.addedClass[i];
				}

				$scope.bean.imgs = [];
				try {
					for (i = 0; i < $rootScope.img.product.length; i++) {
						$scope.bean.imgs[i] = {
							"url": $rootScope.img.product[i].path,
							"alt": $rootScope.img.product[i].alt
						};


					}
				} catch (e) {

				}

				try {
					$scope.bean.imgSm.url = $('#thumbnail').attr('src');
				} catch (e) {

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
				_saveAirticle.success(function (data/*, status, headers, config*/) {

					if (data.isSuccess) {
						if ($stateParams.moduleId && $stateParams.name && $stateParams.page) {
							$state.go('list', {
								'moduleId': $stateParams.moduleId,
								'name': $stateParams.name,
								'page': $stateParams.page
							});
						} else {
							$state.go('list');
						}
					} else {
						console.log('产品录入失败。' + data.data);
						utils.alertBox('提示', data.data);
					}
				}).error(function (/*data, status, headers, config*/) {
					console.log('系统异常或网络不给力！');
				});

			};

			//添加分类。
			$scope.addCategory = function () {
				if ($(".guanlian").hasClass('hidden')) {
					$(".guanlian").removeClass("hidden").addClass("show");


					//加载下拉树。
					$scope.classify.ksActiveItemBean = {};

					$http.get('/pccms/productCtg/tree/all')
						.success(function (data/*, status, headers, config*/) {
							if (data.isSuccess) {
								$scope.productClassList = data.data;
							} else {
								console.log('操作失败。' + data.data);
							}
						})
						.error(function (/*data, status, headers, config*/) {
							console.log('系统异常或网络不给力！');
						});
				} else {
					$(".guanlian").removeClass("show").addClass("hidden");
				}
			};

			//快速添加分类。
			$scope.saveAddCategory = function () {

				var obj = {};
				obj.name = $scope.cTitle;
				obj.path = $scope.classify.ksActiveItemBean.path ?
				$scope.classify.ksActiveItemBean.path + $scope.classify.ksActiveItemBean._id + ',' :
				',' + $scope.classify.ksActiveItemBean._id + ',';
				obj.moduleId = $stateParams.moduleId;

				$http.post('/pccms/proj/infoCtg', obj)
					.success(function (data/*, status, headers, config*/) {
						if (data.isSuccess) {
							$scope.categoryDialog = false;
							$scope.mask = false;

							//加载下拉树。
							$scope.classify.activeItemBean = {};
							$http.get('/pccms/productCtg/tree/all?moduleId=' + $stateParams.moduleId)
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

						} else {
							console.log('失败。' + data.data);
							utils.alertBox('操作失败', data.data);
						}
					}).error(function (/*data, status, headers, config*/) {
					console.log('系统异常或网络不给力！');
				});

			};

			//清空表单。
			$scope.clearFormBtn = function () {
				$state.go('add', {
					'moduleId': $stateParams.moduleId,
					'name': $stateParams.name,
					'page': $stateParams.page
				}, {
					reload: true
				});
			};

			//存在外部链接。
			$scope.hasLink = function () {
				$scope.bean.isLink = true;
				$scope.isLinkFlag = true;
				$scope.infoSeo = false;
				$scope.infoOther = false;

			};

			//没有缩略图。
			$scope.hasNotExternalLinks = function () {
				$scope.ExternalLinks = false;
			};

			//有缩略图。
			$scope.hasExternalLinks = function () {
				$scope.ExternalLinks = true;
			};


			/*产品新增功能*/
			//图片轮番组件
			$scope.mov = function () {
				$(".loopbox ul").addClass("mov").removeClass("back");
			};
			$scope.back = function () {
				$(".loopbox ul").addClass("back").removeClass("mov");
			};


			$scope.movClass = function (itme) {
				var i = {"name": itme.name, "id": itme._id};
				var added = false;
				//检查addedclass 是否已经有了这个分类

				if ($scope.addedClass.length > 0) {


					for (var productClass in $scope.addedClass) {
						if (itme._id === $scope.addedClass[productClass].id ||
								$scope.classify.activeItemBean._id === itme._id) {
							added = true;

						}
					}
					if (!added) {
						$scope.addedClass.push(i);
					}
				} else {
					if ($scope.classify.activeItemBean._id !== itme._id) {
						$scope.addedClass.push(i);
					}
				}


			};
			$scope.deltClass = function (index) {
				//var i = {"name" :itme.name,"id":itme._id}
				$scope.addedClass.splice(index, 1);
			};
			$scope.itemChanged = function () {
				$scope.addedClass = [];
			};
			$rootScope.xqindex = 0;


			$scope.goChange = function (itme, index) {

				if ($rootScope.xqindex !== index) {
					$scope.bean.tabContents[$rootScope.xqindex].checked = false;
					$scope.bean.tabContents[$rootScope.xqindex].value = deletHtmlTag($scope.bean.contentxq);
					$scope.bean.contentxq = itme.value;
					$rootScope.xqindex = index;
					itme.checked = true;
				}

			};
			$rootScope.addXqList = function (i) {
				$scope.bean.tabContents.push(i);
			};
			$scope.deltXqList = function (i) {
				$scope.bean.tabContents.splice(i, 1);
			};
			//打开增加详情
			$scope.addXq = function () {
				$modal.open({
					templateUrl: 'addXq.html',
					controller: 'addXqCtrl',
					backdrop: 'static',
					size: 'md'
				});
			};


		}
	]);
}(angular));

