/*globals nsw, window, _*/
(function (angular) {
	"use strict";
	var template = window.template = {};// =  window.formTemplate? window.formTemplate.window:{};
	var sysBasePath, projPageData;


	template.callMethod = function callMethod() {
		var methodName = arguments[0];
		var args = _.slice(arguments, 1);
		if (_.has(template, methodName)) {
			template[methodName].apply(this, args);
		}
	};

	var updateTemplate = function updateTemplate(selector, template) {
		$(selector, window.formTemplate.document).replaceWith(template);
		if ($(window.formTemplate).resize) {
			$(window.formTemplate).resize();
		}
	};

	window.isPhone = true;


	angular.module('pageEditApp').controller('pageEditContainerCtrl',
		['$scope', '$state', 'platformModalSvc', 'templateEditDataSvc', 'desktopMainSvc',
			function ($scope, $state, platformModalSvc, dataService, desktopMainSvc) {
				$scope.sysBasePath = sysBasePath;
				$scope.projPageData = projPageData;
				var boxType = '';
				$scope.compareType = 'same';
				desktopMainSvc.getProjectType().then(function () {
					boxType = desktopMainSvc.isPoneProject() ? 'phone' : 'pc';
					$scope.isResponsive = desktopMainSvc.isResponsiveProject();
					$scope.showQrCode = desktopMainSvc.isPoneProject();

					if(desktopMainSvc.isPcProject() ){
						$('iframe').height($(window).height());
					}
				});

				var pageId = $state.params.pageid,
					state = $state.params.state||'view',
					previewTemplate = $state.params.template,
					isPubTpl =angular.isDefined($state.params.isPubTpl)?$state.params.isPubTpl==='true':true;

				dataService.init({pageId: pageId, isPublic: isPubTpl});
				//$scope.viewTemplate = $scope.templateUrl = decodeURIComponent($state.params.uri);
				$scope.isDesign = state==='edit';

				var onEditClick = function onEditClick(){
					$scope.$eval($(this).attr('ng-click'));
				};

				var reloadWindow = function reloadWindow(){
					window.formTemplate.location.reload();
					window.formTemplate.projPageData = null;
					var timer = setInterval(function(){
						if(window.formTemplate.projPageData){
							clearInterval(timer);
							$('.c-edit-toolbar.nsw',  window.formTemplate.document).css('display','none');
							$scope.projPageData = projPageData = window.formTemplate.projPageData;
							$scope.sysBasePath = sysBasePath = window.formTemplate.sysBasePath;
							dataService.init({
								projPageData:projPageData,
								sysBasePath:sysBasePath
							});

							$(window.formTemplate.document).off('click','.blk-edit-btn',onEditClick);
							$(window.formTemplate.document).on('click','.blk-edit-btn',onEditClick);
						}
					},200);
				};

				if(pageId) {
					if(state === 'preview') {
						$scope.isPreview = true;
						$scope.viewTemplate = $scope.templateUrl = '/pccms/' + previewTemplate.replace(/\{id}/g, pageId);
					}else{
						$scope.viewTemplate = $scope.templateUrl = '/pccms/pageTpl/design/' + '/' + pageId + '/' + state + '?isPubTpl=' + isPubTpl;
					}
					if(state==='edit') {
						reloadWindow();
					}
				}

				var showBlkEditDialog = function showBlkEditDialog(options){
					platformModalSvc.showModal({
						controller: 'templateConfigDialogCtrl',
						templateUrl: sysBasePath + '/js/template/partials/template-config-dialog-ctrl.html',
						size: 'lg',
						options: options
					}).then(function (blkTemplate) {
						if(blkTemplate) {
							var selector = '[nsw\\:blkname="' + $scope.projBlkName + '"]';
							updateTemplate(selector, blkTemplate);
							dataService.init({goBlkType: blkTemplate});
						}else{
							options.fromSwitch = true;
							showBlkSelectDialog(options);
						}
					});
				};

				var showBlkSelectDialog = function showBlkSelectDialog(options){
					platformModalSvc.showModal({
						controller: 'templateBlkSelectDialogCtrl',
						templateUrl: sysBasePath + '/js/template/partials/template-blk-select-dialog-ctrl.html',
						size: 'lg',
						options:{
							fromSwitch:options.fromSwitch
						}
					}).then(function (blkTemplate) {
						dataService.init({blkType:blkTemplate});
						$scope.edit(options.projBlkName);
					},function(){
						if(options.fromSwitch) {
							$scope.edit(options.projBlkName);
						}
					});
				};

				template.initEnv = function initEnv(options) {
					sysBasePath = options.sysBasePath;
					template.isPhone = options.isPhone;
				};

				//弹出区块定制编辑窗口
				window.template.edit = $scope.edit = function (projBlkName) {
					$scope.projBlkName = projBlkName;

					dataService.init({
						templateName:projBlkName
					});

					dataService.loadTemplateSetting()
						.then(function (data) {
							dataService.init({blkType: null});
							var options = {
								projBlkName: $scope.projBlkName,
								sysBasePath: sysBasePath,
								setting:data
							};
							if(!data.projBlkTpl){
								showBlkSelectDialog(options);
							}else{
								showBlkEditDialog(options);
							}
						});
				};

				//源码编辑弹框
				$scope.editSource = function () {
					dataService.loadPageSetting().then(function (pageSetting) {
						dataService.setPageSetting(pageSetting);
						return platformModalSvc.showModal({
							controller: 'templateConfigPageDialogCtrl',
							templateUrl: sysBasePath + '/js/template/partials/template-config-page-dialog-ctrl.html',
							size: 'lg',
							options: {
								setting: pageSetting
							}
						}).then(function () {
							reloadWindow();
						});
					});
				};

				//保存页面设计
				template.savePageDesign = $scope.savePageDesign = function () {
					dataService.savePageDesign().then(function (message) {
						reloadWindow();
						platformModalSvc.showWarmingMessage(message, nsw.Constant.TIP);
					}, function (error) {
						platformModalSvc.showWarmingMessage(error, nsw.Constant.TIP);
					});
				};
				$scope.backup = function(){
					dataService.backup().then(function(data){
						projPageData.bakConf.bak.push(data);
						$scope.projPageDataList = projPageData.bakConf.bak;
						if($scope.projPageDataList.length > 1){
							$scope.disabled = true;
						}
					});
				};
				$scope.delBackup = function(idx,bakId){
					dataService.delBackup(idx,bakId).then(function(){
						$scope.projPageDataList.splice(idx, 1);
						$scope.disabled = false;
					});
				};

				$scope.turnEdit = function(){
					$scope.isDesign = !$scope.isDesign;
					$scope.templateUrl = $scope.viewTemplate.replace(/\/view\?/,'/edit?');
					reloadWindow();
				};

				//退出页面设计
				$scope.outPageDesign = function(){
					dataService.exitClear().then(function(data){
						if(data.isSuccess){
							closeWebPage();
						}else{
							platformModalSvc.showWarmingMessage(nsw.Constant.DATAFAILURE + data.data,nsw.Constant.TIP);
						}
					},function(){
						platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
					});
				};

				$scope.compare = function(){
					var bak;
					if('same' === $scope.compareType){
						bak = projPageData.bakConf.bak;
						var url =globals.basAppRoot+ '/pageTpl/design/' + pageId + '/sameCompare/'+bak[0]+'/'+bak[1]+'?isPubTpl='+isPubTpl;
						window.open (url, '_blank');
					}else{
						bak = projPageData.bakConf.bak;
						window.open (globals.basAppRoot +'/pageTpl/design/' + pageId + '/wideCompare/'+bak[0]+'?isPubTpl='+isPubTpl, '_blank');
						window.open (globals.basAppRoot +'/pageTpl/design/' + pageId + '/wideCompare/'+bak[1]+'?isPubTpl='+isPubTpl, '_blank');
					}
				};

				function closeWebPage(){
					if (navigator.userAgent.indexOf("MSIE") > 0) {
						if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
							window.opener = null;
							window.close();
						} else {
							window.open('', '_top');
							window.top.close();
						}
					}else if(navigator.userAgent.indexOf("Firefox") > 0) {
						window.location.href = 'about:blank ';
					} else {
						window.opener = null;
						window.open('', '_self', '');
						window.close();
					}
				}

				$scope.showPc = function showPc(){
					boxType = 'pc';
					$scope.showQrCode = false;
					$(window.formTemplate).resize();
				};

				$scope.showPad = function showPad(){
					boxType = 'pad';
				};

				$scope.showPhone = function showPhone(){
					boxType = 'phone';
					$scope.showQrCode = true;
					$(window.formTemplate).resize();
				};

				$scope.getBoxStyle = function getBoxStyle(){
					var css = '';
					switch (boxType){
						case 'pc':
							css = 'pc-box';
							break;
						case 'pad':
							css = $scope.rotated ?'pad-box-rotated':'pad-box';
							break;
						case 'phone':
							css = $scope.rotated ?'phone-box-rotated':'phone-box';
							break;
					}
					return css;
				};

				$scope.goBack = function goBack(){
					document.getElementsByTagName('iframe')[0].contentWindow.history.back(-1);
				};

				$scope.rotate = function rotate(){
					$scope.rotated = !$scope.rotated;
				};


				$scope.$on('$destory', function () {
					if (_.has(window, 'template')) {
						delete  window.template;
					}
				});


			}]);


}(angular));