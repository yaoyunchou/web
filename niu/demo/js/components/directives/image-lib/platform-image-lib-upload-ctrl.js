/*global angular*/
(function (angular) {
	"use strict";

	var module = angular.module('platform');
	module.controller('platformImageLibUploadCtrl', ['$scope', 'utils', function ($scope, utils) {

		var imageLibService = $scope.$parent.getImageLibSvc();
		var isOverflow = true;

		var delFileExtension = function delFileExtension(str) {
			var reg = /\.\w+$/;
			return str.replace(reg, '');
		};

		var onBeforeFileQueued = function onBeforeFileQueued(sender) {
			//验证可上传图片的张数
			var len = sender.getFiles('queued').length;//查询上传队列中的文件数
			if (len >= imageLibService.maxCount && isOverflow) {
				isOverflow = false;
				utils.alertBox('提示', '只能上传 ' + imageLibService.maxCount + ' 张图片！！！');
				return false;
			}
		};

		var onFileQueued = function onFileQueued(sender, file) {
			sender.makeThumb(file, function (error, src) {
				if (error) {
					//不支持预览
					return;
				}
				//加入上传队列
				var id = file.id, img = {};
				img.src = src;
				img.name = delFileExtension(file.name);
				img.state = '准备上传';
				img.hasProgress = false;
				img.progress = 0;
				$scope.fileQueued[id] = img;
				imageLibService.addCreatedItems(img);
				//触发页面刷新
				$scope.$apply();
			}, 94, 79);
		};

		var onUploadStarted = function onUploadStarted(sender, file) {
			var id = file.id;
			sender.option('formData', {'zdyName': $scope.fileQueued[id].name});
		};

		var onUploadProgress = function onUploadProgress(sender, file, percentage) {
			var id = file.id;
			$scope.fileQueued[id].hasProgress = true;
			$scope.fileQueued[id].progress = percentage;
			//触发页面刷新
			$scope.$digest();
		};

		var onUploadError = function onUploadError(sender, file) {
			var id = file.id;
			$scope.fileQueued[id].hasProgress = false;
			$scope.fileQueued[id].state = '上传失败';
			//触发页面刷新
			$scope.$digest();
		};

		var onUploadSuccess = function onUploadSuccess(sender, file, res) {
			var id = file.id;
			$scope.fileQueued[id].hasProgress = false;
			$scope.fileQueued[id].progress = 100;
			$scope.fileQueued[id].state = '上传成功';
			$scope.fileSuccessQueued.push(res.data);
			//触发页面刷新
			$scope.$digest();
		};

		var onUploadFinished = function onUploadFinished() {
			$scope.$emit('close', $scope.fileSuccessQueued);
		};

		var onError = function onError(sender, res) {
			if (res === 'Q_TYPE_DENIED') {
				utils.alertBox('提示', '图片类型不正确！！！');
			} else if (res === 'Q_EXCEED_SIZE_LIMIT') {
				utils.alertBox('提示', '图片总大小超出！！！');
			} else if (res === 'Q_EXCEED_NUM_LIMIT') {
				utils.alertBox('提示', '图片数量超出！！！');
			}
		};

		$scope.uploaderOptions = {
			multiple: imageLibService.multiple,
			beforeFileQueued: onBeforeFileQueued,
			fileQueued: onFileQueued,
			uploadStart: onUploadStarted,
			uploadProgress: onUploadProgress,
			uploadError: onUploadError,
			uploadSuccess: onUploadSuccess,
			uploadFinished: onUploadFinished,
			error: onError
		};
	}]);
}(angular));