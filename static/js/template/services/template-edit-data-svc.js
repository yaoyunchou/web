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
				//策划思路
				pageSetting.res = [];
				pageSetting.res[0] = {};
				pageSetting.res[0].url = res.imgSm;

				pageSetting.res1 = [];
				pageSetting.res1[0] = {};
				pageSetting.res1[0].url = res.imgMd;

				pageSetting.res2 = [];
				pageSetting.res2[0] = {};
				pageSetting.res2[0].url = res.imgLg;

				pageSetting.res3 = [];
				pageSetting.res3[0] = {};
				pageSetting.res3[0].url = res.imgFr;
				defer.resolve(pageSetting);
			});
			return defer.promise;
		};

		service.savePageSetting = function savePageSetting() {
			var setting = angular.copy(pageSetting),
				defer = $q.defer();

			setting.content = setting.htmlContent;
			setting.isPubTpl = options.isPublic;

			setting.imgSm = setting.res[0].url || '';
			delete setting.res;

			setting.imgMd = setting.res1[0].url || '';
			delete setting.res1;

			setting.imgLg = setting.res2[0].url || '';
			delete setting.res2;

			setting.imgFr = setting.res3[0].url || '';
			delete setting.res3;

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
					defer.reject(nsw.Constant.OPERATION);
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
			var apiUrl = globals.basAppRoot + '/pageTpl/design/' + options.pageId + '/blkTpl/' + options.templateName + '?isPubTpl=' + options.isPublic,
				defer = $q.defer();
			$http.get(apiUrl).then(function (res) {
				selectedSetting = res.data.data;
				selectedSetting.conf = selectedSetting.conf || {};
				selectedSetting.projBlkTpl.ctgId = service.getSelectedCtg(selectedSetting.moduleCtgs, selectedSetting.projBlkTpl.ctgId) || {};
				angular.forEach(selectedSetting.projBlkTpl.confData, function (conf) {
					selectedSetting.conf[conf.name] = conf.value;
				});

				//源码图片
				if (selectedSetting.conf.blkIcon) {
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
			angular.extend(selectedSetting, selectedSetting.projBlkTpl);
			$http.put(apiUrl, selectedSetting)
				.then(function (res) {
					if (res.data.isSuccess) {
						defer.resolve(res.data.data);
					} else {
						defer.reject(nsw.Constant.OPERATION);
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

		return service;
	}]);
}(angular));