(function (angular) {
	"use strict";

	angular.module('toolApp').directive('toolAdSelect', ['platformModalSvc', 'desktopMainSvc','advertisingSvc', function (platformModalSvc, desktopMainSvc,advertisingSvc) {
		return {
			restrict: 'A',
			require: 'ngModel',
			scope: {
				width: '=',
				height: '=',
				channelId: '='
			},
			template: '<div class="advertising-item">' +
			'               <div class="image-container"  data-ng-click="selectAd()" style="width:150px; height: 150px">' +
			'                  <label class="select-adv" ng-hide="url">请点击选择广告</label>' +
			'                  <i ng-show="url" class="fa fa-times adv-times"  ng-click="removeAd($event);"></i>' +
			'                  <img ng-show="url" class="adv-img" nsw-src="{{url}}"  />' +
			'               </div>' +
							'<div class="adv-size" ng-show="width && height">尺寸要求：{{width}}*{{height}}&nbsp;(px)</div>' +
							'<div class="adv-size" ng-hide="width && height">尺寸要求：<span class="adv-not-size">无</span></div>' +
			'           </div>',
			link: function (scope, element, attr, ctrl) {
				var img = {}, advId='', adName;

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
					if(advId !== ctrl.$viewValue && ctrl.$viewValue){
						advertisingSvc.getAdvertisingById(ctrl.$viewValue).then(function(ad) {
							ad = ad ||{};
							img = (ad.imgs||[{}])[0];
							adName = ad.name;
							updateDisplay();
						});
					}else if(!ctrl.$viewValue){
						img = {};
						adName = null;
						updateDisplay();
					}
					advId = ctrl.$viewValue;
				};

				scope.selectAd = function selectAd() {
					platformModalSvc.showModal({
						templateUrl: globals.basAppRoot + 'js/tools/partials/advertising-lib.html',
						controller: 'advLibCtrl',
						size: 'lg',
						options: {
							selected: angular.copy(advId),
							name:adName
						}
					}).then(function (data) {
						img = (data.imgs||[{}])[0];
						adName = data.name;
						updateDisplay();
						advId = data._id;
						ctrl.$setViewValue(data._id);
					});
				};

				scope.removeAd = function selectAd(event) {
					event.stopPropagation();
					advId = null;
					adName = null;
					img={};
					updateDisplay();
					scope.url = null;
				};
			}
		};
	}]);
}(angular));