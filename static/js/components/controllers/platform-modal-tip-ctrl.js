/*global angular*/
(function (angular) {
	"use strict";
	angular.module('platform').controller('platformModalTipCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
		//close the dialog on three seconds later after display.
		$timeout(function () {
			$scope.closeModal(true);
		}, 3000);

		$scope.getTipIcon = function getTipIcon() {
			switch ($scope.modalOptions.type) {
				case 'success':
					return 'icon-success';
				case 'warming':
					return 'icon-warming';
				default:
					return 'icon-loading';
			}
		};

		$('.tip-box').closest('.modal-content')
			.css('border', 0)
			.css('box-shadow', '0 0 0')
			.css('background-color', '#C4C5CA')
			.closest('.modal-dialog')
			.css('box-shadow', '0 0 0')
			.css('opacity', 0.6);

		$('.modal-backdrop').css('display', 'none');

		$('.nsw.modal-dialog').css('margin',0);

		$('.nsw.modal').css('width', $('.modal-content').width)
			.css('height', '59px')
			.css('overflow', 'hidden')
			.css('margin-top','150px')
			.css('width','300px')
			.css('margin-left','40%');
	}]);
}(angular));