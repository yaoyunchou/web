/*global angular, _*/
(function (angular) {
	"use strict";

	var module = angular.module('platform');
	module.service('platformImageLibSvc', ['$http', function ($http) {
		return function Constructor() {
			var self = this;
			var loadedItems = [], selectedItems = [], removedItems = [], createdItems = [];
			self.exts = 'gif,jpg,jpeg,bmp,png';

			self.getItems = function getItems() {
				return loadedItems;
			};

			self.addCreatedItems = function addCreatedItems(newItems) {
				if (!angular.isArray(newItems) && angular.isObject(newItems) && newItems.hasOwnProperty('_id')) {
					newItems = [newItems];
				}
				angular.forEach(newItems, function (newItem) {
					loadedItems.push(newItem);
					createdItems.push(newItem);
				});
			};

			self.removeItems = function removeItems(items) {
				if (angular.isString(items)) {
					items = _.find(loadedItems, {'_id': items});
				}
				if (!angular.isArray(items) && angular.isObject(items) && items.hasOwnProperty('_id')) {
					items = [items];
				}

				angular.forEach(items, function (removed) {
					if (angular.isString(removed)) {
						removed = _.find(loadedItems, {'_id': removed});
					}

					if (_.find(createdItems, {_id: removed._id})) {
						_.remove(createdItems, {_id: removed._id});
					}

					if (angular.isDefined(removed)) {
						removedItems.push(removed);
						_.remove(loadedItems, {'_id': removed._id});
					}
				});
			};

			self.clearItems = function clearItems() {
				loadedItems.length = 0;
				createdItems.length = 0;
				removedItems.length = 0;
				self.clearSelected();
			};

			self.selectItems = function selectItems(newSelectedItems) {
				if (angular.isString(newSelectedItems)) {
					newSelectedItems = _.find(loadedItems, {'_id': newSelectedItems});
				}
				if (!angular.isArray(newSelectedItems) && angular.isObject(newSelectedItems) && newSelectedItems.hasOwnProperty('_id')) {
					newSelectedItems = [newSelectedItems];
				}
				angular.forEach(newSelectedItems, function markItemAsSelected(item) {
					var selectedItem;
					if (angular.isString(item)) {
						selectedItem = _.find(loadedItems, {_id: item});
					}
					else if (angular.isObject(item) && item.hasOwnProperty('_id')) {
						selectedItem = item;
						if (!_.find(loadedItems, {_id: selectedItem._id})) {
							loadedItems.push(selectedItem);
						}
					}
					if (angular.isDefined(selectedItem)) {
						selectedItems.push(selectedItem);
					}
				});
			};

			self.getSelectedItems = function getSelectedItems() {
				return selectedItems;
			};

			self.clearSelected = function clearSelected() {
				selectedItems.length = 0;
			};

			self.isItemSelected = function isItemSelected(item) {
				if (angular.isString(item)) {
					return !!_.find(loadedItems, {_id: item});
				} else if (angular.isObject(item) && item.hasOwnProperty('_id')) {
					return !!_.find(loadedItems, {_id: item._id});
				}
				return false;
			};

			self.loadItems = function loadItems(pageSize, pageNum, filter) {
				$http({
					method: 'GET',
					url: globals.basAppRoot + '/file/list',
					params: {'pageNum': pageNum, 'pageSize': pageSize, 'fileName': filter}
				}).then(function (res) {
					_.concat(loadedItems, res.data.list);
				}, function (error) {
					alert(error);
				});
			};

			self.upLoadItems = function upLoadItems() {
			};
		};
	}]);
}(angular));