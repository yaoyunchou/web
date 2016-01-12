var indexApp = angular.module('indexApp', []);

infoApp.controller('indexCtrl', ['$scope', '$http', '$state','platformModalSvc',function($scope, $http, $state,platformModalSvc){
	
}]); 

//路由配置
infoApp.config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/index');
		$stateProvider.state('index', { //
			url: '/index',
			templateUrl: 'index.html',
			controller: 'indexCtrl'
		})
	}

]);