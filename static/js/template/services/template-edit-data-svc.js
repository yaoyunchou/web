/*globals _, nsw*/
(function (angular) {
	"use strict";

	angular.module('pageEditApp').factory('templateEditDataSvc', ['$http', '$q', function ($http, $q) {
		var service = {},
			options = {},
			selectedSetting,
			pageSetting;

		service.init = function init(opts) {
			angular.extend(options, opts);
		};

		service.loadPageSetting = function loadPageSetting() {
			pageSetting = null;
			var apiUrl = globals.basAppRoot + '/tpl/page/load/' + options.pageId + '/?isPubTpl=' + options.isPublic,
				defer = $q.defer();
			$http.get(apiUrl).then(function (res) {
				pageSetting = res.data;
				defer.resolve(pageSetting);
			});
			return defer.promise;
		};

		service.savePageSetting = function savePageSetting() {
			var setting = angular.copy(pageSetting),
				defer = $q.defer();

			setting.content = setting.htmlContent;
			setting.isPubTpl = options.isPublic;

			if (_.has(setting, '_id')) {
				delete setting._id;
			}
			if (_.has(setting, 'strucData')) {
				delete setting.strucData;
			}
			if (_.has(setting, 'tags')) {
				delete setting.tags;
			}

			$http({//保存
				method: 'POST',
				url: globals.basAppRoot + '/tpl/page/' + pageSetting._id,
				data: setting
			}).then(function (res) {
				if (res.data.isSuccess) {
					defer.resolve(true);
				} else {
					defer.reject(res.data.data);
				}
			}, function () {
				defer.reject(nsw.Constant.NETWORK);
			});

			return defer.promise;
		};

		service.getPageSetting = function getPageSetting() {
			return pageSetting;
		};

		service.setPageSetting = function setPageSetting(setting) {
			if (setting) {
				pageSetting = setting;
			}
		};

		service.loadTemplateSetting = function loadTemplateSetting() {
			selectedSetting = null;
			var apiUrl = globals.basAppRoot + '/pageTpl/design/' + options.pageId + '/blkTpl/' + options.templateName + '?isPubTpl=' + options.isPublic + '&blkType=' + (options.blkType || ''),
				defer = $q.defer();
			$http.get(apiUrl).then(function (res) {
				selectedSetting = res.data.data;
				selectedSetting.conf = selectedSetting.conf || {};

				if (selectedSetting.projBlkTpl) {
					selectedSetting.projBlkTpl.ctgId = service.getSelectedCtg(selectedSetting.moduleCtgs, selectedSetting.projBlkTpl.ctgId) || {};
					angular.forEach(selectedSetting.projBlkTpl.confData, function (conf) {
						selectedSetting.conf[conf.name] = conf.value;
					});
				}

				//源码图片
				if (selectedSetting.conf.blkIcon) {
					selectedSetting.img = selectedSetting.img || {sm: []};
					selectedSetting.img.sm = selectedSetting.img.sm || [];
					selectedSetting.img.sm[0] = {"url": selectedSetting.conf.blkIcon};
				}

				defer.resolve(selectedSetting);
			});
			return defer.promise;
		};

		service.loadModuleTemplate = function loadModuleTemplate(moduleId) {
			var url = globals.basAppRoot + '/proj/infoCtg/tree/all?moduleId=' + moduleId,
				defer = $q.defer();
			if ("PRODUCT" === selectedSetting.projBlkTpl.type) {
				url = globals.basAppRoot + '/productCtg/tree/all';
			}
			$http.get(url).then(function (res) {
				selectedSetting.moduleCtgs = res.data;
				selectedSetting.projBlkTpl.ctgId = {};
				defer.resolve(res.data);
			});

			return defer.promise;
		};

		service.saveTemplateSetting = function sateTemplateSetting() {
			var apiUrl = globals.basAppRoot + '/pageTpl/design/' + options.pageId + '/blkTpl/' + options.templateName + '?isPubTpl=' + options.isPublic,
				defer = $q.defer();

			//将ctgId从结构抽取为string
			if (undefined === selectedSetting.projBlkTpl.ctgId || null === selectedSetting.projBlkTpl.ctgId) {
				selectedSetting.projBlkTpl.ctgId = "";
			} else {
				selectedSetting.projBlkTpl.ctgId = selectedSetting.projBlkTpl.ctgId._id;
			}

			var saveData = selectedSetting.projBlkTpl;
			saveData.conf = selectedSetting.conf;

			$http.put(apiUrl, saveData)
				.then(function (res) {
					if (res.data.isSuccess) {
						defer.resolve(res.data.data);
					} else {
						defer.reject(res.data.data);
					}
				}, function () {
					defer.reject(nsw.Constant.NETWORK);
				});
			return defer.promise;
		};

		//根据ctgId获取树结构中对应的CtgBean
		service.getSelectedCtg = function (moduleCtgs, ctgId) {
			var res = _.find(moduleCtgs, {_id: ctgId});
			if (res) {
				return res;
			}
			angular.forEach(moduleCtgs, function (item) {
				if (item.children) {
					res = service.getSelectedCtg(item.children, ctgId);
					if (res) {
						return false; //break the loop
					}
				}
			});
			return res;
		};


		service.savePageDesign = function savePageDesign() {
			var apiUrl = globals.basAppRoot + '/pageTpl/design/' + options.pageId + '?isPubTpl=' + options.isPublic,
				defer = $q.defer();
			$http.post(apiUrl).then(function (res) {
				if (res.data.isSuccess) {
					defer.resolve(nsw.Constant.SAVESUC);
				} else {
					defer.reject(nsw.Constant.OPERATION);
				}
			}, function () {
				defer.reject(nsw.Constant.NETWORK);
			});
			return defer.promise;
		};

		service.getBlkType = function getBlkType() {
			var defer = $q.defer(), blkTypeList;
			$http({
				method: 'GET',
				url: globals.basAppRoot + '/cmsConfig/list/blkTypeEnum'
			}).then(function (res) {
				if (res.data.isSuccess) {
					blkTypeList = res.data.data || {};
					blkTypeList = _.map(blkTypeList, function (blkType) {
						if (blkType.img) {
							blkType.img.url = globals.basImagePath + '/' + blkType.img.url;
						}
						return blkType;
					});
					defer.resolve(blkTypeList);
				} else {
					defer.reject(res.data.data);
				}
			});
			return defer.promise;
		};

		service.backup = function () {
			var defer = $q.defer();
			$http.put(globals.basAppRoot + '/pageTpl/design/' + options.pageId + '/bak?isPubTpl=' + options.isPublic)
				.then(function (res) {
					if (res.data.isSuccess) {
						//options.pageSetting.bakConf.bak.push(res.data);
						defer.resolve(res.data.data);
					} else {
						defer.reject(res.data.data);
					}
				}, function (res) {
					defer.reject(res);
				});
			return defer.promise;
		};

		service.delBackup = function (idx, bakId) {
			var defer = $q.defer();
			$http({
				method: 'DELETE',
				url: globals.basAppRoot + '/pageTpl/design/' + options.pageId + '/bak',
				params: {'bakId': bakId}
			}).then(function (res) {
				if (res.data.isSuccess) {
					defer.resolve(res.data);
				} else {
					defer.reject(res.data);
				}
			}, function (res) {
				defer.reject(res);
			});
			return defer.promise;
		};

		service.exitClear = function exitClear(){
			return $http({
				method: 'DELETE',
				url: globals.basAppRoot +'/pageTpl/design/' +options.pageId + '/compareExit'
			}).then(function(res){
				return res.data;
			});
		};

		service.getLookupData = function getLookupData(url) {
			return $http({
				method:'post',
				url: url,
				data: selectedSetting.projBlkTpl.tplDs[0]
			}).then(function (res) {
				return res.data.data;
			}, function (error) {
				return error;
			});
		};

		service.tplCited = function tplCited(tplId,isPubTpl){
			var defer = $q.defer(), rmoveTpl;
			$http({
				method: 'GET',
				url: globals.basAppRoot + '/tpl/blk/verification/'+tplId,
				params: {'isPubTpl':isPubTpl}
			}).then(function(res){
				rmoveTpl = res.data;
				defer.resolve(rmoveTpl);
			});
			return defer.promise;
		};

		service.tplRemoved = function tplRemoved(tplId,isPubTpl){
			var defer = $q.defer(), tplRemove;
			$http({
				method: 'DELETE',
				url: globals.basAppRoot + '/tpl/blk/' + tplId,
				params: {'isPubTpl':isPubTpl}
			}).then(function (res) {
				tplRemove = res.data;
				defer.resolve(tplRemove);
			});
			return defer.promise;
		};
		return service;
	}]);
}(angular));