
var uploadApp = angular.module('uploadApp', ['ui.tree','common','ui.bootstrap','ngLocale', 'ngSanitize', 'ui.router','commonJQuery']);//'ng.webuploader'

uploadApp.run(['$rootScope','$location','$http', function($rootScope,$location,$http) {   
	$rootScope.rootHttp = function(){
		$http({
			method: 'GET',
			url: '/pccms/module/extend/list/tree',
			
		}).success(function(data, status, headers, config) {
		
	    	if(data.isSuccess){
	    		$rootScope.menus = data.data;
	    		console.log( data.data);
	    	}
	    }).error(function(data, status, headers, config) {
	    	console.log('系统异常或网络不给力！');
	    });
	}
	$rootScope.rootHttp();
	$rootScope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        //下面是在menus完成后执行的js
      menulist();      
	});
}]);

uploadApp.directive('fileuploader',['$modal',function($modal){
	var taskId = new Date().getTime();
	return {
        restrict : 'A',
        scope: {
          config: "=",
          uploader: "="
        },
        link : function($scope, element, attr, ctrl) {
        	//复制扩展属性
            var opts = $scope.config ? $scope.config : {};
    	    var option = {
    	    	auto: true,//是否自动上传
    	    	server: "/pccms/file/upload?taskId="+taskId,//文件上传接口
                swf: "/pccms/plugin/ueditor/third-party/webuploader/Uploader.swf",
    	        label: "首页入驻",//文字标签
    	        formData: {},
    	        fileVal: "file",//上传文件域
    	        extensions: "zip",//文件类型
                mimeTypes: "application/x-zip-compressed",
    	        multiple: false,//是否多文件上传
    	        duplicate: true,//是否充许重复文件上传
    	        beforeFileQueued: null,//当文件添加前回调
    	        fileQueued: null,//当文件添加到队列时回调
    	        uploadStart: null,//当文件开始上传时
    	        uploadProgress: null,//文件上传进度回调
    	        uploadSuccess: null,//文件上传成功回调 
    	        uploadError: null,//文件上传失败回调
    	        uploadComplete: null,//当上传完成时回调
    	        uploadFinished: null,//当所有文件上传结束时触发
    	        error: null//验证失败时回调
    	    };

            angular.extend(option, opts);

    	    var _uploader;
    	    
			_uploader = WebUploader.create({
                // 选完文件后，是否自动上传。
                auto: option.auto,
                // swf文件路径
                swf: option.swf,
                // 文件接收服务端。
                server: option.server,
                // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                pick: {
                    id: element,
                    label: option.label,
                    multiple: option.multiple
                },
                fileVal: option.fileVal,
                //只允许选择文件类型
                accept: {
                    title: "zip",
                    extensions: option.extensions,
                    mimeTypes: option.mimeTypes
                },
    	        duplicate: option.duplicate,
                button: element,
                formData: option.formData
            });
			
            // 当添加文件前
            _uploader.on("beforeFileQueued", function(file) {
                if(typeof(option.beforeFileQueued) == "function"){
                    return option.beforeFileQueued.apply(this, [_uploader, file]);
                }
            });
            
            // 当有文件添加进来的时候
			_uploader.on("fileQueued", function(file) {
                if(typeof(option.fileQueued) == "function"){
                    option.fileQueued.apply(this, [_uploader, file]);
                };
				
            });

		
            // 当有文件开始上传的时候
			_uploader.on("uploadStart", function(file) {
				
                if(typeof(option.uploadStart) == "function"){
                    option.uploadStart.apply(this, [_uploader, file]);
                }
                
                $modal.open({
                    backdrop : 'static',
                    templateUrl :'/pccms/partials/fileupload.html',
                    controller : ['$scope','$http','$modalInstance', 'utils',  function($scope,$http,$modalInstance,utils) {
                    	$scope.cancel = true;
                    	//var taskId = '';
        				//getTaskId();
        				
        				//取消
				    	$scope.cancel = function () {
        					$http({
        			    		url: "/pccms/file/cancelUpload?taskId="+taskId,
        			    		type: "GET"
        			    	}).success(function(data, status, headers, config) {
    			    			if(data.isSuc){
    			    				$modalInstance.close();
    			    			    window.location.reload();
    			    			}else{
    			    				utils.alertBox('提示', '取消失败！',function(){
                	    				if(!$scope.$$phase) { 
                	    					$scope.$apply();
                	    				} 
                	    			}); 
    			    			}
        	                    			
        				    }).error(function(data, status, headers, config) {
        				    	utils.alertBox('提示', '网络不给力，请稍后再试！',function(){
            	    				if(!$scope.$$phase) {
            	    					$scope.$apply();
            	    				} 
            	    			});
        				    });

        				};
                    	/*//获取任务id
        				function getTaskId(){
        					$http({
        						method: 'GET',
        						url: '/pccms/publish/getTaskId',
        					}).success(function(data, status, headers, config) {
        				    	if(data.isSuc){
        				    		taskId = data.data;
        				    		option.server = '/pccms/file/upload?taskId='+taskId ;
        	        				alert(option.server);
        				    		//进度监控
        				    		
        				    	};
        				    }).error(function(data, status, headers, config) {
        				    	utils.alertBox('提示', '系统异常或网络不给力！',function(){
            	    				if(!$scope.$$phase) { 
            	    					$scope.$apply();
            	    				} 
            	    			});
        				    });
        				}*/
        				 getUploadStatus();
                    	 function getUploadStatus(){
                    		console.log(taskId);
                    		$http({
                    			method: 'POST',
                    			url: '/pccms/progress/file?taskId='+taskId,
                    			data: {"taskId": taskId},
                    		}).success(function(data, status, headers, config) {
                    			if(!data.isSuccess){
                	    			utils.alertBox('提示', "上传并解压监控失败：" + data.message,function(){
            	    		    		if(!$scope.$$phase) { 
                	    					$scope.$apply();
                	    				} 
                	    			});
                	    	    }else{
                	    		    data = jQuery.parseJSON(data.message);
                	    		    //上传的状态 0:进行中(process) 1:取消(cancel) 2:结束(closed) 3.压缩包上传中（zip） 4.解压压缩包 5.文件入库(上传GridFS) -1:发布异常
                	    		    var index = data.index;
                	    		    //进度百分比
                	    		    var status = (undefined == data.percent) ? 0 : data.percent;
                	    		    var hint = (undefined == data.hint) ? "上传并解压中..." : data.hint;
                	    		    if(status >= 0 && status <=100 && index != 2){
                	    		    	setTimeout(function(){
                	    		    		getUploadStatus();
                	    		    	},1000);
	                	    		   	$scope.w = status;
	                	    		   	$scope.style = {width: status+'%'};
                	    		    	if(index < 0){
                	    		    		utils.alertBox('提示', hint,function(){
                	    		    			if(!$scope.$$phase) { 
                        	    					$scope.$apply();
                        	    				} 
                        	    			});
                	    		    		return;
                	    		    	}else if(index == 5 || index == 2){
                	    		    		$scope.cancel = false;
                	    		    	}
                	    		    }else if(status < 0){
                	    		    	utils.alertBox('提示', hint,function(){
                	    		    		if(!$scope.$$phase) { 
                    	    					$scope.$apply();
                    	    				} 
                    	    			});
                	    		    }else if(status == 100 && index == 2){
                	    		    	$scope.w = status;
                                   		$scope.style = {width: status+'%'};
                                   		setTimeout(function(){
                   	    			    	utils.alertBox('提示', '上传并解压成功!',function(){
                                                   window.location.href="/pccms/temp/page/index.html#/"
                           	    			});
                   	    			    }, 1000);
                	    		    }
                	    	    }
                    	    }).error(function(data, status, headers, config) {
                    	    	//延时3m,以区别主动取消（使得这个操作不提示此错误）
                	    		setTimeout(function(){
                	    			utils.alertBox('提示', '网络故障请重新上传！',function(){
                	    				if(!$scope.$$phase) { 
                	    					$scope.$apply();
                	    				} 
                	    			});
                	    		}, 3000);
                    	    });
                    	};
        			}]
                });
                
            });
			
            // 文件上传过程中创建进度条实时显示。
			_uploader.on("uploadProgress", function(file, percentage) {
                if(typeof(option.uploadProgress) == "function"){
                    option.uploadProgress.apply(this, [_uploader, file, percentage]);
                }
                
            });
			
            // 文件上传成功
			_uploader.on("uploadSuccess", function(file, res) {
            	if(typeof(option.uploadSuccess) == "function"){
                    option.uploadSuccess.apply(this, [_uploader, file, res]);
                }
            	console.log(res)
            });
			
            // 文件上传失败，显示上传出错。
			_uploader.on("uploadError", function(file) {
                if(typeof(option.uploadError) == "function"){
                    option.uploadError.apply(this, [_uploader, file]);
                }
            });
			
            // 完成上传完了，成功或者失败
			_uploader.on("uploadComplete", function(file) {
                if(typeof(option.uploadComplete) == "function"){
                    option.uploadComplete.apply(this, [_uploader, file]);
                }
            });
			
            // 当所有文件上传结束时触发
			_uploader.on("uploadFinished", function(file) {
                if(typeof(option.uploadFinished) == "function"){
                    option.uploadFinished.apply(this, [_uploader, file]);
                }
            });
			
			_uploader.on("error", function(res){
            	//Q_EXCEED_NUM_LIMIT 文件数量超出
            	//Q_EXCEED_SIZE_LIMIT 文件总大小超出
            	//Q_TYPE_DENIED 文件类型不正确
                if(typeof(option.error) == "function"){
                    option.error.apply(this, [_uploader, res]);
                }
                console.log(res)
            });
			//返回图片上传实例
            if (typeof $scope.uploader === "function") {
            	$scope.uploader(_uploader);
            }
        }
    }
}]);

//安装向导                             
uploadApp.controller('uploadCtrl', ['$scope',  '$modal',  '$http', '$state', 'utils', '$timeout',function($scope, $modal, $http, $state, utils, $timeout) {
	
}]);

//安装向导，路由配置
uploadApp.config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
		$stateProvider.state('upload', {
			url: '/',
			templateUrl: 'upload.html',
			controller: 'uploadCtrl'
		});
	}

]);

/************
 * 加载menu的点击动画效果  
 * a.添加angularjs 在menu 遍历完时的监控
 * b.当menu遍历完成时候  加载动画js menulist()
 * **********/

uploadApp.directive('onFinishRenderFilters', function ($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    };
});
