angular.module('common', ['platform', 'ngLocale', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'commonJQuery', 'ng.webuploader'])
	.factory('utils', ['$rootScope', '$location', '$http', '$modal', function ($rootScope, $location, $http, $modal) {
		"use strict";
		function alertBox(title, msg, ok, size, btnLbl) {
			$modal.open({
				template: '<div class="defa-font"><div class="modal-header"><h3 class="modal-title">{{title}}</h3></div><div class="modal-body"><p ng-bind-html="msg"></p></div><div class="modal-footer"><button class="btn btn-primary" ng-click="ok()"><span class="glyphicon glyphicon-ok"></span> ' + (btnLbl ? btnLbl : '确定') + '</button></div></div>',
				controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
					$scope.title = title;
					$scope.msg = msg;
					$scope.ok = function () {
						$modalInstance.close();
					};
				}],
				backdrop: 'static',
				size: size ? size : 'sm'
			})
				.result.then(
				function () {
					if (ok !== undefined) {
						ok();
					}
				}
			);
		}

		function confirmBox(title, msg, ok, cancel, size) {
			$modal.open({
				template: '<div class="defa-font"><div class="modal-header"><h3 class="modal-title">{{title}}</h3></div><div class="modal-body"><p>{{msg}}</p></div><div class="modal-footer"><button class="btn btn-primary" ng-click="ok()"><span class="glyphicon glyphicon-ok"></span> 确定</button><button class="btn btn-default" ng-click="cancel()"><span class="glyphicon glyphicon-remove"></span> 取消</button></div></div>',
				controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
					$scope.title = title;
					$scope.msg = msg;
					$scope.ok = function () {
						$modalInstance.close();
					}
					$scope.cancel = function () {
						$modalInstance.dismiss();
					};
				}],
				backdrop: 'static',
				size: size ? size : 'sm'
			})
				.result.then(
				function () {
					ok();
				},
				function () {
					if (cancel !== undefined) {
						cancel();
					}
				}
			);
		}

		function openWin(title, msg, ok, cancel, size, btnLbl) {
			var html = [];
			html[html.length] = '<div class="modal-header">';
			html[html.length] = '    <h3 class="modal-title">' + title + '</h3>';
			html[html.length] = '</div>';
			html[html.length] = '<div class="modal-body">' + msg + '</div>';
			html[html.length] = '<div class="modal-footer">';
			html[html.length] = '    <button class="btn btn-primary" type="button" ng-click="ok()">' + (btnLbl ? btnLbl : '确定') + '</button>';
			html[html.length] = '    <button class="btn btn-default" type="button" ng-click="cancel()">取消</button>';
			html[html.length] = '</div>';
			$modal.open({
				template: html.join(''),
				controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
					$scope.title = title;
					$scope.msg = msg;
					$scope.ok = function () {
						var flag = false;
						if (ok === undefined) {
							flag = true;
						} else if (typeof ok === 'function') {
							var state = ok();
							if (state || state === undefined) {
								flag = true;
							}
						}
						if (flag) {
							$modalInstance.close();
						}
					}
					$scope.cancel = function () {
						var flag = false;
						if (cancel === undefined) {
							flag = true;
						} else if (typeof cancel === 'function') {
							var state = cancel();
							if (state || state === undefined) {
								flag = true;
							}
						}
						if (flag) {
							$modalInstance.dismiss();
						}
					};
				}],
				backdrop: 'static',
				size: size ? size : ''
			});
		}

		//图片预览弹窗
		function imgPreview(image) {
			$modal.open({
				template: '<div class="c-dialog-img-preview"><i class="fa fa-times" ng-click="close();"></i><img nsw-src="' + image + '"/></div>',
				controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
					$scope.close = function () {
						$modalInstance.close();
					};
				}],
				backdrop: 'static', 
				size: ''
			});
		}

		return {
			alertBox: alertBox,
			confirmBox: confirmBox,
			openWin: openWin,
			imgPreview: imgPreview,

			helpBox: function (image, size) {
				$modal.open({
					template: '<div class="defa-font"><div class="modal-body help"><img class="w-100" nsw-src="{{asset(image)}}" /></div><div class="modal-footer"><button class="btn btn-default" ng-click="close()"><span class="glyphicon glyphicon-remove"></span> 关闭</button></div></div>',
					controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
						$scope.image = image;
						$scope.close = function () {
							$modalInstance.close();
						};
					}],
					backdrop: 'static',
					size: size ? size : 'md'
				});
			}
		};
	}])

	.directive('confirmClick', ['utils', function (utils) {
		"use strict";
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				element.bind('click', function (e) {
					e.stopPropagation();

					if ((attrs.confirmWhen === undefined || scope.$eval(attrs.confirmWhen))) {
						utils.confirmBox('是否确认？', attrs.confirmMsg,
							function () {
								scope.$eval(attrs.confirmClick);
							}
						);
					} else {
						scope.$eval(attrs.confirmClick);
					}
				});
			}
		};
	}])

	.constant('datepickerConfig', {
		formatDay: 'd',
		formatMonth: 'MMMM',
		formatYear: 'yyyy年',
		formatDayHeader: 'EEE',
		formatDayTitle: 'yyyy年 MMMM',
		formatMonthTitle: 'yyyy年',
		datepickerMode: 'day',
		minMode: 'day',
		maxMode: 'year',
		showWeeks: false,
		startingDay: 1,
		yearRange: 20,
		minDate: null,
		maxDate: null
	})

	.constant('datepickerPopupConfig', {
		datepickerPopup: 'yyyy-M-d',
		currentText: '今天',
		clearText: '清除',
		closeText: '关闭',
		closeOnDateSelection: true,
		appendToBody: false,
		showButtonBar: true
	})

	.directive('pickDate', [
		function () {
			"use strict";
			return {
				restrict: 'E',
				scope: {
					model: '='
				},
				link: function (scope, element) {
					element.removeAttr('class');
					element.removeAttr('model');
					element.removeAttr('required');
					element.removeAttr('placeholder');

					scope.opened = false;

					scope.open = function ($event, status) {
						$event.preventDefault();
						$event.stopPropagation();
						scope.opened = status;
					};
				},
				template: function (element, attrs) {
					var classPhrase1 = attrs.class !== undefined ? 'class="' + attrs.class + '" ' : '';
					var classPhrase2 = attrs.class !== undefined ? ' ' + attrs.class : '';
					var requiredPhrase = attrs.required !== undefined ? 'required ' : '';
					var placeholderPhrase = attrs.placeholder !== undefined ? 'placeholder="' + attrs.placeholder + '" ' : '';

					return '\<div class="input-group">\<input type="text" ' + classPhrase1 + requiredPhrase + placeholderPhrase + 'datepicker-popup ng-model="model" is-open="opened" ng-click="open($event, true)" />\<span class="input-group-btn">\<button class="btn btn-default' + classPhrase2 + '" ng-click="open($event, !opened)">\<span class="glyphicon glyphicon-calendar"></span>\</button>\</span>\</div>';
				}
			};
		}
	])
