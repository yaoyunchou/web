/*globals nsw, _*/
(function (angular, nsw) {
	"use strict";

	angular.module('pageEditApp').controller('templateConfigDialogCtrl', ['$scope', 'templateEditDataSvc', 'platformModalSvc',
		function ($scope, dataService, platformModalSvc) {
			$scope.setting = $scope.modalOptions.setting || {};
			$scope.sysBasePath = globals.basAppRoot;
			$scope.conf = $scope.setting.conf;

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
						if (!isEmpty($scope.setting.projBlkTpl.ctgId)) {//产品有ctg可选
							$scope.isShowCtgBtn = false;
							$scope.isShowCtgSelector = true;
						}
						break;
					case 'LEFT_NAV':
					case 'SHOP_NAV':
						$scope.isShowCtgBtn = true;
						if ($scope.setting.projBlkTpl && $scope.setting.projBlkTpl.moduleId) {
							$scope.isShowCtgBtn = false;
							$scope.isShowModuleSelector = true;
						}
						break;
				}
			};

			var createDsFormOptions = function createDsFormOptions() {
				$scope.setting.tplDs = !$scope.setting.tplDs ?[]:$scope.setting.tplDs;
				var rows = [], lookups = {};
				rows = _.map($scope.setting.tplDs.comp, function (item) {
					return {
						id: item.id,
						label: item.label,
						model: item.model,
						domain: item.type,
						lookup: item.lookup,
						size: 6,
						key: item.model,
						displayExp: item.display,
						display: 'name'
					};
				});
				_.forEach($scope.setting.tplDs, function (item, key) {
					if (key !== 'comp') {
						lookups[key] = item;
					}
				});


				var exceptReg = /\[except\(/g, anyExpReg = /\[any\]/;

				var initLookupData = function initLooupData(row, id) {
					if (row.id !== id && /^url:/.test(row.lookup)) {
						lookups[row.lookup] = [{value: 0, name: 'loading...'}];
						var url = globals.basAppRoot + row.lookup.replace('url:', '');
						dataService.getLookupData(url).then(function (data) {
							lookups[row.lookup] = data;
							$scope.formOptions.rows = _.filter(rows, checkRowDisplay);
						}, function (error) {
							platformModalSvc.showWarmingMessage(error, row.label + '数据读取失败');
						});
					}
				};

				var getExpressData = function getExpressData(exp) {
					var srcRow, srcRowId, srcRowVal, srcRowData;
					srcRowId = exp.split('.')[0];
					if (srcRowId) {
						srcRow = _.find(rows, {id: srcRowId});
						if (srcRow) {
							srcRowVal = $scope.setting.projBlkTpl.tplDs[0][srcRow.model];
							var filter = {};
							filter[srcRow.model] = srcRowVal;
							if (!_.isUndefined(srcRowVal)) {
								srcRowData = srcRow.lookup ? _.find(lookups[srcRow.lookup], filter) : null;
							}
						}
					}
					return {row: srcRow, data: srcRowData};
				};

				var getExceptFilter = function getExceptFilter(exp, eagerVal) {
					var startIndex = exp.indexOf('[except(') + 8;
					var endIndex = exp.indexOf(')', startIndex);
					if (endIndex > startIndex) {
						var excepts = exp.slice(startIndex, endIndex);
						return _.indexOf(excepts.split(','), '\'' + eagerVal + '\'') >= 0 ||
							_.find(excepts.split(','), eagerVal) >= 0;
					}
					return false;
				};

				var checkRowDisplay = function checkRowDisplay(row) {
					var isDisplay = !row.displayExp || !row.displayExp.length;
					var displayExps = _.isString(row.displayExp) ? row.displayExp.split(',') : row.displayExp;
					_.forEach(displayExps, function (exp) {
						var vals = exp.split(':');
						var compareVal0, compareVal1;
						var srcRow0 = getExpressData(vals[0].split('.')[0]);
						var srcRow1 = getExpressData(vals[1].split('.')[0]);

						compareVal0 = vals[0];
						if (srcRow0 && srcRow0.row) {
							vals[0] = vals[0].replace(srcRow0.row.id + '.selected.', '');
							compareVal0 = _.get(srcRow0.data, vals[0]);
						}
						compareVal1 = vals[1];
						if (srcRow1.row) {
							vals[1] = vals[1].replace(srcRow1.row.id + '.selected.', '');
							compareVal1 = _.get(srcRow1.data, vals[1]);
						}

						if (exceptReg.test(compareVal0)) {
							isDisplay = !getExceptFilter(compareVal0, compareVal1);
							return false;
						} else if (exceptReg.test(compareVal1)) {
							isDisplay = !getExceptFilter(compareVal1, compareVal0);
							return false;
						} else if (anyExpReg.test(compareVal0)) {
							return compareVal1;
						} else if (anyExpReg.test(compareVal1)) {
							return compareVal0;
						} else {
							isDisplay = String(compareVal0) === String(compareVal1);
						}

						return !isDisplay;
					});

					return isDisplay;
				};

				var updateDataSource = function updateDataSource(id){
					var displayRows = _.filter(rows, checkRowDisplay);
					angular.forEach(displayRows, function (row) {
						initLookupData(row, id);
					});

					_.forEach($scope.formOptions.rows,function(row){
						if(!_.find(displayRows,{model:row.model})){
							_.set($scope.setting.projBlkTpl.tplDs[0], row.model, null);
						}
					});
					$scope.formOptions.rows = displayRows;
				};

				$scope.onPropertyChanged = function onPropertyChanged(data, property, id) {
					updateDataSource(id);
				};

				$scope.formOptions = {
					name: 'blkDsForm',
					lookups: lookups,
					hasLabel: true,
					hasValidateTip: true,
					required: false,
					data: $scope.setting.projBlkTpl.tplDs[0]||{}
				};
				updateDataSource(-1);
			};

			$scope.selectModule = function () {
				dataService.loadModuleTemplate($scope.setting.projBlkTpl.moduleId);
			};

			$scope.changeCtgSelectedFlag = function () {
				updateStatus();
			};

			$scope.tplSelected = function (blk) {
				var setting = $scope.setting;
				var blkId = blk._id;
				if (blkId && blkId === setting.projBlkTpl._id) {
					return;
				}
				angular.forEach(blk.confData, function (conf) {
					if (conf.name === 'blkIcon') {
						setting.conf[conf.name] = conf.value;
					}
				});

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

				createDsFormOptions();
			};

			
			$scope.tplShow = function tplShow(attr){
				$scope.tplId = attr._id;
			};
			
			$scope.tplHide = function tplHide(){
				$scope.tplId = '';
			};
			
			$scope.removeTpl = function removeTpl(item,flag){
				dataService.tplCited(item._id,flag).then(function(data){
					if(data.isSuccess){
						platformModalSvc.showConfirmVCMessage('删除当前版块模板，模板包含的相关资源将一并删除，确认吗？', '提示').then(function(){
							dataService.tplRemoved(item._id,flag).then(function(data){
								if(data.isSuccess){								
									_.remove($scope.setting.pubBlkTpls,{_id:item._id});
									_.remove($scope.setting.projBlkTplList,{_id:item._id});
									platformModalSvc.showSuccessTip(data.data);
								}else{
									platformModalSvc.showWarmingTip(data.data);
								}
							});
						});
					}else{
						platformModalSvc.showWarmingMessage(data.data + '不能被删除！','提示');
					}
				});
			};

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

			$scope.switchBlkType = function () {
				$scope.closeModal(true);
			};

			updateStatus();
			createDsFormOptions();
		}]);
}(angular, nsw));