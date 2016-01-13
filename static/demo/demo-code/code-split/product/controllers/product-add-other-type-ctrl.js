/*global angular*/
(function (angular) {
	"use strict";

	//相同属性添加
	angular.module('productApp').controller('addOtherTypeCtrl', ['utils', '$scope', '$modalInstance', '$rootScope', function (utils, $scope, $modalInstance, $rootScope) {
		$scope.ok = function () {
			$modalInstance.close();
		};

		$scope.cancel = function () {
			$modalInstance.dismiss();
		};

		//选择文件类型
		var type = "text";
		$scope.checkway = function (mod) {
			type = "mod";
			if (mod === "text") {
				$(".textbox,.tishi,.txmore").show();
				$(".dtbox").hide();
			} else {
				$(".textbox,.smwd,.tishi,.txmore").hide();
				$(".dtbox").show();
			}
		};

		//显示input  还是textarea
		$scope.moretoggle = function () {
			if ($('.smwd').is(":hidden")) {
				$(".smwd").show();
			} else {
				$(".smwd").hide();
			}
		};

		//添加属性个数
		var index = 5;
		$scope.inputlist = [{"num": "1"}, {"num": "2"}, {"num": "3"}, {"num": "4"}, {"num": "5"}];

		$scope.addtext = function () {
			index++;
			$scope.inputlist.push({'num': index});
		};

		//定义数据
		$scope.adddata = {};//定义一级容器

		//添加数据
		$scope.adddatafun = function () {
			if (type === "text") {
				$scope.adddata.value = $scope.zdcd ? $scope.zdcd : $scope.zdcdbg;
			} else {
				$scope.adddata.value = [];
				for (var i = 0; i < $scope.inputlist.length; i++) {
					if ($scope.inputlist[i].sx) {
						$scope.adddata.value.push($scope.inputlist[i].sx);
					}
				}
			}
			$scope.adddata.index = $rootScope.long;
			$scope.lists.push($scope.adddata);
			$rootScope.mylist.push($scope.adddata);
			jtou();
			$rootScope.long++;
			//console.log($rootScope.mylist);
			$scope.adddata = {};
			$modalInstance.close();
		};
		//总数据

		//通过序号判断上下箭头
		function jtou() {
			for (var list in $scope.lists) {
				if ($rootScope.long === 1) {
					$scope.mylist[list].up = false;
					$scope.mylist[list].down = false;

				} else if ($scope.mylist[list].index === 1) {
					$scope.mylist[list].down = true;
					$scope.mylist[list].up = false;
				} else if ($scope.mylist[list].index === $rootScope.long) {
					$scope.mylist[list].up = true;
					$scope.mylist[list].down = false;
				} else {
					$scope.mylist[list].up = true;
					$scope.mylist[list].down = true;
				}
			}
		}
	}]);
}(angular));