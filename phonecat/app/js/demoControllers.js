
/**
 * Created by yao on 2015/10/30.
 */
/*
 *首先实现一个比较简单的数据绑定
 *
 *
 * */

var demoController1 = angular.module("demoapp",[]);

demoController1.directive('onFinishRenderFilters', function ($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    };
});
demoController1.controller("phonelistCrtl", function ($scope) {
    $scope.phones=[
        {"name": "Nexus S",
            "snippet": "Fast just got faster with Nexus S."},
        {"name": "Motorola XOOM? with Wi-Fi",
            "snippet": "The Next, Next Generation tablet."},
        {"name": "MOTOROLA XOOM?",
            "snippet": "The Next, Next Generation tablet."}
    ];
    $scope.demophones=[{}
    ];
	console.log("在angular没运行前："+$(".demophone li").attr("id"));
	$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
	          //下面是在table render完成后执行的js
                                         	         
	         console.log("在angular："+$(".demophone li").attr("id"));
	});


})