/*globals nsw, window, _*/
(function (angular) {
	"use strict";
	var template = window.template = {};// =  window.formTemplate? window.formTemplate.window:{};
	var sysBasePath, projPageData;
	template.initEnv = function initEnv(options) {
		sysBasePath = options.sysBasePath;
		projPageData = options.projPageData;
		template.isPhone = options.isPhone;
	};

	template.callMethod = function callMethod() {
		var methodName = arguments[0];
		var args = _.slice(arguments, 1);
		if (_.has(template, methodName)) {
			template[methodName].apply(this, args);
		}
	};

	window.isPhone = true;


	angular.module('pageEditApp').controller('pageEditContainerCtrl',
		['$scope', '$state', 'platformModalSvc', 'templateEditDataSvc',
			function ($scope, $state, platformModalSvc, dataService) {
				var boxType = 'phone';
				$scope.sysBasePath = sysBasePath;
				$scope.projPageData = projPageData;

				$scope.viewTemplate = $scope.templateUrl = decodeURIComponent($state.params.uri);
				//dataService.init({pageId: $state.params.pageId, isPublic: Boolean($state.params.isPublic)});

				//弹出区块定制编辑窗口
				window.template.edit = $scope.edit = function (projBlkName, projPageData) {
					$scope.projBlkName = projBlkName;
					$scope.projPageData = projPageData;
					platformModalSvc.showModal({
						controller: 'templateConfigDialogCtrl',
						templateUrl: sysBasePath + '/js/template/partials/template-config-dialog-ctrl.html',
						size: 'lg',
						options: {
							projBlkName: $scope.projBlkName,
							projPageData: $scope.projPageData,
							sysBasePath: sysBasePath
						}
					}).then(function (blkTemplate) {
						var selector = '[nsw\\:blkname="' + $scope.projBlkName + '"]';
						window.formTemplate.updateTemplate(selector, blkTemplate);
					});
				};


				//源码编辑弹框
				$scope.editSource = function () {
					dataService.init({pageId: projPageData.id, isPublic: projPageData.isPubTpl});
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
							window.formTemplate.location.reload();
						});
					});
				};

				//保存页面设计
				template.savePageDesign = $scope.savePageDesign = function () {
					dataService.init({pageId: projPageData.id, isPublic: projPageData.isPubTpl});
					dataService.savePageDesign().then(function (message) {
						platformModalSvc.showWarmingMessage(message, nsw.Constant.TIP);
					}, function (error) {
						platformModalSvc.showWarmingMessage(error, nsw.Constant.TIP);
					});
				};

				$scope.turnEdit = function(){
					$scope.isDesign = !$scope.isDesign;
					$scope.templateUrl = $scope.viewTemplate.replace(/\/view\?/,'/edit?');
					window.formTemplate.location.reload();
				};

				$scope.showPc = function showPc(){
					boxType = 'pc';
				};

				$scope.showPad = function showPad(){
					boxType = 'pad';
				};

				$scope.showPhone = function showPhone(){
					boxType = 'phone';
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
					document.getElementsByTagName('iframe')[0].contentWindow.history.back(-1)
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