//图片库lx
	.controller('imglibWinCtrl', ['$scope', '$modalInstance', '$http', '$modal', 'utils', '$rootScope', 'platformModalSvc', function ($scope, $modalInstance, $http, $modal, utils, $rootScope, platformModalSvc) {
		"use strict";

		var backImgList = $scope.modalOptions.backImgList;
		var imgConfig = $scope.modalOptions.imgConfig;
		//切换tab事件
		$scope.tabSelected = function (tab) {
			$scope.activeTab = tab;
		};
		$scope.chaochu = true;
		$scope.goTrue = function () {
			$scope.chaochu = true;
		}
		//获取上传组件实例

		var imgUploader;
		$scope.fileName = "";
		$scope.getUploader = function (uploader) {
			imgUploader = uploader;
		};

		$scope.$on('bigCurrentPageChanged', function (e, value) {
			$scope.imgboxHttp(value);
		});
		$scope.imgboxHttp = function (index) {
			$http({
				method: 'GET',
				url: globals.basAppRoot + '/file/list',
				params: {'pageNum': index, 'pageSize': 1000, 'fileName': $scope.fileName}
			}).success(function (data) {
				if (data.isSuccess) {
					$scope.imglibList = data.data.list;

					checkIsItemSelected($scope.imglibList);

					angular.forEach(backImgList, function (img) {
						var backImg = angular.copy(_.find($scope.imglibList, {url: img.url})) ||
							{_id: '-1', url: '' + ''};
						$scope.selectImgList.push(backImg);
					});

					//$scope.totalItems = data.data.totalItems;
					$scope.bigTotalItems = data.data.totalItems;
				} else {
					platformModalSvc.showWarmingMessage(data.data, '提示');
				}
			}).error(function () {
				platformModalSvc.showWarmingMessage('系统异常或网络不给力！', '提示');
			});
		};

		if (backImgList) {
			var checkIsItemSelected = function checkIsItemSelected(imglibList) {
				imgdiff(imglibList);
			};
			//对比已经选中的与图片列表
			var imgdiff = function imgdiff(imglblist) {
				angular.forEach(backImgList, function (selected) {
					angular.forEach(imglblist, function (item) {
						if (item._id === selected._id || item.url === selected.url) {
							item.selected = true;
						}
					});
				});
			};
		}


		//$scope.imgboxHttp(1);
		//图片预览队列
		$scope.fileQueued = {};
		//图片上传成功队列
		$scope.fileSuccessQueued = [];
		//图片库文件选择队列
		$scope.selectImgList = [];
		$scope.fileQueuedlength = 0;

		//是否多图片上传
		var multiple = imgConfig.count > 1;
		var faileCounter = 0;
		//图片上传配置
		$scope.imgConfig = {
			multiple: multiple,//是否多图片上传
			extensions: imgConfig.ext,
			beforeFileQueued: function (uploader, file) {//当图片添加前回调
				//console.log(file);//3145728
				if(file.size>3145728){
					setTimeout(function(){
						platformModalSvc.showWarmingTip(file.name+"大小超过3M!");
					},3000 * faileCounter++);
					return false;
				}else{
					//验证可上传图片的张数
					var len = uploader.getFiles('queued').length;//查询上传队列中的文件数
					if (len >= imgConfig.count) {
						if ($scope.chaochu) {
							$scope.chaochu = false;
							platformModalSvc.showWarmingMessage('只能上传 ' + imgConfig.count + ' 张图片！！！', '提示');
						}
						return false;
					}
				}


			},
			fileQueued: function (uploader, file) {//当图片添加队列时回调
				uploader.makeThumb(file, function (error, src) {
					if (error) {
						//不支持预览
						return;
					}
					//加入上传队列
					$scope.fileQueuedlength++
					var id = file.id, img = {};
					img.src = src;
					img.name = delExtension(file.name);
					img.state = '准备上传';
					img.hasProgress = false;
					img.progress = 0;
					$scope.fileQueued[id] = img;
					faileCounter = 0;
					/*var length = $scope.fileQueuedlength || 0;
					 $scope.fileQueuedlength = length + 1;*/
					//触发页面刷新
					$scope.$apply();
				}, 94, 79);

			},
			uploadStart: function (uploader, file) {//当文件开始上传时
				var id = file.id;
				uploader.option('formData', {'zdyName': $scope.fileQueued[id].name});
			},
			uploadProgress: function (uploader, file, percentage) {//图片上传进度回调
				var id = file.id;
				$scope.fileQueued[id].hasProgress = true;
				$scope.fileQueued[id].progress = percentage;
				//触发页面刷新
				$scope.$apply();
			},
			uploadSuccess: function (uploader, file, res) {//图片上传成功回调
				var id = file.id;
				$scope.fileQueued[id].hasProgress = false;
				$scope.fileQueued[id].progress = 100;
				$scope.fileQueued[id].state = '上传成功';
				$scope.fileSuccessQueued.push(res.data);
				//触发页面刷新
				$scope.$apply();
			},
			uploadError: function (uploader, file) {//图片上传失败回调
				var id = file.id;
				$scope.fileQueued[id].hasProgress = false;
				$scope.fileQueued[id].state = '上传失败';
				//触发页面刷新
				$scope.$apply();
			},
			uploadFinished: function () {//当所有文件上传结束时触发
				//添加上传成功回调代码
				$scope.closeModal(true, $scope.fileSuccessQueued);
				//$modalInstance.close($scope.fileSuccessQueued);
			},
			error: function (uploader, res) {//当图片验证出错时回调
				if (res == 'Q_TYPE_DENIED') {
					platformModalSvc.showWarmingMessage('图片类型不正确！！！', '提示');
				} else if (res == 'Q_EXCEED_SIZE_LIMIT') {
					platformModalSvc.showWarmingMessage('图片总大小超出！！！', '提示');
				} else if (res == 'Q_EXCEED_NUM_LIMIT') {
					platformModalSvc.showWarmingMessage('图片数量超出！！！', '提示');

				}
			}
		};


		//移除队列图片
		$scope.removeQueuedImg = function (key) {
			$scope.fileQueuedlength--;
			delete $scope.fileQueued[key];//删除预览队列中的图片
			imgUploader.removeFile(key, true);//删除上传队列中的图片
		};
		/*图片预览轮番*/
		$scope.movLeft = function (e) {
			"use strict";
			var index = $("." + e).attr('index');
			index++;
			var elength = $("." + e).children("li").length;
			if (index * 6 < elength) {

				$("." + e).animate({"left": -index * 6 * 112 + "px"}, 1000);
				$("." + e).attr("index", index);
			}
		}
		$scope.movRight = function (e) {
			"use strict";
			var index = $("." + e).attr('index');
			//var elength =  $("."+e).children("li").length;
			index--;
			if (index >= 0) {

				$("." + e).animate({"left": -index * 6 * 112 + "px"}, 1000);

				$("." + e).attr("index", index);
			}
		}
		//图片预览
		$scope.imgPreview = function (image, event) {
			utils.imgPreview(image);
			event.stopPropagation();
		};

		//选择图片
		$scope.selectImg = function (item) {

			if (item.selected) {
				$scope.removeImg(item);
				return;
			}
			if ($scope.selectImgList.length == imgConfig.count) {
				platformModalSvc.showWarmingMessage('只能上传 ' + imgConfig.count + ' 张图片！！！', '提示');

				return;
			}
			item.selected = true;
			$scope.selectImgList.push(item);
		};

		//移除选中图片
		$scope.removeImg = function (item) {
			if (item.selected) {
				item.selected = false;
			}
			angular.forEach($scope.imglibList, function (imgitem) {
				if (item._id === imgitem._id) {
					imgitem.selected = false;
				}
			});

			for (var i in $scope.selectImgList) {

				if (item._id === $scope.selectImgList[i]._id) {
					$scope.selectImgList.splice(i, 1);

					/*	imgdiff($scope.selectImgList,$scope.imglibList);*/
					return;
				}
			}
		};
		//图片库条件查询
		//用户名系弹窗
		$scope.findPic = function (imgParam) {
			$scope.fileName = imgParam!=undefined?imgParam:"";
			$http({
				method: 'GET',
				url: globals.basAppRoot + '/file/list?fileName=' + $scope.fileName,
			}).success(function (data) {
				if (data.isSuccess) {
					$scope.imglibList = data.data.list;
				} else {
					platformModalSvc.showWarmingMessage('获取失败！', '提示');
				}
			});

		}


		//确定
		$scope.ok = function () {
			if ('local' == $scope.activeTab) {
				var len = imgUploader.getFiles('queued').length;//查询上传队列中的文件数
				if (len == 0) {
					platformModalSvc.showWarmingMessage('请上传图片！！！', '提示');
					return;
				}
				//开始上传图片
				imgUploader.upload();
			} else if ('imglib' == $scope.activeTab) {
				//选择图库图片
				var len = $scope.selectImgList.length;
				if (len == 0) {
					platformModalSvc.showWarmingMessage('请选择图片！！！', '提示');
					return;
				}
				$scope.closeModal(true, $scope.selectImgList);
				//$modalInstance.close($scope.selectImgList);
			} else {
				//$modalInstance.close();
				$scope.closeModal(false);
			}
		};

		//取消
		$scope.cancel = function () {
			$scope.closeModal(false);
			//$modalInstance.dismiss('cancel');
		};


		//去掉图片的后缀名
		function delExtension(str) {
			var reg = /\.\w+$/;
			return str.replace(reg, '');
		}

	}])
	.controller("fyCtrl", ['$scope', '$http', function ($scope, $http) {

		//这里是控制分的
		$scope.totalItems = 64;
		$scope.currentPage = 1;
		$scope.imglibList = {};


		$scope.setPage = function (pageNo) {
			console.log(pageNo);

			$scope.currentPage = pageNo;

			//  $scope.imgboxHttp();

		};

		$scope.pageChanged = function () {
			$log.log('Page changed to: ' + $scope.currentPage);
		};
		$scope.$watch('bigCurrentPage', function (newPageIndex, oldPageIndex) {
			//console.log(newPageIndex);

			$scope.$emit('bigCurrentPageChanged', newPageIndex);
		});


		$scope.maxSize = 5;
		//$scope.bigTotalItems = 175;
		$scope.bigCurrentPage = 1;

		$scope.pageSize = 16;

	}])
	/*	.factory('')*/
	.directive('imgLib', ['$modal', '$parse', 'platformModalSvc', function ($modal, $parse, platformModalSvc) {
		return {
			restrict: 'A',
			require: 'ngModel',
			scope: true,
			link: function (scope, element, attrs, ngModel) {
				attrs.imgLib = attrs.imgLib || 'array';
				attrs.modelMapper = attrs.modelMapper || "_id,url"
				var imgConfig = attrs.imgConfig ? $parse(attrs.imgConfig)(scope) : {
					'count': 2,//限制图片张数
					'size': 300,//图片大小,单位为k
					'width': 800,//图片宽度
					'height': 600,//图片高度
					'ext': 'gif,jpg,jpeg,bmp,png'//图片扩展名
				};
				if (angular.isDefined(attrs.imgCount)) {
					imgConfig.count = parseInt(attrs.imgCount);
				}else if(attrs.imgLib==='url' || attrs.imgLib==='image'){
					imgConfig.count = 1;
				}

				ngModel.$render = function () {
					if (_.isArray(ngModel.$viewValue)) {
						scope.images = angular.copy(ngModel.$viewValue);
					} else if (_.isString(ngModel.$viewValue) && ngModel.$viewValue) {
						scope.images = [{url: ngModel.$viewValue}];
						imgConfig.count = 1;
					} else if (_.isObject(ngModel.$viewValue) && _.has(ngModel.$viewValue, 'url')) {
						scope.images = [ngModel.$viewValue];
						imgConfig.count = 1;
					} else {
						scope.images = [];
					}
				};

				//通过设置 model-mapper属性设置生成图片的属性结构.
				var modelMapper = function modelMapper(item) {
					var result = {};
					if (attrs.modelMapper && attrs.modelMapper.length) {
						_.forEach(attrs.modelMapper.split(','), function (key) {
							result[key] = item[key];
						});
					} else {
						result = angular.copy(item);
					}
					return result;
				};

				element.bind('click', function (e) {
					e.stopPropagation();

					platformModalSvc.showModal({
						backdrop: 'static',
						templateUrl: globals.basAppRoot + '/partials/imglibWin.html',
						controller: 'imglibWinCtrl',
						size: 'lg',
						userTemplate: true,
						options: {
							imgConfig: imgConfig,
							backImgList: angular.copy(scope.images)
						}
					}).then(function (imgList) {
						imgList = _.map(imgList, modelMapper);
						if (_.isArray(ngModel.$viewValue) || imgConfig.count > 1 || attrs.imgLib === 'array') {
							ngModel.$setViewValue(imgList);
						} else if (attrs.imgLib === 'url') {
							ngModel.$setViewValue((imgList[0] || {}).url);
						} else {
							ngModel.$setViewValue(imgList[0]);
						}

						scope.images = imgList;
					});
				});
			}
		};
	}])
