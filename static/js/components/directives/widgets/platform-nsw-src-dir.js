(function (angular) {
	"use strict";

	angular.module('platform').directive('nswSrc', [function () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				var updateSrc = function updateSrc() {
					var fullUrlReg = /^(http|https|ftp)?:\/\//;  //jshint:ignore line
					var relateUrlReg = /^[..\\]{1}/;
					var base64 = /^data:image\//;
					var localhostReg = /^~\//;
					var src = attrs.nswSrc;


					if (!src && element[0] &&
						_.isString(element[0].tagName) &&
						element[0].tagName.toLowerCase() === 'img') {
						src = globals.defaultImg;
					}

					if(src && localhostReg.test(src)){
						src = src.replace(localhostReg,globals.basAppRoot);
					}else if (src && !fullUrlReg.test(src) && !relateUrlReg.test(src) && !base64.test(src)) {
						src = globals.basImagePath + src;
					}
					if (src) {
						element.attr('src', src);
					}
				};
				attrs.$observe('nswSrc', function () {
					updateSrc();
				});

				scope.$evalAsync(function () {
					updateSrc();
				});
			}
		};
	}]);
}(angular));