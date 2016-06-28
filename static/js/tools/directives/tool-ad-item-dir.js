(function (angular) {
	"use strict";

	angular.module('toolApp').directive('toolAdItem', ['platformModalSvc', 'desktopMainSvc', function (platformModalSvc, desktopMainSvc) {
		return {
			restrict: 'A',
			require: 'ngModel',
			scope: {
				width: '=',
				height: '=',
				channelId: '='
			},
			template: '<div class="advertising-item">' +
			'               <div class="image-container"  data-ng-click="selectAd()">' +
			'                  <label class="select-adv" ng-hide="url">请点击选择广告</label>' +
			'                  <i ng-show="url" class="fa fa-times adv-times"  ng-click="removeAd($event);"></i>' +
			'                  <img ng-show="url" class="adv-img" nsw-src="{{url}}"  />' +
			'               </div>' +
							'<div class="adv-size" ng-show="width && height">尺寸要求：{{width}}*{{height}}&nbsp;(px)</div>' +
							'<div class="adv-size" ng-hide="width && height">尺寸要求：<span class="adv-not-size">无</span></div>' +
			'           </div>',
			link: function (scope, element, attr, ctrl) {
				var img = [];
				var resize = function resize(config) {
					config = config || {};
					var imageContainer = element.find('.image-container');
					if (scope.width > 660) {
						imageContainer.css('width', 660);
						imageContainer.css('height', (660 * scope.height) / scope.width);
						element.find('.adv-times').css('left', '98%');
					} else {
						imageContainer.css('width', 176);
						imageContainer.css('height', 81);
						element.find('.adv-img').css('margin-top', '3.5%');
					}
				};

				var updateDisplay = function updateDisplay(){
					if (desktopMainSvc.isPoneProject()) {
						scope.url = img.urlPhone;
					} else if (desktopMainSvc.isPcProject()) {
						scope.url = img.urlPc;
					} else {
						scope.url = img.urlPc || img.urlPhone;
					}
				};

				ctrl.$render = function render() {
					resize(scope.config);
					scope.config = ctrl.$viewValue||{};
					img = (scope.config.imgs || [])[0]||{};
					updateDisplay();
				};

				scope.selectAd = function selectAd() {
					platformModalSvc.showModal({
						templateUrl: globals.basAppRoot + 'js/tools/partials/advertising-lib.html',
						controller: 'advLibCtrl',
						size: 'lg',
						options: {
							selected: scope.config.adId,
							name:scope.config.name
						}
					}).then(function (data) {
						scope.config.adId = data._id;
						scope.config.name = data.name;
						img = (data.imgs || [])[0]||{};
						ctrl.$setViewValue(scope.config);
						updateDisplay();
					});
				};

				scope.removeAd = function selectAd(event) {
					event.stopPropagation();
					if (scope.config && scope.config.adId) {
						delete  scope.config.adId;
					}

					if (scope.config && scope.config.imgs) {
						delete  scope.config.imgs;
					}
					scope.url = null;
				};
			}
		};
	}]);
}(angular));