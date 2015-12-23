/**
 * Created by yaoyc on 2015/12/11.
 */
/*global angular*/
(function(angular){
    "use strict";
	angular.module("myApp").controller('filterCtrl',["$scope",function($scope){
      $scope.pageHeader = "behold the majesty of your page titles!"
	}])
		.filter("titleCase",function(){
			var titleCaseFilter = function(input){
				var words = input.split(" ");
				for( var i in words){
					words[i] = words[i].charAt(0).toLocaleUpperCase()+words[i].slice(1);
				}
				return words.join(" ");
			}
			return titleCaseFilter;
		})
}(angular));