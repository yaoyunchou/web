define(function(require,exports,moudles){
   var $=require('jquery');
  
;(function($){
	$.fn.extend({
		//yaotochk开始
	
		"yaotoch":function(){
			var startX = 0;
			var startY = 0;
			var distX = 0;
			var distY = 0;
			var dist = 0; //手指滑动距离
			var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion); //获取浏览器的信息     用正则检测是否含XX元素
			var hasTouch = 'ontouchstart' in window && !isTouchPad;//过滤浏览器类型
			var touchStart = hasTouch ? 'touchstart' : 'mousedown'; //如果浏览器有toch元素就用tocuh   否则就用mousedown
			//var touchMove = hasTouch ? 'touchmove' : 'mousemove';
			var touchMove = hasTouch ? 'touchmove' : '';
			var touchEnd = hasTouch ? 'touchend' : 'mouseup';
			var slideH=0;
			
			var twCell;
			var scrollY ;
			
			
			window.document.addEventListener(tStart,function(e){            
				
				
			})

			//触摸开始函数
				var tStart = function(e){
					
					scrollY = undefined;
					distX = 0;
					var point = hasTouch ? e.touches[0] : e;
					startX =  point.pageX;
					startY =  point.pageY;
			
			
			       console.log(startX);
			       $('.sx').html(startX);
			       $('.sy').html(startY);
			        console.log(startY);
					//添加“触摸移动”事件监听
					window.document.addEventListener(touchMove, tMove,false);
					//添加“触摸结束”事件监听
					window.document.addEventListener(touchEnd, tEnd ,false);
				}

				//触摸移动函数
				var tMove = function(e){
					if( hasTouch ){ if ( e.touches.length > 1 || e.scale && e.scale !== 1) return }; //多点或缩放
			
					var point = hasTouch ? e.touches[0] : e;
					distX = point.pageX-startX;
					distY = point.pageY-startY;
			
					if ( typeof scrollY == 'undefined') { scrollY = !!( scrollY || Math.abs(distX) < Math.abs(distY) ); }
					 console.log(distX);
			        console.log(distY);
			         $('.mx').html(distX);
			       $('.my').html(distY);
				}

				//触摸结束函数
				var tEnd = function(e){
					if(distX==0) return;
					e.preventDefault(); 
					
			
					window.document.removeEventListener(touchMove, tMove, false);
					window.document.removeEventListener(touchEnd, tEnd, false);
					 console.log(startX);
			        console.log(startY);
			          $('.ex').html(startX);
			       $('.ey').html(startY);
				}

   
				//添加“触摸开始”事件监听
				window.document.addEventListener(touchStart, tStart ,false);
			
		}
		//yaotoch结束
		
		
	});
	
	
})(jQuery);
})