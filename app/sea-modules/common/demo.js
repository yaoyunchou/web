define(function(require,exports,module){
	require("jquery");
	require("ag");
	var $=this.jQuery,jQuery=this.jQuery;
	
	
	//console.log(yao);
     
  
  var yao = angular.module('myapp', []);  
  
  yao.controller('PhoneListCtrl', ['$scope',  function($scope) {   $scope.phones = [
		    {"name": "Nexus S",
		     "snippet": "Fast just got faster with Nexus S."},
		    {"name": "Motorola XOOM™ with Wi-Fi",
		     "snippet": "The Next, Next Generation tablet."},
		    {"name": "MOTOROLA XOOM™",
		     "snippet": "The Next, Next Generation tablet."}
		  ];               
  }]);  
 
});
