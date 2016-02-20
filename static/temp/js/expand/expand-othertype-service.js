/**
 * Created by yaoyc on 2016/2/16.
 */
/*global angular*/
(function(angular){
    "use strict";
	var expandApp = angular.module('expandApp');
	expandApp.factory('otherTypeSvc',['$q',function(){
		var service = {};
		service.adddata =   function adddata(obj){


		};
		return service;
	}]);

}(angular));