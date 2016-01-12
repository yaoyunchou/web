var pageApp = angular.module('pageApp', ['ui.tree',  'platform', 'common', 'ui.bootstrap', 'ui.bootstrap.pagination']);
pageApp.controller('pageCtrl', ['$scope','$http','$state','utils','platformModalSvc','mobilePreviewSvc', function ($scope, $http, $state,utils,platformModalSvc,mobilePreviewSvc) {
	
	$scope.addSingle = function(scope){
		var nodeScope = scope.$nodeScope;
		var node = nodeScope.$modelValue;
		var type = node.type;
		var style = node.style;
		var id = scope.$nodeScope.$parentNodeScope.$modelValue._id;
		var params = {type: 'single', id: id, name: node.name, style: style}
		if('PAGETYPE' == type){
			params.pName = nodeScope.$parentNodeScope.$modelValue.name;
		}
		$state.go('filter', params);
	}
	$scope.addPack = function(node){
		$state.go('filter', {type: 'pack'});
	}

	/**
	 * 增加模块
	 */
	$scope.addChannel = function(scope){
		var channelName = $scope.channelName;
		
		if($.trim(channelName)){
			var patrn=/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;  
			if(patrn.test($.trim(channelName))){ 
				platformModalSvc.showWarmingMessage('您输入的数据含有非法字符',nsw.Constant.TIP);
			    return;  
			}
			var dirName = codefans_net_CC2PY(channelName);
			var data= {'name':channelName, 'dirName':dirName};
			$http.post('/pccms/module/extend',data).success(function(data, status, headers, config) {
		        if(data.isSuccess){
		        	loadTree();	
		        	$scope.channelName = '';
		        }else{
			    	platformModalSvc.showWarmingMessage(data.data,nsw.Constant.TIP);
			    }
		    })
		    .error(function(data, status, headers, config) {
		   	   // platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
		    });
		}else{
			platformModalSvc.showWarmingMessage('请填写频道名称！',nsw.Constant.TIP);
		}
	}
	
	//加载页面树
	function loadTree(){
	    $http.post('/pccms/proj/projPageTplPack/findPageTplPackTree').success(function(data, status, headers, config) {
			if(data.isSuccess){
	        	if(data.data && data.data.length){
	        		$scope.data = data.data;
	        		$scope.flag = data.flag;
	    			$state.go('page');
	    	    }else{
	            	$state.go('filter',{'type': 'pack'});
	            }
	        }else{
		    	platformModalSvc.showWarmingMessage(nsw.Constant.OPERATION,nsw.Constant.TIP);
		    }
	    })
	    .error(function(data, status, headers, config) {
	    	platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
	    });
	}
	loadTree();
	
	//定义页面名称修改隐藏与显示之间的切换
	$scope.change = false;
	$scope.inputShowed = function(nodeId){	
		$scope.nodeId = nodeId;
		$scope.change = !$scope.change ;
	};
	
	//页面名称修改后保存
	$scope.nodeSave = function(id,name){
		var data = {"name": name};
		if(data.name == null || data.name == '' ){
			platformModalSvc.showWarmingMessage(nsw.Constant.INPUTNAME,nsw.Constant.TIP);
			return;
		}else{
			platformModalSvc.showWarmingMessage(nsw.Constant.UPDATESUC,nsw.Constant.TIP,false).then(function(){
				$http.put('/pccms/proj/projPageTplPack/pageTpl/'+id,data).success(function(data, status, headers, config) {
					if(data.isSuccess){
						$scope.change = false;	
						$state.go('page');
					}else{
				    	platformModalSvc.showWarmingMessage(nsw.Constant.OPERATION,nsw.Constant.TIP);
				    }
					
			   })
			   .error(function(data, status, headers, config) {
				   platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
			   });
			});
		}
	};
	
	//页面删除
	$scope.deleteNode = function(nodeId,type,element){
		platformModalSvc.showConfirmMessage(nsw.Constant.CONFIRMDEL,nsw.Constant.TIP,true).then(function(){
			if(type == 'PAGETPL'){
				$http({
					method: 'DELETE',
					url: '/pccms/proj/projPageTplPack/pageTpl/'+nodeId,		
				})
				.success(function(data, status, headers, config) {
			    	if(data.isSuccess){
			    		loadTree();
			    		//element.remove();
			    	}else{
				    	platformModalSvc.showWarmingMessage(nsw.Constant.OPERATION,nsw.Constant.TIP);
				    }
			    })
			    .error(function(data, status, headers, config) {
			    	platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
			    });
			}
			
			if(type == 'CHANNEL' || type == 'PAGEMAIN'){
				$http({
					method: 'DELETE',
					url: '/pccms/module/extend/'+nodeId,			
				})
				.success(function(data, status, headers, config) {
			    	if(data.isSuccess){
			    		loadTree();
			    		//element.remove();
			    	}else{
				    	platformModalSvc.showWarmingMessage(nsw.Constant.OPERATION,nsw.Constant.TIP);
				    }
			    })
			    .error(function(data, status, headers, config) {
			    	platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
			    });
			}
		});
	}
	//项目页面版块编辑
	$scope.blkEdit = function(tplId){
		window.open("/pccms/pageTpl/design/"+tplId+"/edit?isPubTpl=false");
	}
	//项目页面预览
	$scope.singlePagePreview = function(tplId){
		window.open("/pccms/pageTpl/design/"+tplId+"/view?isPubTpl=false");
	}
	
}]);