//标签库。zy
	.controller('taglibWinCtrl', ['$scope', '$modalInstance', '$http', '$modal', 'utils', '$animate', 'result', 'platformModalSvc', 'moduleId',
		function ($scope, $modalInstance, $http, $modal, utils, $animate, result, platformModalSvc, moduleId) {

			$scope.tab1 = {active: true};

			//切换tab事件
			$scope.tabSelected = function (tab) {
				$scope.activeTab = tab;
			};

			$scope.tagsData = {};
			$scope.selectedTags = _.map(result || [], function(tag){
				return {_id: tag.id};
			});

			var getSelectedTags = function getSelectedTags(){
				var selectedTags = [];
				_.forEach($scope.items,function(module){
					_.forEach(_.filter(module.tags,{isChecked:true}),function(tag){
						selectedTags.push(tag);
					});
				});
				return selectedTags;
			};

			var setSelectedTags = function setSelectedTags(selectedTags){
				_.forEach($scope.items, function (module) {
					_.forEach(module.tags, function (tag) {
						tag.isChecked = !!_.find(selectedTags, {_id: tag._id});
					});
				});
			};

			//初始化查询标签列表。
			function initTags() {
				return $http.get('/pccms/projTagCtgList/findAllTags')
					.success(function (data, status, headers, config) {
						if (data.isSuccess && data.data) {
							$scope.items = data.data;
							$scope.itmesbig = [];
							_.forEach(data.data, function(module, i){
								if (i % 5 === 0) {
									var tem = [];
									for (var j = 0; j < 5; j++) {
										if (i + j < data.data.length) {
											tem.push(data.data[i + j]);
										}
									}
									$scope.itmesbig[parseInt(i / 5)] = tem;
								}
							});
							$scope.selectedModule = _.find($scope.items,{_id:moduleId});
							$scope.tagsData.ctgId = moduleId;
							if ($scope.selectedModule && $scope.selectedModule.tags.length > 0) {
								$scope.tags = $scope.selectedModule.tags;
							}
							setSelectedTags($scope.selectedTags);
						} else {
							platformModalSvc.showWarmingMessage('获取数据失败：' + data.data, '提示');
						}
					})
					.error(function (data, status, headers, config) {
						platformModalSvc.showWarmingMessage('系统异常或网络不给力！', '提示');
					});
			}
			initTags();

			$scope.selectModule = function selectModule(module){
				$scope.selectedModule = module;
				$scope.tagsData.ctgId = moduleId = module._id;
			};
			//获取化所属栏目下拉列表。
			$http.get('/pccms/module/extend/projModuleList')
				.success(function (data, status, headers, config) {
					if (data.isSuccess && data.data.length > 0) {
						$scope.opts = data.data;
					}
				});

			//选择标签。
			$scope.checkedLabel = function ($event, data) {
				if (!data.isChecked) {
					data.isChecked = false;
				}
				data.isChecked = !data.isChecked;
				var _o = {
					id: data._id,
					name: data.name
				};
				if (data.isChecked && !_.has($scope.selectedTags, _o)) {
					$scope.selectedTags.push(_o);
				} else if (!data.isChecked && _.has($scope.selectedTags, _o)) {
					_.remove($scope.selectedTags, _o);
				}
			};

			//确定
			$scope.ok = function () {
				switch ($scope.activeTab) {
					case 'list':
						var result = _.map(getSelectedTags()||[],function(tag){
							return {
								id:tag._id,
								name:tag.name
							};
						});
						$modalInstance.close(result);
						break;
					case 'add':
						addTags();
						break;
					default:
						break;
				}
			};
			//取消
			$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
			};
			function addTags() {
				$http.post('/pccms/projTag/tag', $scope.tagsData)
					.success(function (data, status, headers, config) {
						if (data.isSuccess) {
							$scope.tab1.active = true;
							moduleId = $scope.tagsData.ctgId;
							var createdTagName = $scope.tagsData.name;
							var selectedTags = getSelectedTags();
							initTags().then(function(){
								var created = _.find($scope.selectedModule.tags,{name:createdTagName});
								selectedTags.push(created);
								setSelectedTags(selectedTags);
							});
							$scope.tagsData.name = '';
							$scope.tagsData.url = '';
						} else {
							platformModalSvc.showWarmingMessage(data.data, '提示');
						}
					}).error(function (data, status, headers, config) {
						platformModalSvc.showWarmingMessage('系统异常或网络不给力！', '提示');
					});
			}
		}
	])
	.directive('tagLib', ['$modal', '$parse', function ($modal, $parse) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, element, attrs, ngModel) {


				ngModel.$render = function () {
					// not implemented: hightlight current image using ngModel.$viewValue
				};
				element.bind('click', function (e) {
					e.stopPropagation();
					//标签库弹窗
					var modalInstance = $modal.open({
						backdrop: 'static',
						templateUrl: globals.basAppRoot + '/partials/taglibWin.html',
						controller: 'taglibWinCtrl',
						size: 'lg',
						resolve: {
							result: function () {
								return angular.copy(ngModel.$viewValue);
							},
							moduleId:function(){
								return attrs.moduleId;
							}
						}
					});
					modalInstance.result.then(function (data) {
						if (data) {
							ngModel.$setViewValue(data);
						}
					});

				});

			}
		};
	}])

	.filter("showCtgsName", function () {
		return function (array) {
			var _arr = [];
			if (array instanceof Array) {
				for (var k in array) {
					_arr.push(array[k].name);
				}
			}
			return _arr.join(',');
		}
	})
