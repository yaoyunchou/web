/*globals nsw*/
(function (angular, nsw) {
	"use strict";

	angular.module('pageEditApp').controller('templateConfigDialogCtrl', ['$scope', 'templateEditDataSvc', 'platformModalSvc',
		function ($scope, dataService, platformModalSvc) {
			var setting = $scope.setting = $scope.setting || {};
			$scope.sysBasePath = globals.basAppRoot;

			dataService.init({
				pageId: $scope.modalOptions.projPageData.id,
				templateName: $scope.modalOptions.projBlkName,
				isPublic: $scope.modalOptions.projPageData.isPubTpl
			});

			var isEmpty = function (value) {
				return (Array.isArray(value) && value.length === 0) ||
					(Object.prototype.isPrototypeOf(value) && Object.keys(value).length === 0);
			};

			var updateStatus = function updateStatus() {
				//控制分类下拉是否显示
				$scope.isShowCtgSelector = false;
				$scope.isShowModuleSelector = false;
				$scope.isShowCtgBtn = false;
				var tplType = $scope.setting.projBlkTpl.type;

				switch (tplType) {
					case 'INFO':
						$scope.isShowCtgBtn = true;
						if (!isEmpty($scope.setting.projBlkTpl.ctgId)) {//资讯有ctg,module可选
							$scope.isShowCtgBtn = false;
							$scope.isShowCtgSelector = true;
							$scope.isShowModuleSelector = true;
						}
						break;
					case 'PRODUCT':
						$scope.isShowCtgBtn = true;
						if (!isEmpty(setting.projBlkTpl.ctgId)) {//产品有ctg可选
							$scope.isShowCtgBtn = false;
							$scope.isShowCtgSelector = true;
						}
						break;
					case 'LEFT_NAV':
					case 'SHOP_NAV':
						$scope.isShowCtgBtn = true;
						if (setting.projBlkTpl && setting.projBlkTpl.moduleId) {
							$scope.isShowCtgBtn = false;
							$scope.isShowModuleSelector = true;
						}
						break;
				}
			};


			dataService.loadTemplateSetting()
				.then(function (data) {
					setting = $scope.setting = data;
					$scope.conf = setting.conf;
					updateStatus();
				});

			$scope.selectModule = function () {
				dataService.loadModuleTemplate(setting.projBlkTpl.moduleId);
			};

			$scope.changeCtgSelectedFlag = function () {
				updateStatus();
			};

			$scope.tplSelected = function (blk) {
				var blkId = blk._id;
				if (blkId && blkId === setting.projBlkTpl._id) {
					return;
				}
				angular.forEach(blk.confData, function (conf) {
					if (conf.name === 'blkIcon') {
						setting.conf[conf.name] = conf.value;
					}
				});

				if (setting.conf.blkIcon) {
					setting.img.sm[0] = {"url": $scope.conf.blkIcon};
				} else {
					setting.img = {};
					setting.img.sm = [];
				}
				if (setting.projBlkTpl.moduleId) {
					blk.moduleId = setting.projBlkTpl.moduleId;
				}

				if (setting.projBlkTpl.ctgId) {
					blk.ctgId = setting.projBlkTpl.ctgId;
				}
				if (setting.projBlkTpl.tplDs) {
					blk.tplDs = setting.projBlkTpl.tplDs;
				}
				setting.projBlkTpl = blk;
			};

			var imgSmWatcher = $scope.$watch("setting.img.sm", function (newvalue) {
				if (newvalue && newvalue[0] && newvalue[0].url) {
					setting.conf.blkIcon = newvalue[0].url;
				}
			});

			$scope.save = function () {
				dataService.saveTemplateSetting()
					.then(function (data) {
						$scope.closeModal(true, data);
					}, function (error) {
						platformModalSvc.showWarmingMessage(error, nsw.Constant.TIP);
					});
			};

			$scope.cancel = function () {
				$scope.closeModal(false);
			};

			$scope.$on('$destroy', function () {
				imgSmWatcher();
			});
		}]);
}(angular, nsw));