//页面模板筛选
pageApp.controller('filterCtrl', ['$scope', '$state', '$stateParams', '$http','utils','platformModalSvc','mobilePreviewSvc',function ($scope, $state, $stateParams, $http, utils,platformModalSvc,mobilePreviewSvc) {

	//$scope.breadNavs.push({href: '.', name: '模板筛选'});

	//筛选类型
	$scope.filterType = $stateParams.type || 'single';
	//节点id
	$scope.nodeId = $stateParams.id;
	//style 
	$scope.style = $stateParams.style;
	//记录选中项
	$scope.selectList = [];
	//记录筛选列表数据
	$scope.filterData = {};
	//返回
	$scope.returnPage =function(){
		$state.go('page');
	};
	$scope.mask = false;
	//加载标签列表
	$http.get('/pccms/tpl/loadTplTag').success(function(data, status, headers, config) {
	    if(data.isSuccess){
	    	$scope.tagList = data.data;
	    	initTagState();
	    	//加载初始筛选列表
	    	filterTplList($http, $scope.selectList.join(","));
	    }else{
		    platformModalSvc.showWarmingMessage(nsw.Constant.TAGFAILURE,nsw.Constant.TIP);
	    }
	 })
	 .error(function(data, status, headers, config) {
	     platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
	 });
	
	//标签选择事件
	$scope.selectTag = function(tag, tags){
		if(tags.isDisabled){
			return;
		}
		if(tag.selected){
			tag.selected = false;
			removeTag(tag._id);
		}else{
			removeSelectTag(tags);
			tag.selected = true;
			$scope.selectList.push(tag._id);
		}
		filterTplList($http, $scope.selectList.join(","));
		
	}
	//弹出新增模板
	$scope.addTpl = function() {
		//$scope.mask = true;
		platformModalSvc.showModal({
			backdrop: 'static',
			templateUrl: globals.basAppRoot + 'temp/page/add-tpl.html',
			controller: 'addTplCtrl',
			size: 'lg',
			userTemplate:true,
			options:{
				tag: $scope.selectList.join(",")
			}
		}).then(function(data){
			filterTplList($http, $scope.selectList.join(","));
		});
	};
	/*//公用模板保存
	$scope.saveTpl = function(){
		var obj = {};
			obj.tag = $scope.selectList.join(",");
			obj.name = $scope.name;
			obj.content = $scope.content;
			obj.designIdea = $scope.designIdea;
			obj.isPubTpl = true;
			if($scope.res) obj.imgSm = $scope.res[0].path || '';
			if($scope.res1) obj.imgMd = $scope.res1[0].path || '';
			if($scope.res2)obj.imgLg = $scope.res2[0].path || '';
			if($scope.res3)obj.imgFr = $scope.res3[0].path || '';
			
		$http({
			method: 'POST',
			url: '/pccms/tpl/page/add',
			data: obj
		}).success(function(data, status, headers, config) {
	    	if(data.isSuccess){
	    		closeDialog();
	    		filterTplList($http, $scope.selectList.join(","));
	    	}else{
		    	platformModalSvc.showWarmingMessage(nsw.Constant.OPERATION,nsw.Constant.TIP);
		    }
	    }).error(function(data, status, headers, config) {
	    	platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
	    });
	}
	//取消
	$scope.cancelTpl = function(){
		closeDialog();
	}*/
	//关闭弹框
	function closeDialog(){
		$scope.mask = false;
	}
	//在模板市场中预览单页,单页id为singleId,页面节点ID为$stateParams.id
	$scope.preSinglePag = function(singleId){
		$state.go('preview', {'id': singleId, 'node':$stateParams.id, 'style':$stateParams.style});
	}
	//在模板市场中预览套装,套装id
	$scope.previewPackPag = function(packId){
		$state.go('previewPack', {'id': packId});
	}
	
	//在模板市场中手机预览
	$scope.mobilePreview = function(tplId){
		if(tplId){
			var urlLink = globals.basAppRoot + 'pageTpl/design/' +tplId+ '/view?isPubTpl=false#/';
			mobilePreviewSvc.mobilePreview(urlLink);
		}else{
			platformModalSvc.showWarmingMessage('没有预览的链接地址！', '提示');
			return;
		}
	};
	
	//在模板市场中确认使用单页, singleTplId为单页面模板ID,singleNodeId为节点ID
	$scope.selSingle = function(singleTplId){
		/*utils.confirmBox(nsw.Constant.TIP, nsw.Constant.CONFIRMUSE,function(){
			var data = {"tplId":singleTplId , "nodeId":$stateParams.id, "style":$scope.style }
			$http.post('/pccms/proj/projPageTplPack/pageTpl', data).success(function(data, status, headers, config) {
		    	if(data.isSuccess){
		    		$state.go('page');
		    	}else{
		    		platformModalSvc.showWarmingMessage(nsw.Constant.OPERATION,nsw.Constant.TIP);
		    	}
		    })
		    .error(function(data, status, headers, config) {
		    	platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
		    });
		},function(){
			return;
		},'sm');*/
		platformModalSvc.showWarmingMessage(nsw.Constant.CONFIRMUSE,nsw.Constant.TIP,true).then(function(){
			var data = {"tplId":singleTplId , "nodeId":$stateParams.id, "style":$scope.style }
			$http.post('/pccms/proj/projPageTplPack/pageTpl', data).success(function(data, status, headers, config) {
		    	if(data.isSuccess){
		    		$state.go('page');
		    	}else{
		    		platformModalSvc.showWarmingMessage(nsw.Constant.OPERATION,nsw.Constant.TIP);
		    	}
		    })
		    .error(function(data, status, headers, config) {
		    	platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
		    });
		})
	}
	
	//在模板市场中确认选择套装
	$scope.selPack = function(id){
		/*utils.confirmBox(nsw.Constant.TIP, nsw.Constant.REPLACEOLD,function(){
			var data = {"packId": id};  
		    $http.post('/pccms/proj/projPageTplPack/',data).success(function(data, status, headers, config) {
		    	if(data.isSuccess){
		            $state.go('page');
		    	}else{
			    	platformModalSvc.showWarmingMessage(nsw.Constant.OPERATION,nsw.Constant.TIP);
			    }
		 	})
		 	.error(function(data, status, headers, config) {
		 		platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
		 	});
		},function(){
			return;
		},'md');*/
		platformModalSvc.showWarmingMessage(nsw.Constant.REPLACEOLD,nsw.Constant.TIP,true).then(function(){
			var data = {"packId": id};  
		    $http.post('/pccms/proj/projPageTplPack/',data).success(function(data, status, headers, config) {
		    	if(data.isSuccess){
		            $state.go('page');
		    	}else{
			    	platformModalSvc.showWarmingMessage(nsw.Constant.OPERATION,nsw.Constant.TIP);
			    }
		 	})
		 	.error(function(data, status, headers, config) {
		 		platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
		 	});
		})
	}
	
	//筛选模板
	function filterTplList(http,tagArr){
		var requestUrl = '/pccms/tpl/pubPageTpl/' + $scope.filterType + '/1';
		$http({
			method: 'GET',
			url: requestUrl,
			params: {'pageSize': 20, 'tagIds': tagArr}
		})
		.success(function(data, status, headers, config) {
	    	if(data.isSuccess){
	    		$scope.filterData = data.data;
	    		for(var i in $scope.filterData){
	    			var item = $scope.filterData[i];
	    			for(var j in item){
	    				if(item[j].imgSm == undefined){
	    					item[j].imgSm = '../../img/nsw.png';
	    				}
	    			}
	    		}
	    	}else{
	    		platformModalSvc.showWarmingMessage(nsw.Constant.TAGFAILURE,nsw.Constant.TIP);
	    	}
	    })
	    .error(function(data, status, headers, config) {
	    	platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
	    });
	}
	
	//去除同级标签选中项
	function removeSelectTag(tags){
		for(var i in tags.children){
			var item = tags.children[i];
			if(item.selected){
				item.selected = false;
				removeTag(item._id);
			}
		}
	}
	
	//移除选择项
	function removeTag(tagId){
		for(var i in $scope.selectList){
			if(tagId == $scope.selectList[i]){
				$scope.selectList.splice(i,1)
				return;
			}
		}
	}
	
	//初始化标签选择状态
	function initTagState(){
		for(var i in $scope.tagList){
			var item = $scope.tagList[i];
			if('network' == item.name){
				item.isDisabled = true;
				//默认选中pc网站
				for(var j in item.children){
					var child = item.children[j];
					if('pc' == child.name){
						child.selected = true;
						$scope.selectList.push(child._id);
					}
				}
			}else if('channel' == item.name){
				item.isDisabled = true;
				for(var j in item.children){
					var child = item.children[j];
					if($stateParams.pName && $stateParams.pName == child.value){
						child.selected = true;
						$scope.selectList.push(child._id);
					}else if($stateParams.name == child.value){
						child.selected = true;
						$scope.selectList.push(child._id);
					}
				}
			}else if('pagetype' == item.name){
				item.isDisabled = true;
				for(var j in item.children){
					var child = item.children[j];
					if($stateParams.pName && $stateParams.name == child.value){
						child.selected = true;
						$scope.selectList.push(child._id);
					}
				}
			}
		}
	}
}]).controller('addTplCtrl', ['$scope','platformModalSvc', '$modalInstance', '$http', 'utils', '$animate', '$state', '$stateParams',
                              function ($scope,platformModalSvc, $modalInstance, $http, utils, $animate, $state, $stateParams) {
	//公用模板保存
	$scope.saveTpl = function(){
		var obj = {};
			obj.tag = $scope.modalOptions.tag;	
			obj.name = $scope.name;
			obj.content = $scope.content;
			obj.designIdea = $scope.designIdea;
			obj.isPubTpl = true;
			if($scope.res) obj.imgSm = $scope.res[0].url || '';
			if($scope.res1) obj.imgMd = $scope.res1[0].url || '';
			if($scope.res2)obj.imgLg = $scope.res2[0].url || '';
			if($scope.res3)obj.imgFr = $scope.res3[0].url || '';
			
		$http({
			method: 'POST',
			url: '/pccms/tpl/page/add',
			data: obj
		}).success(function(data, status, headers, config) {
	    	if(data.isSuccess){
	    		$scope.closeModal(true);
	    		platformModalSvc.showSuccessTip('保存成功');
	    	}else{
		    	platformModalSvc.showWarmingMessage(nsw.Constant.OPERATION,nsw.Constant.TIP);
		    }
	    }).error(function(data, status, headers, config) {
	    	platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
	    });
	}
	//取消
	$scope.cancelTpl = function(){
		$scope.closeModal(false);
	}
	
}]);


