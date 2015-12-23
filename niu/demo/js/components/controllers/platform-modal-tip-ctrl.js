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
				.css('background-color','#C4C5CA')
				.closest('.modal-dialog')
				.css('box-shadow', '0 0 0')
				.css('opacity', 0.6)
				.css('margin-top','150px');
	}]);
}(angular));