//表单验证字数的显示个数。
	.directive('beyond', function () {
		return {
			restrict: 'ACE',
			replace: true,
			scope: {
				maxCount: '@maxCount'
			},
			link: function (scope, element, attrs) {
				//TODO 临时解决方案
				var inputElement = $(element.find('.form-control[ng-model],.form-control[data-ng-model]')[0]);
				var inputNgModel = inputElement.data('$ngModelController');
				if (inputNgModel) {
					var updateDisplay  = function updateDisplay(){
						var o = inputNgModel.$viewValue;
						element.find('.mess-zx').html(o && o.length ?tureLength(o) : 0);
					};

					scope.$evalAsync(function () {
						var render = inputNgModel.$render;
						inputNgModel.$render = function $render() {
							render.apply(this, arguments);
							updateDisplay();
						};
						updateDisplay();
					});

					inputElement.on('change',function(){
						updateDisplay();
					});
					inputNgModel.$viewChangeListeners.push(updateDisplay);
				}
				var tureLength = function tureLength(data){
					var totalCount = 0;
					for(var i=0; i<data.length; i++){
						var c = data.charCodeAt(i);
						if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)){
							totalCount++;
						}
						else{
							totalCount+=2;
						}
					}
					return totalCount;
				}


				/* element.find('.form-control').bind('keyup blur change',function(){
				 var o = $(this).val();
				 if(o.length >0 ){
				 element.find('.mess-zx').html(o.length);
				 }else{
				 element.find('.mess-zx').html(0);
				 }
				 });*/
			}
		};
	})

	.run(['$rootScope', function ($rootScope) {

	}]);



//过滤除img以外的html标签
function deletHtmlTag(str) {
	var reg = /<(?!img\/p).*?>/g;
	str = str.replace(reg, "");

	return str;
}

var UniformSymbol = function UniformSymbol(str){
	str = str.replace(/[\s]+|[,，]+|[;]+|[|]+/g,",");
	return str;
};