//单页面预览
pageApp.controller('previewCtrl', ['$scope','$http','$state','$stateParams','utils','platformModalSvc',function ($scope,$http,$state,$stateParams,utils,platformModalSvc) {
	
	$scope.tplId = $stateParams.id;
	//筛选类型
	$scope.filterType = $stateParams.type;
	//效果图、框架图之间的切换
	$scope.isShow = true;
	$scope.mask = false;
	//取消
	$scope.cancelTpl = function(){
		closeDialog();
	}
	
	//关闭弹框
	function closeDialog(){
		$scope.mask = false;
	}
	
	$http.get('/pccms/tpl/pubPageTpl/' + $stateParams.id).success(function(data, status, headers, config) {
		if(data.isSuccess){
			$scope.dat = data.data;
		}else{
			platformModalSvc.showWarmingMessage(nsw.Constant.OPERATION,nsw.Constant.TIP);
	    }
   })
   .error(function(data, status, headers, config) {
   	   platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
   });
	
   //右侧菜单效果图
   $scope.desket = true;
   $scope.clickDesSketch = function(){
	   $scope.frmchat = $scope.design = $scope.source = $scope.tpldes = $scope.used = false;
	   $scope.isShow = true;
	   $scope.desket = true;
   }
   
   //右侧菜单框架图
   $scope.clickFrmChart = function(){
	   $scope.desket = $scope.design = $scope.source = $scope.tpldes = $scope.used = false;
	   $scope.isShow = false;
	   $scope.frmchat = true;
   }
   
   //右侧菜单单页面确认使用
   $scope.clickConfirUse = function(singleTplId){
	   $scope.frmchat = $scope.desket = $scope.design = $scope.source = $scope.tpldes = false;
	   $scope.used = true;
	   /*utils.confirmBox(nsw.Constant.TIP, nsw.Constant.CONFIRMUSE,function(){
		   var data = {"tplId":singleTplId , "nodeId":$stateParams.node, "style":$stateParams.style};
		   $http({
				method: 'POST',
				url: '/pccms/proj/projPageTplPack/pageTpl',
				data: data
			})
		   .success(function(data, status, headers, config) {
		    	if(data.isSuccess){
		    		$state.go('page');
		    	}else{
		    		platformModalSvc.showWarmingMessage(nsw.Constant.OPERATION,nsw.Constant.TIP);
		    	}
		    })
		    .error(function(data, status, headers, config) {
		    	platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
		    });
	    },function(){
		    return; 
	    },'sm');*/
	   platformModalSvc.showWarmingMessage(nsw.Constant.CONFIRMUSE,nsw.Constant.TIP,true).then(function(){
		   var data = {"tplId":singleTplId , "nodeId":$stateParams.node, "style":$stateParams.style};
		   $http({
				method: 'POST',
				url: '/pccms/proj/projPageTplPack/pageTpl',
				data: data
			})
		   .success(function(data, status, headers, config) {
		    	if(data.isSuccess){
		    		$state.go('page');
		    	}else{
		    		platformModalSvc.showWarmingMessage(nsw.Constant.OPERATION,nsw.Constant.TIP);
		    	}
		    })
		    .error(function(data, status, headers, config) {
		    	platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
		    }); 
	   });
   }
   //版块设计
   $scope.blkDesign = function(tplId){
	   $scope.desket = $scope.frmchat = $scope.source = $scope.tpldes = $scope.used = false;
	   $scope.design = true;
	   window.open("/pccms/proj/projPageTpl/"+tplId+"/edit");
   };
   
   var _tplId;
   //编辑公有页面源码
   $scope.editSource = function(tplId){
	   _tplId = tplId;
	   $scope.mask = true;
	   $scope.desket = $scope.frmchat = $scope.design = $scope.tpldes = $scope.used = false;
	   $scope.source = true;
	   $http({
		   method: 'GET',
		   url: '/pccms/tpl/page/load/'+tplId,
		}).success(function(data, status, headers, config) {
	    	if(data.isSuccess){
	    		$scope.name = data.name;
	    		$scope.content = data.htmlContent; 
	    		$scope.res = [];
	    		$scope.res[0] = {};
	    		$scope.res[0].url = data.imgSm;
	    		
	    		$scope.res1 = [];
	    		$scope.res1[0] = {};
	    		$scope.res1[0].url = data.imgMd;
	    		
	    		$scope.res2 = [];
	    		$scope.res2[0] = {};
	    		$scope.res2[0].url = data.imgLg;	
	    		
	    		$scope.res3 = [];
	    		$scope.res3[0] = {};
	    		$scope.res3[0].url = data.imgFr;	 
   		
	    	}else{
	    		platformModalSvc.showWarmingMessage(nsw.Constant.OPERATION,nsw.Constant.TIP);
		    }
	    }).error(function(data, status, headers, config) {
	    	platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
	    });
   }
   
   $scope.saveTpl = function(){
		var obj = {};
		obj.name = $scope.name;
		obj.content = $scope.content;
		obj.designIdea = $scope.designIdea;
		obj.isPubTpl = true;
		if($scope.res) obj.imgSm = $scope.res[0].url || '';
		if($scope.res1) obj.imgMd = $scope.res1[0].url || '';
		if($scope.res2)obj.imgLg = $scope.res2[0].url || ''; 
		if($scope.res2)obj.imgFr = $scope.res3[0].url || ''; 
		saveCode(obj);
	}
   
   function saveCode(_obj){
	   $http({//保存
			method: 'POST',
			url: '/pccms/tpl/page/'+_tplId,
			data: _obj
		}).success(function(data, status, headers, config) {
	    	if(data.isSuccess){
	    		closeDialog();
	    		$state.go('preview',{'id': _tplId});
	    	}else{
	    		platformModalSvc.showWarmingMessage(nsw.Constant.OPERATION,nsw.Constant.TIP);
	    	}
	    }).error(function(data, status, headers, config) {
	    	platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
	    });
   }
   
   //公有页面模板的设计
   $scope.tplDesign = function(tplId){
	   $scope.desket = $scope.frmchat = $scope.source = $scope.design = $scope.used = false;
	   $scope.tpldes = true;
	   window.open('/pccms/pageTpl/design/'+tplId+'/edit?isPubTpl=true');//560b7750aca8101e881e1105
   }
   //取消
   $scope.cancelTpl = function(){
	   closeDialog();
   }
   //关闭弹框
   function closeDialog(){
	   $scope.mask = false;
   }
   //返回
   $scope.clickRet = function(){
	   $state.go('page');   
   }

}]);

