(function (angular) {
	"use strict";
	angular.module('platform').directive('nswImgGroup', ['$timeout',function ($timeout) {
		return {
			restrict:'A',
			template:'<span class = "glyphicon glyphicon-menu-left loopleft" ng-show = "imgs.length>maxItems"  ng-click = "back()"></span>' +
			'               <div class="loopbox col-sm-11 nsw-img-group">' +
			'                   <ul>' +
			'                       <li ng-repeat = "(key,img) in imgs" class="img-container">' +
			'                           <div nsw-img ng-if="showAlt" nsw-img-src="{{nswImgSrc}}" nsw-img-alt="{{nswImgAlt}}" nsw-img-remove="{{imgRemoveAttr}}"></div>' +
			'                           <div nsw-img ng-if="!showAlt" nsw-img-src="{{nswImgSrc}}" nsw-img-remove="{{imgRemoveAttr}}"></div>' +
			'                           <div data-ng-transclude></div>' +
			'                       </li>' +
			'                   </ul>' +
			'               </div>' +
			'         <span  class = "glyphicon glyphicon-menu-right loopright" ng-show = "imgs.length>maxItems"  ng-click = "mov()"></span>',
			scope:true,
			transclude:true,
			require:'ngModel',
			link:function(scope, element ,attrs, ctrl){
				scope.enableSort = attrs.enableSort === 'true';
				scope.maxItems = parseInt(attrs.maxItems||'1');
				scope.showAlt = !!scope.nswImgAlt || attrs.showAlt === 'true';
				scope.nswImgSrc = attrs.nswImgSrc||'img.url';
				scope.nswImgAlt = attrs.nswImgAlt||'img.alt';
				scope.imgRemoveAttr = attrs.nswImgRemove;

				ctrl.$render = function $render(){
					scope.imgs = ctrl.$viewValue||[];
					var dragSource = null;

					$timeout(function(){
						$('li.img-container',element).draggable({
							axis: "x",
							appendTo: "body",
							containment: "parent",
							revert: "invalid",
							helper: "clone",
							create: function( event, ui ) {
								$(this).css('list-style','none');
							},
							start:function(){
								dragSource = $(this).scope().img;
							},
							stop:function(){
								dragSource = null;
							}
						});

						$("li.img-container", element).droppable({
							accept: "li.img-container",
							drop: function( event, ui ) {
								var target = $(this).scope().img;
								if(dragSource && target && dragSource!==target){
									var srcIndex = _.findIndex(scope.imgs, dragSource);
									_.remove(scope.imgs, dragSource);
									var targetIndex = _.findIndex(scope.imgs, target);

									if(srcIndex>targetIndex) {
										var part1 = scope.imgs.slice(0, targetIndex);
										var part2 = scope.imgs.slice(targetIndex);
									}else{
										var part1 = scope.imgs.slice(0, targetIndex+1);
										var part2 = scope.imgs.slice(targetIndex+1);
									}
									part1.push(dragSource);


									var concated = part1.concat(part2);
									scope.imgs.length = 0;
									_.forEach(concated,function(img){
										scope.imgs.push(img);
									});

									/*var srcIndex =  _.findIndex(scope.imgs, dragSource);
									if (targetIndex < srcIndex) {
										for (var index = srcIndex; index > targetIndex; index--) {
											scope.imgs[index] = scope.imgs[index - 1];
										}
										scope.imgs[index] = dragSource;
									} else if (targetIndex > srcIndex) {
										for (var index = srcIndex; index < targetIndex; index++) {
											scope.imgs[index] = scope.imgs[index + 1];
										}
										scope.imgs[index] = dragSource;
									}*/
									scope.$digest();
								}

								$('.drop-active', element).removeClass('drop-active');
							},
							over:function(){
								$('.nsw-img-dir', this).addClass('drop-active');
							},
							out:function(){
								$('.nsw-img-dir',this).removeClass('drop-active');
							}
						});
						$(".loopleft").droppable({
							accept: "li.img-container",
							over:function(){
								scope.$apply(function(){
									scope.back();
								});
							}
						});
						$(".loopright").droppable({
							accept: "li.img-container",
							over:function(){
								scope.$apply(function(){
									scope.mov();
								});
							}
						});
					});
				};

				scope.$on('itemremove', function(src){
					if($(".loopbox ul", element).hasClass('mov') && scope.imgs.length%scope.maxItems===0){
						scope.back();
					}
				});

				scope.mov = function () {
					$(".loopbox ul", element).addClass("mov").removeClass("back");
				};
				scope.back = function () {
					$(".loopbox ul", element).addClass("back").removeClass("mov");
				};
			}
		}
	}]);

}(angular));