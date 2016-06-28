(function (angular) {
	"use strict";
	angular.module('platform').directive('nswImg', [function () {
		return {
			restrict: 'A',
			scope:true,
			template: '<div class="nsw-img-dir">' +
						'           <i class="fa fa-times nsw-img-icon remove" ng-show="enableRemove" ng-click="_removeImg();"></i>' +
						'           <i class="fa fa-eye nsw-img-icon preview" ng-show="enablePreview" ng-click="_imgPreview(url,$event)"></i>	' +
						'           <a href="javascript:void(0);">' +
						'                   <img nsw-src="{{src}}" data-ng-click="_selectImage()" class="img"></a>' +
						'           <input type="text" placeholder="请写图片描述" class="form-control alt" autocomplete="off"  data-ng-readonly="enableEditAlt" ng-model="alt" data-ng-change="_altChanged(alt)" /></li>' +
						'</div>',
			link: function (scope, element, attrs) {
				scope.enableRemove = !!attrs.nswImgRemove;
				scope.enablePreview = attrs.enablePreview==='true';
				scope.enableAlt = !!attrs.nswImgAlt;
				scope.enableEditAlt = scope.enableAlt && attrs.enableEditAlt === 'true';

				scope.alt = scope.$eval(attrs.nswImgAlt);
				scope.src = scope.$eval(attrs.nswImgSrc);

				attrs.$observe('nswImgAlt',function(val){
					scope.alt = scope.$eval(attrs.nswImgAlt);
				});
				scope._altChanged = function altChanged(val){
					_.set(scope, attrs.nswImgAlt, val);
				};

				attrs.$observe('nswImgSrc',function(val){
					scope.src = scope.$eval(attrs.nswImgSrc);
				});

				scope._srcChanged = function srcChanged(val){
					_.set(scope, attrs.nswImgSrc, val);
				};

				scope._removeImg = function removeImg(){
					_.set(scope, attrs.nswImgSrc, null);
					if(attrs.nswImgRemove){
						scope.$eval(attrs.nswImgRemove);
					}
					scope.$emit('itemremove', scope.src);
				};

				scope._selectImage = function selectImage(){
					if(attrs.enableSelectImg === 'true'){

					}
				};
			}
		}
	}]);

}(angular));