//套装页面预览
pageApp.controller('previewPackCtrl', ['$scope','$http','$state','$stateParams','utils','platformModalSvc',function ($scope,$http,$state,$stateParams,utils,platformModalSvc) {
	
	$scope.packId = $stateParams.id;
	$http.get('/pccms/tpl/pubPageTplPack/'+$scope.packId)
	.success(function(data, status, headers, config) {
		console.log(angular.toJson(data.data))
	 	if(data.isSuccess){
	 		$scope.data = data.data;
	 	}else{
	    	platformModalSvc.showWarmingMessage(nsw.Constant.OPERATION,nsw.Constant.TIP);
	    }
	 })
	 .error(function(data, status, headers, config) {
	 	 platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
	 });
   
   //在套装树结构页面中，点击确认使用
   $scope.packUsed = function(packId){
	   /*utils.confirmBox(nsw.Constant.TIP, nsw.Constant.REPLACEOLD,function(){
		   var data = {"packId": packId};
		   $http.post('/pccms/proj/projPageTplPack/',data).success(function(data, status, headers, config) {
		       if(data.isSuccess){
		    	   $state.go('page');
		       }else{
		    	   platformModalSvc.showWarmingMessage(nsw.Constant.OPERATION,nsw.Constant.TIP);
		       }
		 	})
		 	.error(function(data, status, headers, config) {
		 		platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
		 	});	 
	    },function(){
		    return;
	    },'md');*/
	   platformModalSvc.showWarmingMessage(nsw.Constant.REPLACEOLD,nsw.Constant.TIP,true).then(function(){
		   var data = {"packId": packId};
		   $http.post('/pccms/proj/projPageTplPack/',data).success(function(data, status, headers, config) {
		       if(data.isSuccess){
		    	   $state.go('page');
		       }else{
		    	   platformModalSvc.showWarmingMessage(nsw.Constant.OPERATION,nsw.Constant.TIP);
		       }
		 	})
		 	.error(function(data, status, headers, config) {
		 		platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
		 	});
	   });
   }
   //套装树形结构页面返回操作
   $scope.packUsedBack = function(){
	   $state.go('page');
   };
   //树形列表，鼠标移动到缩略图，中图显示
   $scope.mdShowed = function(name){
	   $scope.nodeName = name;
   };
   //树形列表，鼠标移动到缩略图，中图隐藏
   $scope.mdHided = function(name){
	   $scope.nodeName = !name; 
   };
   //树形列表，点击缩略图，进入套装效果图页面
   $scope.singlePage = function(id){
	   $state.go('preview',{'id': id, 'type': 'pack'});
   }
 
}]);


pageApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/');
    $stateProvider.state('page', {
		url: '/',
		templateUrl: 'page.html',
		controller: 'pageCtrl'
	})
	.state('filter', {
		url: '/filter/{type}/{id}/{name}/{pName}/{style}',
		templateUrl: 'filter.html',
		controller: 'filterCtrl'
	})
	.state('preview', {
		url: '/preview/{id}/{node}/{type}/{style}',
		templateUrl: 'preview.html',
		controller: 'previewCtrl'
	})
	.state('previewPack', {
		url: '/previewPack/:id',
		templateUrl: 'previewPack.html',
		controller: 'previewPackCtrl'
	});	
}]);
