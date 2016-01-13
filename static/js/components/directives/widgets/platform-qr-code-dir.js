(function (angular) {
	"use strict";

	var module = angular.module('platform');
	module.directive('platformQrCode', [function () {

		return {
			restrict: 'A',
			scope: {
				content:'=platformQrCode'
			},
			link: function (scope, element) {
				var watcher = scope.$watch('platformQrCode', function () {
					element.qrcode({text:scope.content,width:100,height:100});
				});
				
				scope.$on('$destory',function(){
					watcher();
				});
			}
		};

	}]);
}(angular));