/*demoApp.controller('yanzhengCtrl', ['$scope', function ($scope){
	"use strict";


}]);*/
/*global angular*/
(function(angular){
    "use strict";

	demoApp.controller('yanzhengCtrl',["$scope","$http",function($scope,$http){
		//$scope.text = 'a';
	}])
		.directive('validating',function (){
			return{
				restrict:"EA",
				replace:true,
				scope:{
				},
				require:'ngModel',
				template:'<div class="form-group"><label  class="col-sm-2 control-label lighter-weight pt0"><span class="err">*</span>网页访问地址</label><div class="col-sm-5"> <input type="text" class="form-control" ng-model="data" data-ng-change="updateData()" name="staticPageName" ng-blur="verRepeat()" ng-maxlength="30" required> <div ng-show="formSpeed.staticPageName.$dirty && formSpeed.staticPageName.$invalid"> <span class="err" ng-show="formSpeed.staticPageName.$error.required">请填写网页访问地址</span> <span class="err" ng-show="!formSpeed.staticPageName.$error.required && formSpeed.staticPageName.$error">网页访问地址长度为0~30字符</span> </div> </div> <span class="mess-zx"><span data-ng-bind="count"/>/30字符</span> </div>',
				link:function(scope, element, attrs, ngModel){
					scope.count =0;
					ngModel.$render = function(){
						scope.data = ngModel.$viewValue;
						scope.count = scope.data.length||0;
					};

					scope.updateData= function updateData(val){
						ngModel.$setViewValue(scope.data);
						scope.count = scope.data.length;
					};
				}
			}
	})
	/*.directive('sideBox', function() {
		return {
			restrict: 'EA',
			scope: {
				title: '@'
			},
			transclude: true,
			template: '<div class="sidebox"><div class="content"><h2 class="header">' +
			'{{ title }}</h2><span class="content" ng-transclude></span></div></div>'
		};
	});*/
		/*.controller('Controller', ['$scope', '$timeout', function($scope, $timeout) {
			$scope.name = 'Tobias';
			$scope.hideDialog = function () {
				$scope.dialogIsHidden = true;
				$timeout(function () {
					$scope.dialogIsHidden = false;
				}, 2000);
			};
		}])
		.directive('myDialog', function(scope,element,atts) {
			return {
				restrict: 'E',
				//transclude: true,
				replace:true,
				/!*scope: {
					'close': '&onClose'
				},*!/
				template:'<div class="alert">Check out the contents, {{name}}!<a href class="close" ng-click="close()">&times;</a>  </div>'
			};
		});*/
}(angular));