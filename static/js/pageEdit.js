var pageEditApp = angular.module('pageEditApp', ['platform','common','ui.nested.combobox'])
//var pageEditApp = angular.module('pageEditApp', ['common','ng.ueditor','ui.bootstrap','ui.bootstrap.pagination','ui.nested.combobox'])

pageEditApp.controller('pageCtrl', ['$scope', '$state','$compile', '$http', 'utils','platformModalSvc', function($scope, $state,$compile, $http, utils,platformModalSvc) {
	$scope.sysBasePath = sysBasePath;
	$scope.projPageData = projPageData;
	
	//弹出区块定制编辑窗口
	$scope.edit = function(projBlkName) {
		$scope.projBlkName = projBlkName;

		platformModalSvc.showModal({
			controller:'blkCtrl',
			templateUrl:sysBasePath + '/partials/pageedit/blkEdit.html',
			size:'lg',
			options:{
				projBlkName:$scope.projBlkName,
				projPageData:$scope.projPageData
			}
		}).then(function(){
			if($(window).resize){
				$(window).resize();
			}
		});
		
		
		//$state.go('blkEdit');
	};
	
	
	
	//源码编辑弹框
	$scope.editSource = function(tplId) {
		$http({
			   method: 'GET',
			   url: sysBasePath + '/tpl/page/load/'+tplId+'/?isPubTpl='+(GetRequest().isPubTpl == 'false'? false :true),
			}).success(function(data, status, headers, config) {
		    	if(data.isSuccess){
		    		//策划思路
		    		$scope.designIdea = data.designIdea;
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
		$state.go('srcCodeEdit',{"id":tplId, "isPubTpl":GetRequest().isPubTpl});
	};
	
	//通过url，获取参数
	   function GetRequest() {   
		   var url = location.search; //获取url中"?"符后的字串   
		  var theRequest = new Object();   
		   if (url.indexOf("?") != -1) {   
		      var str = url.substr(1);   
		      strs = str.split("&");   
		      for(var i = 0; i < strs.length; i ++) {   
		         theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);   
		      }   
		   }   
		   return theRequest;
		};

		
	//备份页面效果
	$scope.backup = function() {
		if($scope.projPageData.bakConf.bak.length >= 1){
			$scope.disabled = true;
		}
		
		$http.put(sysBasePath +'/pageTpl/design/' + $scope.projPageData.id + '/bak?isPubTpl='+$scope.projPageData.isPubTpl)
		.success(function(data, status, headers, config) {
	    	if(data.isSuccess){
	    		//操作成功！
	    		$scope.projPageData.bakConf.bak.push(data.data);
	    	}else{
			    platformModalSvc.showWarmingMessage(nsw.Constant.OPERATION,nsw.Constant.TIP);
	    	}
	    })
	    .error(function() {
		    platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
	    });
	};
	
	//删除页面效果备份
	$scope.delBackup = function(idx,bakId) {
		$http({
			method: 'DELETE',
			url:sysBasePath + '/pageTpl/design/' + $scope.projPageData.id + '/bak',
			params: {'bakId': bakId}
		}).success(function(data) {
	    	if(data.isSuccess){
	    		$scope.projPageData.bakConf.bak.splice(idx, 1);
	    		$scope.disabled = false;
	    	}else{
			    platformModalSvc.showWarmingMessage(nsw.Constant.DATAFAILURE + data.data,nsw.Constant.TIP);
	    	}
	    }).error(function() {
			platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
	    });
	};
	
	//项目页面对比效果
	$scope.compare = function(){
		if('same' == $scope.projPageData.bakConf.type){
			var bak = $scope.projPageData.bakConf.bak;
			var url =sysBasePath + '/pageTpl/design/' + $scope.projPageData.id + '/sameCompare/'+bak[0]+'/'+bak[1]+'?isPubTpl='+$scope.projPageData.isPubTpl;
			window.open (url, '_blank');
		}else{
			var bak = $scope.projPageData.bakConf.bak;
			window.open (sysBasePath +'/pageTpl/design/' + $scope.projPageData.id + '/wideCompare/'+bak[0]+'?isPubTpl='+$scope.projPageData.isPubTpl, '_blank');
			window.open (sysBasePath +'/pageTpl/design/' + $scope.projPageData.id + '/wideCompare/'+bak[1]+'?isPubTpl='+$scope.projPageData.isPubTpl, '_blank');
		}
	}
	   
	//保存页面设计
	$scope.savePageDesign = function(){
		$http.post(sysBasePath +'/pageTpl/design/' + $scope.projPageData.id + '?isPubTpl='+$scope.projPageData.isPubTpl)
		.success(function(data, status, headers, config) {
	    	if(data.isSuccess){
	    		//操作成功！
				//utils.alertBox(nsw.Constant.TIP, nsw.Constant.SAVESUC);
			    platformModalSvc.showWarmingMessage(nsw.Constant.SAVESUC,nsw.Constant.TIP);
	    		closeWebPage();
	    		$state.go('pageCtrl');
	    	}else{
	    		//utils.alertBox(nsw.Constant.TIP, nsw.Constant.OPERATION);
			    platformModalSvc.showWarmingMessage(nsw.Constant.OPERATION,nsw.Constant.TIP);
	    	}
	    })
	    .error(function(data, status, headers, config) {
	    	//utils.alertBox(nsw.Constant.TIP, nsw.Constant.NETWORK);
		    platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
	    });
	}
	//退出页面设计
	$scope.outPageDesign = function(){
		$http({
			method: 'DELETE',
			url: sysBasePath +'/pageTpl/design/' + $scope.projPageData.id + '/compareExit'
		}).success(function(data, status, headers, config) {
	    	if(data.isSuccess){
	    		closeWebPage();
	    	}else{
	    		//utils.alertBox(nsw.Constant.TIP, nsw.Constant.DATAFAILURE + data.data);
			    platformModalSvc.showWarmingMessage(nsw.Constant.DATAFAILURE + data.data,nsw.Constant.TIP);
	    	}
	    }).error(function(data, status, headers, config) {
	    	//utils.alertBox(nsw.Constant.TIP, nsw.Constant.NETWORK);
			platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
	    });
	}
	
	function closeWebPage(){
		if (navigator.userAgent.indexOf("MSIE") > 0) {
			if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
				window.opener = null;
				window.close();
			} else {
				window.open('', '_top');
				window.top.close();
			}
		}else if(navigator.userAgent.indexOf("Firefox") > 0) {
			window.location.href = 'about:blank ';
		} else {
			window.opener = null;
			window.open('', '_self', '');
			window.close();
		}
	}

	if(parent && parent.isPhone) {
		$scope.edit = function (projBlkName) {
			parent.template.edit(projBlkName, $scope.projPageData);
			if($(window).resize){
				$(window).resize();
			}
		}

		angular.element('.c-edit-toolbar.nsw').css('display','none');

		parent.template.initEnv({
			sysBasePath: sysBasePath,
			projPageData: projPageData
		});
		$scope.backup = parent.template.backup;
		$scope.delBackup = parent.template.delBackup;
		$scope.compare = parent.template.compare;
		$scope.savePageDesign = parent.template.savePageDesign;
		$scope.outPageDesign = parent.template.outPageDesign;

		window.updateTemplate = function updateTemplate(selector, template) {
			$(selector).replaceWith($compile(template)($scope));
			if ($scope.$$phase) {
				$scope.$digest();
			}
		};
	}
}]);



pageEditApp.controller('blkCtrl', ['$scope', '$state', '$http','$animate','utils','$compile', function($scope, $state, $http, $animate, utils,$compile) {
	$scope.sysBasePath =sysBasePath;
	$scope.img={};
	$scope.img.sm=[];
	$scope.isEmpty = function (value) {
		  return (Array.isArray(value) && value.length === 0) 
		      || (Object.prototype.isPrototypeOf(value) && Object.keys(value).length === 0);
	}
	
	//过滤页面状态
	if(!$scope.modalOptions.projBlkName){
		$state.go('page');
		return;
	}
	//var projBlkTplTemp = {};
	
	//加载当前基本信息
	$http.get(sysBasePath + '/pageTpl/design/'+$scope.modalOptions.projPageData.id+'/blkTpl/'+$scope.modalOptions.projBlkName+'?isPubTpl='+ $scope.modalOptions.projPageData.isPubTpl)
	.success(function(data) {	

		
		//根据ctgId获取树结构中对应的CtgBean
		$scope.getSelecterCtgInModuleCtgs = function (moduleCtgs, ctgId) {
			var res = {};
			for(var key in moduleCtgs){
				var item = moduleCtgs[key];

				if(ctgId == item._id){
					return item;
				}
				
				res = $scope.getSelecterCtgInModuleCtgs(item.children, ctgId);
				if(Object.keys(res).length != 0){
					return res;
				}
			};
			return {};
		};
		
    	if(data.isSuccess){    	
    		//获取板块类型列表数据
    		if(data.data.isblkTypeEnumList){
    			return ;
    		}
    		//模板、数据源、选项、源码
    		$scope.projBlkTpl = data.data.projBlkTpl;
    	//	$scope.sourceData = data.data.projBlkTpl;
    	//	projBlkTplTemp = data.data.projBlkTpl;
    		$scope.projBlkTplList = data.data.projBlkTplList;
    		$scope.blkTplConfData = data.data.blkTplConfData;
    		$scope.conf = {};
    		
    		angular.forEach($scope.projBlkTpl.confData, function(conf){
    			$scope.conf[conf.name] = conf.value;
    		});
            
    		//$scope.projBlkTpl.conf = $scope.conf;
    		
//    		$scope.projBlkTpl.confData =  $scope.projBlkTpl.confData||[];
//    		$scope.projBlkTpl.confData.push({});
//    		$scope.projBlkTpl.confData.push({});
   		 	
    		//模板(key、value)
    		$scope.pubBlkTpls = data.data.pubBlkTpls;
    		//数据源填充
    		$scope.tplDs = data.data.tplDs;
    		//模块下的分类
    		$scope.moduleCtgs = data.data.moduleCtgs;
    		//利用moduleCtgs内容初始化ctgId为一个对象，如匹配不到则为{}
    		$scope.projBlkTpl.ctgId = $scope.getSelecterCtgInModuleCtgs($scope.moduleCtgs, $scope.projBlkTpl.ctgId);
    		
    		//扩展模块清单
    		$scope.extendModules = data.data.extendModules;
    		
    		//控制分类下拉是否显示
    		$scope.isShowCtgSelecter = false;
    		$scope.isShowModuleSelecter = false;
    		$scope.isShowCtgBtn = false;
    		
    		if('INFO'==$scope.projBlkTpl.type ){
    			$scope.isShowCtgBtn = true;
    			if(!$scope.isEmpty($scope.projBlkTpl.ctgId)){//资讯有ctg,module可选
    				$scope.isShowCtgBtn = false;
    				$scope.isShowCtgSelecter = true;
    				$scope.isShowModuleSelecter = true;
    			}
    		}else if('PRODUCT'==$scope.projBlkTpl.type ){
    			$scope.isShowCtgBtn = true;
    			if(!$scope.isEmpty($scope.projBlkTpl.ctgId)){//产品有ctg可选
    				$scope.isShowCtgBtn = false;
    				$scope.isShowCtgSelecter = true;
    			}
    		}else if('LEFT_NAV'==$scope.projBlkTpl.type || 'SHOP_NAV'==$scope.projBlkTpl.type ){//导航有module可选
    			$scope.isShowCtgBtn = true;
    			if(undefined!=$scope.projBlkTpl.moduleId && null!=$scope.projBlkTpl.moduleId  && ""!=$scope.projBlkTpl.moduleId ){
    				$scope.isShowCtgBtn = false;
    				$scope.isShowModuleSelecter = true;
    			}
    		}
    		
    		
    		
    		$scope.moduleChanged = function () {
    			var url = sysBasePath +'/proj/infoCtg/tree/all?moduleId='+$scope.projBlkTpl.moduleId
    			if("PRODUCT" == $scope.projBlkTpl.type){
    				url = sysBasePath +'/productCtg/tree/all'
    			}
    			
    	        $http.get(url)
    			.success(function(data, status, headers, config) {
    				if (data.isSuccess) {
    					$scope.moduleCtgs = data.data;
    					$scope.projBlkTpl.ctgId = {};
    				} else {
    					console.log('操作失败。' + data.data);
    				}
    			})
    			.error(function(data, status, headers, config) {
    				console.log('系统异常或网络不给力！');
    			});
    	    };
    	    
    	    $scope.changeCtgSelecterFlag = function () {
    	    	if('INFO'==$scope.projBlkTpl.type ){//资讯有ctg,module可选
    	    		$scope.isShowCtgBtn = !$scope.isShowCtgBtn;
    	    		$scope.isShowCtgSelecter = !$scope.isShowCtgSelecter;
            		$scope.isShowModuleSelecter = !$scope.isShowModuleSelecter;
        		}else if('PRODUCT'==$scope.projBlkTpl.type ){//产品有ctg可选
        			$scope.isShowCtgBtn = !$scope.isShowCtgBtn;
        			$scope.isShowCtgSelecter = !$scope.isShowCtgSelecter;
        		}else if('LEFT_NAV'==$scope.projBlkTpl.type || 'SHOP_NAV'==$scope.projBlkTpl.type ){//导航有module可选
        			$scope.isShowCtgBtn = !$scope.isShowCtgBtn;
            		$scope.isShowModuleSelecter = !$scope.isShowModuleSelecter;
        		}
    	    	
    	    };

    		
    		//源码图片
    		
    	    if($scope.conf.blkIcon){
    	    	$scope.img.sm[0] = {"url":$scope.conf.blkIcon};	
    	    } 
    		 

    	    $scope.$watch("img.sm",function(newvalue,oldvale,scope){
    	    	//$scope.projBlkTpl.imgSm = newvalue.path;
		        if(newvalue[0].url){
			        $scope.conf.blkIcon = newvalue[0].url;
			        console.log(newvalue[0].url);
		        }
    	    })
//    		for(var key in $scope.pubBlkTpls){
//    			var item = $scope.pubBlkTpls[key];
//    			if($scope.projBlkTpl._id == item._id){
//    				item.imgSm = data.data.projBlkTpl.imgSm;
//    			}
//    		};
    		
    		/*if($scope.projBlkTpl.tplDs.label == undefined){
    			$scope.noSrcDataTip = true;//没有相应的数据源提示
    			$scope.noSrcData = false;
    		}else{
    			$scope.noSrcDataTip = false;
    			$scope.noSrcData = true;
    		}
    		if($scope.pubBlkTpls.key == undefined){
    			$scope.noData = true;//没有相应的模板数据提示
    		}else{
    			$scope.noData = false;
    		}*/
    	}else{
		    platformModalSvc.showWarmingMessage(nsw.Constant.DATAFAILURE,nsw.Constant.TIP);
    	}
    }).error(function(data, status, headers, config) {
		platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
    });
	
	$scope.save = function() {
		 
		//将ctgId从结构抽取为string
		if(undefined == $scope.projBlkTpl.ctgId || null == $scope.projBlkTpl.ctgId){
			$scope.projBlkTpl.ctgId = "";
		}else{
			$scope.projBlkTpl.ctgId = $scope.projBlkTpl.ctgId._id;
		}
		//这里当我修改表单数据的时候 $scope.conf的value int 被转成了string???
		$scope.projBlkTpl.conf = $scope.conf;
		var projBlkName = $scope.modalOptions.projBlkName;
		var url = sysBasePath + '/pageTpl/design/'+$scope.modalOptions.projPageData.id+'/blkTpl/'+$scope.modalOptions.projBlkName+'?isPubTpl='+ $scope.modalOptions.projPageData.isPubTpl;
		var obj = {};
		    obj = $scope.projBlkTpl; 
		   //obj.imgSm = angular.element(event.target).parents('.c-popup').find('#imgSmall').attr('src');
		$http.put(url, obj)
		.success(function(data, status, headers, config) {
	    	if(data.isSuccess){
	    		//保存成功
	    		$("[nsw\\:blkname='"+projBlkName+"']").replaceWith($compile(data.data)(angular.element('body').scope()));
				//$state.go('page');
			    $scope.closeModal(true);
	    	}else{
			    platformModalSvc.showWarmingMessage(nsw.Constant.OPERATION,nsw.Constant.TIP);
	    	}
	    })
	    .error(function(data, status, headers, config) {
		    platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
	    });
	};

	$scope.cancel = function() {
		$scope.closeModal(false);
	};
    
	//切换选中模板
	$scope.tplSelected = function(blk){
		var blkId = blk._id;
		if(blkId && blkId === $scope.projBlkTpl._id){
			return;
		}
		
		
		
		 
		//构造需要提交的板块信息projBlkTplTemp 与 blk 进行对比  ,向blk中覆盖projBlkTplTemp中的数据
		
		angular.forEach(blk.confData, function(conf){
			if(conf.name === 'blkIcon'){
				$scope.conf[conf.name] = conf.value;
			}			
 		}); 
		
		if($scope.conf.blkIcon){
	    	$scope.img.sm[0] = {"url":$scope.conf.blkIcon};	
	    }else{
	    	$scope.img={};
	    	$scope.img.sm=[];
	    } 
		if($scope.projBlkTpl.moduleId){
			blk.moduleId = $scope.projBlkTpl.moduleId;
		}
		
		if($scope.projBlkTpl.ctgId){
			blk.ctgId = $scope.projBlkTpl.ctgId;
		}
		if($scope.projBlkTpl.tplDs){
			blk.tplDs = $scope.projBlkTpl.tplDs;
		}
		
//		$scope.projBlkTpl._id = blkId;
//		$scope.projBlkTpl.imgSm = blk.imgSm;
//		$scope.projBlkTpl.htmlContent=blk.htmlContent;
		
		$scope.projBlkTpl = blk;
		
		/*var oldBlkTpl = $scope.projBlkTpl;
		
		if(oldBlkTpl.confData){
			$scope.conf = {};
    		 angular.forEach(oldBlkTpl.confData, function(conf){
    		 	$scope.conf[conf.name] = conf.value;
    		 });
    		 blk.conf = $scope.conf;
		}

		//
		if(oldBlkTpl.moduleId){
			blk.moduleId = oldBlkTpl.moduleId;
		}
		
		if(oldBlkTpl.ctgId){
			blk.ctgId = oldBlkTpl.ctgId;
		}
		if(oldBlkTpl.tplDs){
			blk.tplDs = oldBlkTpl.tplDs;
		}
		*/
//		//构造需要提交的板块信息projBlkTplTemp 与 blk 进行对比  ,向blk中覆盖projBlkTplTemp中的数据
//		var projBlkTpl = {};
//		if(projBlkTpl.confData){
//			
//			for(var key in projBlkTpl.confData){
//    			var item = projBlkTpl.confData[key];
//    			for(var key in projBlkTplTemp.confData){
//    				var itemTemp = projBlkTplTemp.confData[key];
//    				if(item.name == itemTemp.name){
//    					itemTemp.value = item.value;
//    				}
//    			}
//    		}
//			
//    		 angular.forEach($scope.projBlkTpl.confData, function(conf){
//    		 	$scope.conf[conf.name] = conf.value;
//    		 });
//		}
//		
//		
//		if(projBlkTpl.moduleId){
//			projBlkTplTemp.moduleId = projBlkTpl.moduleId;
//		}
//		
//		if(projBlkTpl.ctgId){
//			projBlkTplTemp.ctgId = projBlkTpl.ctgId;
//		}
//		if(projBlkTpl.tplDs){
//			projBlkTplTemp.tplDs = projBlkTpl.tplDs;
//		}
//		
//		if(projBlkTplTemp.moduleId){
//			blk.moduleId = projBlkTplTemp.moduleId;
//		}
//		
//		if(projBlkTplTemp.ctgId){
//			blk.ctgId = projBlkTplTemp.ctgId;
//		}
//		if(projBlkTplTemp.tplDs){
//			blk.tplDs = projBlkTplTemp.tplDs;
//		}
//		
//		if(projBlkTplTemp.confData){
////			blk.confData = projBlkTplTemp.confData;
//			
//			for(var key in projBlkTplTemp.confData){
//    			var itemTemp = projBlkTplTemp.confData[key];
//    			for(var key in blk.confData){
//    				var item = blk.confData[key];
//    				if(item.name == itemTemp.name){
//    					item.value = itemTemp.value;
//    				}
//    			}
//    		}
//			
//			
//			
//			for(var key in blk.confData){
//				var item = blk.confData[key];
//				var flag = false;
//				for(var key in projBlkTplTemp.confData){
//					//projBlkTplTemp找不到item则添加item
//					var itemTemp = projBlkTplTemp.confData[key];
//					if(item.name == itemTemp.name){
//						flag = true;
//						break;
//					}
//				}
//				
//				if(!flag){
//					projBlkTplTemp.confData.push(item);
//				}
//			}
//		}
		
		
//		blk.confData = blk.confData||[];
//		blk.confData.push({});
//		blk.confData.push({});
		
		//$scope.projBlkTpl = blk;
		//$scope.projBlkTpl.pubTplId = blkId;
	//	if(isPubBlkTpl){
	//		$scope.projBlkTpl.pubTplId = blkId;
	//	}else if($scope.projBlkTpl.hasOwnProperty('pubTplId')){
	//		delete $scope.projBlkTpl.pubTplId;
	//	}
//		console.info(blk);
//		console.info(projBlkTplTemp);
//		$scope.projBlkTpl.tplDs = blk.tplDs;
//		$scope.projBlkTpl.confData = blk.confData;
//		$scope.projBlkTpl.htmlContent = blk.htmlContent;
	};
	
	
	   
}]);


pageEditApp.controller('blkSelectCtrl',['$scope',function($scope){
	
}]);

pageEditApp.controller('editSrcCtrl', ['$scope', '$state', '$http','$stateParams','utils', function($scope, $state, $http, $stateParams,utils) {
    $scope.saveTpl = function(){
	    var obj = {};
		obj.name = $scope.name;
		obj.content = $scope.content;
		//策划思路
		obj.designIdea = $scope.designIdea;
		obj.isPubTpl = ($stateParams.isPubTpl == 'false'? false :true);
		if($scope.res){
			obj.imgSm = $scope.res[0].url || '';
		} 
		if($scope.res1){
			obj.imgMd = $scope.res1[0].url || '';
		} 
		if($scope.res2){
			obj.imgLg = $scope.res2[0].url || '';
		} 
		if($scope.res2){
			obj.imgFr = $scope.res3[0].url || '';
		}
		saveCode(obj);
	}
   
   function saveCode(_obj){
	   $http({//保存
           method: 'POST',
           url: sysBasePath + '/tpl/page/'+$stateParams.id,
		   data: _obj
	   }).success(function(data, status, headers, config) {
	       if(data.isSuccess){
	    		$scope.cancel();
	    		location.reload();
	    	}else{
		       platformModalSvc.showWarmingMessage(nsw.Constant.OPERATION,nsw.Constant.TIP);
	    	}
	    }).error(function(data, status, headers, config) {
		   platformModalSvc.showWarmingMessage(nsw.Constant.NETWORK,nsw.Constant.TIP);
	    });
   };
   $scope.cancel = function() {
	   $state.go('page');
   };
	   
}]);

pageEditApp.config(['$stateProvider', '$urlRouterProvider', '$sceProvider', function ($stateProvider, $urlRouterProvider, $sceProvider) {
	//设置html序列化不过滤style属性
	$sceProvider.enabled(false);
	$urlRouterProvider.otherwise('/');
    $stateProvider.state('page', {
		url: '/',
		views: {
			'blkEdit': {
				template: ''
			}
		}
	}).state('blkEdit', {
		url: '/blkEdit',
		views: {
			'blkEdit': {
				templateUrl: sysBasePath + '/partials/pageedit/blkEdit.html',
				controller: 'blkCtrl'
			}
		}
	}).state('srcCodeEdit', {
		url: '/srcCodeEdit/{id}/{isPubTpl}',
		views: {
			'blkEdit': {
				templateUrl: sysBasePath + '/partials/pageedit/srcCodeEdit.html',
				controller: 'editSrcCtrl'
			}
		}
	});
}]);


/*
 * 20151031 解决模板编辑页面在加入div.tpl-blk 后出现的页面混乱问题
 * author：yaoyunchou
 * 
 * 
 * 
 */
function tofix(){
	try
	{
		$(".tpl-blk,.tpl-blk *").css("box-sizing","content-box");
		console.log($(".tpl-blk").css("width"));
		$(".tpl-blk").each(function(){
			$(this).css("padding","0px").css("margin","0px");
			if($(this).width()+parseInt($(this).css("padding-left"))+parseInt($(this).css("padding-right"))+2==$(this).parent().width()){
				$(this).css("width",(($(this).width()+parseInt($(this).css("padding-left"))+parseInt($(this).css("padding-right")))-2)+"px");
				
			}
			
			;
		})
		$(".tpl-blk .ng-binding").each(function(){
			
				 if($(this).children().length>1){
			    	  console.log($(this).children()[0]);
			    }else{
			    		$(this).parent().addClass($(this).children()[0].className);
			    }
			
		  
		   
		})
	}
	catch (e)
	{
	   
	} 
}
setTimeout(function(){
	tofix();
},1000)


