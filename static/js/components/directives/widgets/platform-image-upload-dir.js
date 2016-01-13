(function (angular) {
	"use strict";

	angular.module('platform').directive('platformImageUpload',[function(){
		return {
			template:'     <div class="image-upload" img-lib="" ng-model="img.product" data-img-count="8">' +
			'                   <i class="icon"></i>' +
			'                   <h6 class="content">点击上传</h6>' +
			'               </div>' ,
			restrict:'A',

		};
	}]);
}(angular));