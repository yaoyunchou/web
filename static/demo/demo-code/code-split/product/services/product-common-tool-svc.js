/*global angular*/
(function (angular) {
	"use strict";

	angular.module('productApp').factory('commonTool', function () {
		return {
			getLocalTime: function () {
				var today = new Date();
				var y = today.getFullYear();
				var mh = today.getMonth() + 1;
				var d = today.getDate();
				var h = today.getHours();
				var m = today.getMinutes();
				return y + '-' + mh + '-' + d + ' ' + h + ':' + m;
			}
		};
	});
}(angular));