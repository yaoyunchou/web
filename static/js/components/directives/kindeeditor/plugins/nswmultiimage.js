/*globals KindEditor, _*/
(function (angular) {
	"use strict";

	angular.module('platform').factory('nswmultiimagePluginSvc', ['platformModalSvc', function (platformModalSvc) {
		var service = {};
		service.init = function init() {
			KindEditor.plugin('nswmultiimage', function (K) {
				var self = this, name = 'nswmultiimage', attrs = null;

				self.lang({
					'nswmultiimage':'批量图片上传'
				});

				var appendImage = function appendImage(image) {
					self.exec('insertimage', globals.basImagePath + image.url, image.fileName, null, null, null, image.align, null);
					var img = self.cmd.commonNode({img: "*"});
					var p = img.parent();
					while (p && p.name) {
						if (p.name === "body" || p.name === "p") {
							break;
						}
						p = p.parent();
					}
					if ((!p || p.name !== "p")) {
						img.after('<p></p>');
						p = img.next();
						p.append(img);
						if (attrs) {
							p.attr(attrs);
						}
					}
					if (p) {
						if (attrs === null) {
							attrs = p.attr();
						}
						p.after('<span></span>');
						var span = p.next();
						self.cmd.range.selectNode(span[0]);
						self.cmd.select(false);
						if (span) {
							span.remove();
						}
					}
					if (p && image.align) {
						switch (image.align) {
							case "center":
								p.css("text-align", image.align).css("text-indent", null);
								break;
						}
					}
				};

				var updateDisplay = function updateDisplay(imgList) {
					attrs = null;
					_.forEach(imgList, appendImage);
				};

				var showImageDialog = function showImageDialog() {
					return platformModalSvc.showModal({
						templateUrl: globals.basAppRoot + '/partials/imglibWin.html',
						controller: 'imglibWinCtrl',
						size: 'lg',
						options: {
							imgConfig: {
								'count': 15,
								'size': 3000,
								'width': 800,
								'height': 600,
								'ext': 'gif,jpg,jpeg,bmp,png'
							},
							backImgList:[]
						}
					}).then(function (imgList) {
						updateDisplay(imgList);
					});
				};

				self.plugin.spechars = {
					edit: function () {
						showImageDialog();
					}
				};

				self.clickToolbar(name, self.plugin.spechars.edit);
			});
		};
		return service;
	}]);
}(angular));