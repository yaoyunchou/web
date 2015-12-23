var infoApp = angular.module('infoApp', ['ui.tree','common','ng.ueditor','ui.bootstrap','ui.bootstrap.pagination','ui.nested.combobox']);

//文章列表。
infoApp.controller('listCtrl', ['$scope', '$http', '$state',  'utils', '$stateParams','$location',function($scope, $http, $state, utils, $stateParams,$location) {
	
	
	//$scope.name = $stateParams.name;
	//$scope.moduleId = $stateParams.moduleId;

	$scope.totalItems = 0; //总条数
    $scope.currentPage = 1; //当前页，默认第一页
    $scope.pageSize = 10; //每页显示多少条  	
    $scope.maxSize = 5; //设置分页条的长度。


    $scope.advanced = {};


	$scope.editForm = false;
	$scope.advancedSearch = false;
	$scope.classifiForm = false;
	$scope.mask = false;

	//高级搜索。
	$scope.advancedBtn = function() {
		$scope.advancedSearch ? $scope.advancedSearch = false : $scope.advancedSearch = true;
		//下拉树
		$scope.activeItemAdvanced = {
	    };	
		$http.get('/pccms/proj/infoCtg/tree/all')
			.success(function(data, status, headers, config) {				
				if (data.isSuccess) {
					$scope.collectionAdvanced = data.data;					
				} else {
					alert('操作失败。' + data.data);
				}
			})
			.error(function(data, status, headers, config) {
				alert('系统异常或网络不给力！');
			});
	};	
	
	//高级搜索查询。
	$scope.advancedSearchList = function(){		
		var obj = setAdvancedParam();
		getInfoArticleList(obj);

	};

	//勾选
	$scope.checkAll = function(){
		$scope.isCheckAll = !$scope.isCheckAll;
		for(var key in $scope.dataList){
			var item = $scope.dataList[key];
			item.isChecked = $scope.isCheckAll;
		}
	};
	
	//全选
	$scope.check = function(dataList){
		var arr = [];
		$scope.isCheckAll = true;
		for(var key in $scope.dataList){
			var item = $scope.dataList[key];
				item.isChecked = true;
				arr.push(item._id);
		}
	};
	
	//反选
	$scope.fanCheck = function(dataList){
		var arr = [];
		$scope.isCheckAll = false;
		for(var key in $scope.dataList){
			var item = $scope.dataList[key];
			if(item.isChecked){
				item.isChecked = false;
			}else{
				item.isChecked = true;
				arr.push(item._id);
			}
		}
		if(arr.length != dataList.length){
			$scope.isCheckAll = false;
		}else{
			$scope.isCheckAll = true;
		}
	};
	
	//单行选中
	$scope.checkItem = function(item){
		item.isChecked = !item.isChecked;
		$scope.isCheckAll = checkAllList();
	};

	//检查是否全选
	function checkAllList(){
		var flag = true;
		if($scope.dataList.length == 0){
			flag = false;
		}else{
			for(var key in $scope.dataList){
				var item = $scope.dataList[key];
				if(!item.isChecked){
					flag = false;
					break;
				}
			}
		}
		return flag;
	};
	
	//批量删除
	$scope.deleteBatch = function(){
		var idArr = [];
		for(var key in $scope.dataList){
			var item = $scope.dataList[key];
			if(item.isChecked){
				idArr.push(item._id);
			}
		}
		$scope.delInfoArticle(idArr.join(','));
	};
	
	//关闭弹框
	$scope.closeClassifiForm = function(){
		$scope.classifiForm = $scope.mask = false;
	};
	
	//转移分类
	$scope.classification = function() {
		$scope.classifiForm = true;
		$scope.mask = true;

		//加载下拉树。				
		$scope.activeItemTransfer = {};
		$http.get('/pccms/proj/infoCtg/tree/all')
			.success(function(data, status, headers, config) {
				if (data.isSuccess) {
					$scope.collectionTransfer = data.data;
				} else {
					alert('操作失败。' + data.data);
				}
			})
			.error(function(data, status, headers, config) {
				alert('系统异常或网络不给力！');
			});

		$scope.newDataList = [];
		for (var k in $scope.dataList) {
			if ($scope.dataList[k].isChecked) {
				$scope.newDataList.push($scope.dataList[k]);
			}
		}
	};
    
	function isEmptyObject(o) {
		var flag = false;
		for (var k in o) {
			flag = true;
		}
		return flag;
	};
	
	//分类转移。
	$scope.transfer = function() {
		console.log(JSON.stringify($scope.activeItemTransfer));
		var arr = [];
		for (var k in $scope.newDataList) {
			if ($scope.newDataList[k].isChecked) {
				arr.push($scope.newDataList[k]._id);
			}
		}

		var obj = {};
		if (arr && arr.length > 0) obj.ids = arr.join(',');
		if (isEmptyObject($scope.activeItemTransfer)){
			obj.ctgId = $scope.activeItemTransfer._id;			
		} else{			
			utils.alertBox('操作提示', '请选择要转移的分类名称！');
			return;
		}		
		
		$http({
			method: 'PUT',
			url: '/pccms/proj/infoArticle/list/all',
			data: obj
		}).success(function(data, status, headers, config) {
			if(data.isSuccess){
				$state.go('list',null,{reload:true});
			}
		}).error(function(data, status, headers, config) {
			alert('系统异常或网络不给力！');
		});

	};

	//关键字查询
	$scope.searchInfoArticle = function(){	
		if ($scope.queryParams.title.length > 64) {
			utils.alertBox('操作提示', '关键字查询字符应为0~64个字符');
			$scope.queryParams={'title':''};
			return;
		}
		//获取参数，进行查询操作
		getInfoArticleList(setParam());
	};
	
	//文章列表刷新
	$scope.reloadInfoArticle = function(){
		$scope.currentPage = 1;	
		//清空关键字。
		$scope.queryParams={'title':''};
		//获取参数，进行查询操作
		getInfoArticleList(setParam());
	};

	 //分页查询。
	$scope.pageChanged = function() {
		$scope.advancedSearch ? getInfoArticleList(setAdvancedParam()) : getInfoArticleList(setParam());
	};
	
	//推荐
	$scope.recommend = function(item){
		$scope.item = item;
		$scope.item.isRecommend = !item.isRecommend;
		$http({
			method: 'PUT',
			url: '/pccms/proj/infoArticle/updStatus/'+item._id,
			data: {'isRecommend': $scope.item.isRecommend}
		}).success(function(data, status, headers, config) {
		}).error(function(data, status, headers, config) {
	    	alert('系统异常或网络不给力！');
	    });
	};
	
	//置顶	
    $scope.displayTop = function(item){
    	$scope.item = item;
    	$scope.item.isDisplayTop = !item.isDisplayTop;
		$http({
			method: 'PUT',
			url: '/pccms/proj/infoArticle/updStatus/'+item._id,
			data: {'isDisplayTop': $scope.item.isDisplayTop}
		}).success(function(data, status, headers, config) {
		}).error(function(data, status, headers, config) {
	    	alert('系统异常或网络不给力！');
	    });

	};
    
    //显示
    $scope.display = function(item){
    	$scope.item = item;
    	$scope.item.isDisplay = !item.isDisplay;
		$http({
			method: 'PUT',
			url: '/pccms/proj/infoArticle/updStatus/'+item._id,
			data: {'isDisplay': $scope.item.isDisplay}
		}).success(function(data, status, headers, config) {
		}).error(function(data, status, headers, config) {
	    	alert('系统异常或网络不给力！');
	    });
	};
	
	//删除文章
	$scope.delInfoArticle = function(ids){
		if(!ids){
			utils.alertBox('操作提示', '请选择要放入回收站的条目！');
			return;
		}
		utils.confirmBox('操作提示', '确认放入回收站吗？',function(){
			$http({
				method: 'POST',
				url: '/pccms/recycleBin/addItem',
				data: {'ids': ids,'objName': 'InfoArticle'}
			}).success(function(data, status, headers, config) {
		    	if(data.isSuccess){
		    		var idArr = ids.split(',');
		    		for(var i in idArr){
		    			for(var key in $scope.dataList){
			    			var item = $scope.dataList[key];
			    			if(idArr[i] == item._id){
			    				$scope.dataList.splice(key,1);
			    				break;
			    			}
			    		}
		    		}
		    		$scope.reloadInfoArticle();		    				    		
		    	}else{
		    		alert('获取数据失败：' + data.data);
		    	}
		    }).error(function(data, status, headers, config) {
		    	alert('系统异常或网络不给力！');
		    });
		});
	};

	//编辑
	$scope.editInfo = function(_data){		
		$http.get('/pccms/proj/infoArticle/' + _data._id).success(function(data, status, headers, config) {
			if (data.isSuccess) {				
				$scope.editForm = true;
				$scope.mask = true;	
				
				$scope.editBean = data.data;

				console.log(JSON.stringify(data.data));

				//加载下拉树。				
				$scope.activeItemEdit = {
					_id:data.data.ctgs[0].id,
					name:data.data.ctgs[0].name
			    };	

				$http.get('/pccms/proj/infoCtg/tree/all')
					.success(function(data, status, headers, config) {				
						if (data.isSuccess) {
							$scope.collectionEdit = data.data;					
						} else {
							alert('操作失败。' + data.data);
						}
					})
					.error(function(data, status, headers, config) {
						alert('系统异常或网络不给力！');
					});

				} else {
				alert('操作失败。' + data.data);
			}
		}).error(function(data, status, headers, config) {
			alert('系统异常或网络不给力！');
		});
	};

	//修改。
	$scope.goEdit = function(id){	
		$state.go('edit', {
			'id': id
		});
	};

	//保存。

	$scope.editComfirm = function(){ 
		$scope.bean.ctgs[0].id = $scope.activeItemEdit._id;	
	    $http.put('/pccms/proj/infoArticle/'+$scope.bean._id, $scope.bean)
		    .success(function(data, status, headers, config) {
				if (data.isSuccess) {				
					$scope.editForm = false;
					$scope.mask = false;
					$scope.reloadInfoArticle();
				} else {
					alert('修改失败。' + data.data);
				}
			}).error(function(data, status, headers, config) {
				alert('系统异常或网络不给力！');
			});

	};
	
	$scope.closeForm = function(){		
		$scope.editForm = false;
		$scope.mask = false;
	};	

	//初始化列表数据
	$scope.reloadInfoArticle(setParam());

   //设置参数。(普通搜索)
   function setParam() {
    	var obj = new Object();
	    obj.pageNum = $scope.currentPage;
	    obj.pageSize = $scope.pageSize; 
	    if($location.search()['moduleId']) obj.moduleId = $location.search()['moduleId'];
	    if($scope.queryParams && $scope.queryParams.title){
	    	obj.title = $scope.queryParams.title;
	    }else{
	    	obj.title = '';
	    }
    	return obj;
    };

	 //设置参数(高级搜索)。
	function setAdvancedParam() {
		var obj = new Object();
		obj.pageNum = $scope.currentPage;
		obj.pageSize = $scope.pageSize;			
		if($location.search()['moduleId']) obj.moduleId = $location.search()['moduleId'];
		if ($scope.advanced.title) obj.title = $scope.advanced.title || '';
		
		obj.ctgId = $scope.activeItemAdvanced._id;

		obj.isRecommend = $scope.advanced.isRecommend;

		obj.isDisplayTop = $scope.advanced.isDisplayTop;

		if ($scope.advanced.isDisplay) obj.isDisplay = $scope.advanced.isDisplay;

		return obj;
	};

	//加载列表数据
	function getInfoArticleList(params){
		$http({
			method: 'GET',
			url: '/pccms/proj/infoArticle/list/all',
			params: params
		}).success(function(data, status, headers, config) {

	    	if(data.isSuccess){	    		
	    		if(data.data){
	    			$scope.dataList = data.data.list;
	    			$scope.totalItems = data.data.totalItems;

	    		}else{
	    			$scope.dataList = [];
	    			$scope.totalItems = 0;
            		$scope.currentPage = 1;
	    			alert('暂无数据！');
	    			return;
	    		}
	    	}else{
	    		alert('获取数据失败：' + data.data);
	    	}
	    }).error(function(data, status, headers, config) {
	    	alert('系统异常或网络不给力！');
	    });
	};

}]);



//文章录入。
infoApp.controller('editCtrl', ['$scope', '$http', '$state','$stateParams','commonTool', function($scope, $http, $state,$stateParams,commonTool) {	 
	//init.
	$scope.init = function() {
		$scope.bean={};	
		$scope.bean.seo = {};
		$scope.classify = {};
		
		if($stateParams.moduleId){
			$scope.bean.moduleId = $stateParams.moduleId;
		}
		
		$scope.categoryDialog = false;
		$scope.mask = false;

		$scope.isLinkFlag = false; //是否有外部链接。
		$scope.isThumbnail = false; //是否有缩略图。

		$scope.infoSeo = true;
		$scope.infoOther = true;

		//$scope.bean.displayCreatedTime = commonTool.getLocalTime();

		$scope.configContent = {
			maximumWords: 20000,
			initialFrameHeight: 200,
			toolbars: [
			   			[
						 'fullscreen', 'source', '|', 'undo', 'redo', '|',
						 'bold', 'italic', 'underline', 'fontborder',  '|', 'forecolor', 'backcolor',  '|',
						 'fontfamily', 'fontsize', '|',
						 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
						 'link'
						]
			        ]
		};
		$scope.configDesc = {
			maximumWords: 300,
			initialFrameHeight: 200,
			toolbars: [
			   			[
						 'fullscreen', 'source', '|', 'undo', 'redo', '|',
						 'bold', 'italic', 'underline', 'fontborder',  '|', 'forecolor', 'backcolor',  '|',
						 'fontfamily', 'fontsize', '|',
						 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
						 'link'
						]
			        ]
		};
		$scope.configSeoDesc = {
			maximumWords: 150,
			initialFrameHeight: 200,
			toolbars: [
			   			[
						 'fullscreen', 'source', '|', 'undo', 'redo', '|',
						 'bold', 'italic', 'underline', 'fontborder',  '|', 'forecolor', 'backcolor',  '|',
						 'fontfamily', 'fontsize', '|',
						 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
						 'link'
						]
			        ]
		};

		//加载下拉树。
		$scope.classify.activeItemBean = {};
		$http.get('/pccms/proj/infoCtg/tree/all')
			.success(function(data, status, headers, config) {
				if (data.isSuccess) {
					$scope.collectionBean = data.data;
				} else {
					alert('操作失败。' + data.data);
				}
			})
			.error(function(data, status, headers, config) {
				alert('系统异常或网络不给力！');
			});
	};
		
	//验证网页访问地址是否重复
	$scope.verRepeat = function(){
		var id = '';
		if($scope.bean._id){
			id = $scope.bean._id;
		}
		$http({
			method: 'GET',
			url: '/pccms/proj/infoArticle/page',
			params: {'staticPageName': $scope.bean.seo.staticPageName, 'id': id}
		}).success(function(data, status, headers, config) {
			if (data.isSuccess) {
				$scope.bean.seo.staticPageName = data.data;

			} else {
				alert('操作失败。' + data.data);
			}
		}).error(function(data, status, headers, config) {
			alert('系统异常或网络不给力！');
		});
    };
    
	$scope.setNetAddress = function() {
		if($scope.bean.title == '' || $scope.bean.title == null || $scope.bean.title == undefined){
			$scope.bean.seo.staticPageName = '';
		}else{
			$http({
				method: 'GET',
				url: '/pccms/proj/infoArticle/page',
				params: {'staticPageName': codefans_net_CC2PY($scope.bean.title), 'id': ''}
			}).success(function(data, status, headers, config) {
				if (data.isSuccess) {
					if($stateParams.id == undefined){
						$scope.bean.seo.staticPageName = data.data;
					}
				} else {
					alert('操作失败。' + data.data);
				}
			}).error(function(data, status, headers, config) {
				alert('系统异常或网络不给力！');
			});

		}
	};

	if ($stateParams.id) {

		//$scope.beanStatus = $stateParams.name + '修改';
		$http.get('/pccms/proj/infoArticle/' + $stateParams.id)
			.success(function(data, status, headers, config) {
				if (data.isSuccess) {
					
					//console.log(JSON.stringify(data.data));
					$scope.bean = data.data;

					console.log(data.data.imgSm.url);

					//图片。
					$scope.img = {};
					$scope.img.thumbnail = [];
					$scope.img.thumbnail[0] = {};
					$scope.img.thumbnail[0].path = data.data.imgSm.url;

					//关联标签写死。
					$scope.bean.tags = null;
					$scope.classify.activeItemBean = {
						_id: data.data.ctgs[0].id,
						name: data.data.ctgs[0].name
					};
				} else {
					alert('操作失败。' + data.data);
				}
			}).error(function(data, status, headers, config) {
				alert('系统异常或网络不给力！');
			});

	} else {
		//$scope.beanStatus = $stateParams.name + '录入';
		$scope.bean = {};
	}

	$scope.keyWordErr = false;
	$scope.keyWordInvalid = false;

	$scope.$watch('bean.seo.keyword', function(newOptions, oldOptions) {			
					
		(newOptions && (newOptions.split(',').length > 5 ||
			newOptions.split(' ').length > 5 ||
			newOptions.split('|').length > 5)) ?
		($scope.keyWordErr = true, $scope.keyWordInvalid = true) :
		($scope.keyWordErr = false, $scope.keyWordInvalid = false);
		
	}, true);	

	//提交操作。(文章录入)
	$scope.saveAirticle = function() {	
		
		$scope.bean.ctgs = [];
		
		$scope.bean.ctgs[0] = {
			id: $scope.classify.activeItemBean._id,
			name: $scope.classify.activeItemBean.name
		}			
		
		$scope.bean.imgSm = {
			url:$('#thumbnail').attr('src'),
			alt:''
		}

		// alert(JSON.stringify($scope.bean));
		if ($stateParams.id) { //修改。			

			$http.put('/pccms/proj/infoArticle/' + $stateParams.id, $scope.bean)
				.success(function(data, status, headers, config) {
					if (data.isSuccess) {						
						$state.go('list');
					} else {
						alert('文章修改失败。' + data.data);
					}
				})
				.error(function(data, status, headers, config) {
					alert('系统异常或网络不给力！');
				});
		} else { //新增。

			$http.post('/pccms/proj/infoArticle', $scope.bean).success(function(data, status, headers, config) {
				if (data.isSuccess) {					
					$state.go('list');
				} else {
					alert('文章录入失败。' + data.data);
				}
			}).error(function(data, status, headers, config) {
				alert('系统异常或网络不给力！');
			});
		}
	};
	
	$scope.checkInfoArticleStaticPageName = function(){
		alert("验证文章静态页");
	};
	
	$scope.checkCtgStaticPageName = function(){
		alert("验证分类静态页");
	};

	//添加分类
	$scope.addCategory = function(){
		$scope.categoryDialog = true;
		$scope.mask = true;		
		$scope.cTitle = '';
		$scope.cUpper = '';
	};
	//关闭添加分类弹出框
	$scope.closeCategoryDialog = function(){
		$scope.categoryDialog = false;
		$scope.mask = false;
	};

	//快速添加分类
	$scope.saveAddCategory = function(){
		var data = {
			//分类父子索引
			"path": ',5608f167aca810175cbafb73,',
			//静态页目录
			"staticPageDir": "",
			//是否存在外部链接
			"isLink": false,
			//图片规格
			"imgSize": {
				"width": 30,
				"height": 30
			},
			//排序
			"index": 50,
			//是否推荐
			"isRecommend": false,
			//是否置顶
			"isDisplayTop": false,
			//是否是精华
			"isEssence": false,
			//是否显示当前资讯
			"isDisplay": true,
			//列表页显示条数
			"listPageSize": 20,
			//分类名称
			"name": $scope.cTitle
		}
		$http.post('/pccms/proj/infoCtg', data).success(function(data, status, headers, config) {
				if (data.isSuccess) {					
					alert('成功。');
					$scope.closeCategoryDialog();
				} else {
					alert('失败。' + data.data);
				}
			}).error(function(data, status, headers, config) {
				alert('系统异常或网络不给力！');
			});
	};	

	//清空表单
	$scope.clearFormBtn = function() {
		$state.go('add', null, {
			reload: true
		});		
	};
	
	//存在外部链接
	$scope.hasLink = function(){
		$scope.bean.isLink=true;
		$scope.isLinkFlag = true;
		$scope.infoSeo = false;
		$scope.infoOther = false;
	};

	//没有缩略图
	$scope.hasNotThumbnail = function(){
		$scope.isThumbnail = false; 
	};
	
	//有缩略图。
	$scope.hasThumbnail = function(){
		$scope.isThumbnail = true; 
	};	
}]);

//文章分类列表
infoApp.controller('classifyCtrl',['$scope', '$http', '$state', 'utils','$stateParams', function($scope, $http, $state, utils, $stateParams){
	$scope.name = $stateParams.name;
	$scope.moduleId = $stateParams.moduleId;
	
	//高级
	$scope.advancedSearch = false;
	$scope.queryParams = {'title':''};
	//高级搜索。
	$scope.advancedBtn = function() {
		//高级搜索隐藏、显示
		$scope.advancedSearch ? $scope.advancedSearch = false : $scope.advancedSearch = true;
		
	};
	
	//关闭弹框
	$scope.closeForm = function(){		
		$scope.editForm = $scope.addForm = $scope.mask = false;
	};
	
	//资讯分类快速录入
	$scope.quickAdd = function() {
		$scope.addForm = true;
		$scope.mask = true;

		//加载下拉树。	
		$scope.enter={};			
		$scope.enter.activeItem = {};
		$http.get('/pccms/proj/infoCtg/tree/all?moduleId='+$stateParams.moduleId)
			.success(function(data, status, headers, config) {
				if (data.isSuccess) {
					$scope.collectionEnter = data.data;
				} else {
					alert('操作失败。' + data.data);
				}
			})
			.error(function(data, status, headers, config) {
				alert('系统异常或网络不给力！');
			});
	};

	//快速录入.
	$scope.editComfirm = function(){

		if ($scope.enter.activeItem.path ) {
			$scope.beanEnter.path = $scope.enter.activeItem.path + $scope.enter.activeItem._id + ',';
		} else {
			$scope.beanEnter.path = ',' + $scope.enter.activeItem._id + ',';
		}			

		$http.post('/pccms/proj/infoCtg', $scope.beanEnter)
	    .success(function(data, status, headers, config) {
			if (data.isSuccess) {
				$state.go('classify',null,{reload:true});
			} else {
				alert('修改失败。' + data.data);
			}
		}).error(function(data, status, headers, config) {
			alert('系统异常或网络不给力！');
		});

	};

	$scope.itemTreeChanged = function(){

		console.log($scope.editree.activeItem);

		if($scope.editree.activeItem.path == null){
			path = ','+$scope.editree.activeItem._id+ ',';
		}else{
			path = $scope.editree.activeItem.path + $scope.editree.activeItem._id+ ',';
		}
	};
	
	//资讯分类快速编辑
	$scope.editInfo = function(_data) {
		$http.get('/pccms/proj/infoCtg/' + _data._id).success(function(data, status, headers, config) {
			if (data.isSuccess) {
				$scope.editForm = true;
				$scope.mask = true;

				//默认是没有外部链接。
				$scope.editIsLink = false;				

				$scope.editBean = data.data;

				//加载下拉树。	
				$scope.editree = {};
				$scope.editree.activeItem = {
					_id: data.data.parentCtg.id,
					name: data.data.parentCtg.name
				};				
				$http.get('/pccms/proj/infoCtg/tree/all')
					.success(function(data, status, headers, config) {
						if (data.isSuccess) {
							$scope.collectionEdit = data.data;
						} else {
							alert('操作失败。' + data.data);
						}
					})
					.error(function(data, status, headers, config) {
						alert('系统异常或网络不给力！');
					});

				if (data.data.isLink) {
					//有外部链接。
					$scope.editIsLink = true;
				} else {
					//没有外部链接。
					$scope.editIsLink = false;
				}
			} else {
				alert('操作失败。' + data.data);
			}
		}).error(function(data, status, headers, config) {
			alert('系统异常或网络不给力！');
		});

		var flagSpeedTree = false;
		$scope.itemTreeChanged = function(){
			flagSpeedTree = true;
		};

		//分类快速修改。
		$scope.speedEdit = function() {			

			if (flagSpeedTree) {
				$scope.editree.activeItem.path ?
					$scope.editBean.path = $scope.editree.activeItem.path + $scope.editree.activeItem._id + ',':
					$scope.editBean.path = ',' + $scope.editree.activeItem._id + ',';
			}

			$http({
				method: 'PUT',
				url: '/pccms/proj/infoCtg/' + _data._id,
				data: $scope.editBean
			}).success(function(data, status, headers, config) {
				if(data.isSuccess){
					$state.go('classify',null,{reload:true});
				}else{
					alert(data.data);
				}				
			}).error(function(data, status, headers, config) {
				alert('系统异常或网络不给力！');
			});
		};
	};
	
	//验证网页访问地址是否重复
	$scope.verRepeat = function() {
		$http({
			method: 'GET',
			url: '/pccms/proj/infoCtg/page',
			params: {'staticPageName': $scope.editBean.seo.staticPageName, 'id': ''}
		}).success(function(data, status, headers, config) {
			if (data.isSuccess) {
				if($stateParams.id == undefined){
					$scope.editBean.seo.staticPageName = data.data;
				}
			} else {
				alert('操作失败。' + data.data);
			}
		}).error(function(data, status, headers, config) {
			alert('系统异常或网络不给力！');
		});
	};
	
	//删除前验证文章分类下的数量
	$scope.delInfoCtg = function(id){
		$http({
			method: 'GET',
			url: '/pccms/proj/infoCtg/infoArticle',
			params: {'ids': id}
		}).success(function(data, status, headers, config){
			if(data.isSuccess){
				utils.confirmBox('提示', data.data, function(){
					deleteCtgs(id);
				});
			}
		}).error(function(data, status, headers, config) {
			alert('系统异常或网络不给力！');
		});
	};
	
	//删除分类
	function deleteCtgs(id){
		$http({
			method: 'DELETE',
			url: '/pccms/proj/infoCtg/list/all',
			params: {'ids': id}
		}).success(function(data, status, headers, config){
			if(data.isSuccess){
				$scope.reloadInfoArticle();
			}else{
				alert(data.data);
			}
			console.info(data);
		}).error(function(data, status, headers, config) {
			alert('系统异常或网络不给力！');
		});
	};
	
	//批量删除前验证文章分类下的数量
	$scope.deleteBatch = function(){
		var idArr = [];
		for(var key in $scope.dataList){
			var item = $scope.dataList[key];
			if(item.isChecked){
				idArr.push(item._id);
			}
		};
		if(!idArr.join(',')){
			utils.alertBox('提示', '请选择需要删除的资讯分类！');
			return;
		}else{
			$scope.delInfoCtg(idArr.join(','));
		};
	};
	
	//文章分类列表刷新
	$scope.reloadInfoArticle = function(){
		$scope.currentPage = 1;
		//清空关键字。
		$scope.queryParams={'title':''};
		//获取参数，进行查询操作、
		getInfoArticleList(setParam());
	};
	
	//推荐
	$scope.recommend = function(item){
		$scope.item = item;
		$scope.item.isRecommend = !item.isRecommend;
		$http({
			method: 'PUT',
			url: '/pccms/proj/infoCtg/updStatus/'+item._id,
			data: {'isRecommend': $scope.item.isRecommend}
		}).success(function(data, status, headers, config) {
		}).error(function(data, status, headers, config) {
	    	alert('系统异常或网络不给力！');
	    });
	};
	
	//置顶	
    $scope.displayTop = function(item){
    	$scope.item = item;
    	$scope.item.isDisplayTop = !item.isDisplayTop;
		$http({
			method: 'PUT',
			url: '/pccms/proj/infoCtg/updStatus/'+item._id,
			data: {'isDisplayTop': $scope.item.isDisplayTop}
		}).success(function(data, status, headers, config) {
		}).error(function(data, status, headers, config) {
	    	alert('系统异常或网络不给力！');
	    });

	};
    
    //显示
    $scope.display = function(item){
    	$scope.item = item;
    	$scope.item.isDisplay = !item.isDisplay;
		$http({
			method: 'PUT',
			url: '/pccms/proj/infoCtg/updStatus/'+item._id,
			data: {'isDisplay': $scope.item.isDisplay}
		}).success(function(data, status, headers, config) {
		}).error(function(data, status, headers, config) {
	    	alert('系统异常或网络不给力！');
	    });
	};
	
	//向上排序
	$scope.arrowUp = function(elem,up){
		$http({
			method: 'PUT',
			url: '/pccms/proj/infoCtg/updIndex',
			data: {'id': elem._id,'path': elem.path, indexType: up }
		}).success(function(data, status, headers, config){
			if(data.isSuccess == false){
				console.log(data.data)
			};
			if(data.isSuccess == true){
				console.log(data.data)
			};			
			getInfoArticleList(setParam());
		}).error(function(data, status, headers, config){
	    	alert('系统异常或网络不给力！');
	    });
	};
	
	//向下排序
	$scope.arrowDown = function(elem,down){
		$http({
			method: 'PUT',
			url: '/pccms/proj/infoCtg/updIndex',
			data: {'id': elem._id,'path': elem.path, indexType: down}
		}).success(function(data, status, headers, config){
			if(data.isSuccess == false){
				console.log(data.data)
			};
			if(data.isSuccess == true){
				console.log(data.data)
			};
			
			getInfoArticleList(setParam());
			
		//	getInfoArticleList();
		}).error(function(data, status, headers, config){
	    	alert('系统异常或网络不给力！');
	    });
	};
	
	//关键字查询
	$scope.searchInfoArticle = function(){
		if ($scope.queryParams.title.length > 64) {
			utils.alertBox('操作提示', '关键字查询字符应为0~64个字符');
			$scope.queryParams={'title':''};
			return;
	    }
		//获取参数，进行查询操作
		getInfoArticleList(setParam());
	};
	
	//高级搜索查询。
	$scope.advancedSearchList = function(){
		var obj = setAdvancedParam();
		getInfoArticleList(obj);
	};

	//检查是否全选
	function checkAllList(){
		var flag = true;
		if($scope.dataList.length == 0){
			flag = false;
		}else{
			for(var key in $scope.dataList){
				var item = $scope.dataList[key];
				if(!item.isChecked){
					flag = false;
					break;
				}
			}
		}
		return flag;
	};
	
	//勾选
	$scope.checkAll = function(){
		$scope.isCheckAll = !$scope.isCheckAll;
		for(var key in $scope.dataList){
			var item = $scope.dataList[key];
			item.isChecked = $scope.isCheckAll;
		}
	};

	//判断相同的checkBox是否是全部选中。
	function checkedStatus(_path) {
		var status = true;
		for (var k in $scope.dataList) {
			if ($scope.dataList[k].path == _path) {
				if (!$scope.dataList[k].isChecked) {
					status = false;
				}			
			}
		}
		return status;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
	};

	//单行选中
	$scope.checkItem = function(item) {
		item.isChecked = !item.isChecked;
		$scope.isCheckAll = checkAllList();
		if (item.isChecked) { //check被选中。
			//父级勾选。
			if(checkedStatus(item.path)){ //checkedStatus(item.path) 用来判断与自己同级的checkBox是否被勾选。
				var pid = item.path.split(',')[item.path.split(',').length-2];
				for(var k in $scope.dataList){
					if ($scope.dataList[k]._id == pid){
						$scope.checkItem($scope.dataList[k]);
						$scope.dataList[k].isChecked = true;
					}					
				}
			}
			//子级
		}else{ //check被取消。

			if(!checkedStatus(item.path)){
				var pid = item.path.split(',')[item.path.split(',').length-2];
				for(var k in $scope.dataList){
					if ($scope.dataList[k]._id == pid){
						$scope.checkItem($scope.dataList[k]);
						$scope.dataList[k].isChecked = false;
					}
					
				}
			}
		}
		//console.log(item);
		//console.log(item.path);
		// var arr = item.path.split(',');
		// if (arr.length == 3) {			
		// 	var _id = item._id;
		// 	for (var k in $scope.dataList) {
		// 		if ($scope.dataList[k].path) {
		// 			var arr = $scope.dataList[k].path.split(',');
		// 		}
		// 		for (var i in arr) {
		// 			if (arr[i] == _id) {
		// 				$scope.dataList[k].isChecked = item.isChecked;
		// 			}
		// 		}
		// 	}
		// }
	};

	//表格折叠树。
	$scope.collapsed = true;
	var _pid = {};	
	$scope.toggleData = function(item,collapsed){			
		if(!collapsed){
			_pid[item._id] = item._id;
		}else{
			_pid[item._id] = -1;
		}          
	};
	
	$scope.showData = function(item){		
		var flag = true;
		for(var k in _pid){
		  if(item.path)	var arr = item.path.split(',');
			for(var i in arr){
				if(arr[i] == _pid[k])  flag = false;
			}
		}
		return flag;
	};

	//加载列表数据
	function getInfoArticleList(params){
		$http({
			method: 'GET',
			url: '/pccms/proj/infoCtg/list/all',
			params: params
		}).success(function(data, status, headers, config) {

	    	if(data.isSuccess){
	    		if(data.data){
	    			$scope.dataList = data.data;
	    		}
	    	}else{
	    		alert('获取数据失败：' + data.data);
	    	}
	    }).error(function(data, status, headers, config) {
	    	alert('系统异常或网络不给力！');
	    });
	};
	
	//init quuery.
	getInfoArticleList(setParam());	
	
	//设置参数(高级搜索)。
	function setAdvancedParam() {
		var obj = new Object();
		if ($scope.advanced) {
			  
			if ($scope.advanced.title){
				obj.title = $scope.advanced.title || ''; //资讯分类名称
			}			
			if($scope.advanced.isRecommend){
				obj.isRecommend = $scope.advanced.isRecommend; //推荐
			}
			if($scope.advanced.isDisplayTop){
				obj.isDisplayTop = $scope.advanced.isDisplayTop; //置顶
			}
			if ($scope.advanced.isDisplay){
				obj.isDisplay = $scope.advanced.isDisplay; //显示、隐藏、不限
			}
			if($scope.moduleId){
				obj.moduleId = $scope.moduleId;
			}
		};
		return obj;
	};	
	
	//设置参数。(普通查询)
	function setParam() {
		var obj = new Object();
		if ($scope.queryParams.title) {
			obj.title = $scope.queryParams.title;
		} else {
			obj.title = '';
		}
		if($scope.moduleId){
			obj.moduleId = $scope.moduleId;
		}
		return obj;
	};
	
}]);


//文章分类录入
infoApp.controller('addClassifyCtrl',['$scope', '$http', '$state', 'utils','$stateParams', function($scope, $http, $state, utils, $stateParams){
	$scope.bean ={};
	if($stateParams.moduleId){
		$scope.bean.moduleId = $stateParams.moduleId;
	}
	$scope.bean.seo = {};
	$scope.infoSeo = true;
	$scope.infoOther = true;
	$scope.faceCheck = true;
	$scope.isLinkFlag = false;
	$scope.isThumbnail = false; //是否有缩略图。

	//上级分类。
	$scope.itemChanged = function() {	

		console.log(JSON.stringify($scope.classify.activeItemBean));

		$scope.bean.path = $scope.classify.activeItemBean.path + $scope.classify.activeItemBean._id;		
		 
		if($scope.classify.activeItemBean.path) {
			$scope.bean.path = $scope.classify.activeItemBean.path + $scope.classify.activeItemBean._id+',';
		}else{			
			$scope.bean.path = ','+ $scope.classify.activeItemBean._id +',';
		}		

	};
    
	$scope.setNetAddress = function() {
		if($scope.bean.name == '' || $scope.bean.name == null || $scope.bean.name == undefined){
			$scope.bean.seo.staticPageName = '';
		}else{
			$http({
				method: 'GET',
				url: '/pccms/proj/infoCtg/page ',
				params: {'staticPageName': codefans_net_CC2PY($scope.bean.name), 'id': ''}
			}).success(function(data, status, headers, config) {
				if (data.isSuccess) {
					$scope.bean.seo.staticPageName = data.data;					
				} else {
					alert('操作失败。' + data.data);
				}
			}).error(function(data, status, headers, config) {
				alert('系统异常或网络不给力！');
			});
		}
	};
	
	//验证网页访问地址是否重复
	$scope.verRepeat = function(){
		$http({
			method: 'GET',
			url: '/pccms/proj/infoCtg/page',
			params: {'staticPageName': $scope.bean.seo.staticPageName, 'id': ''}
		}).success(function(data, status, headers, config) {
			if (data.isSuccess) {
			    $scope.bean.seo.staticPageName = data.data;
			} else {
				alert('操作失败。' + data.data);
			}
		}).error(function(data, status, headers, config) {
			alert('系统异常或网络不给力！');
		});
    };
	
	//加载下拉树。
	$scope.classify ={};
	$scope.classify.activeItemBean = {};
	$http.get('/pccms/proj/infoCtg/tree/all')
		.success(function(data, status, headers, config) {
			if (data.isSuccess) {
				$scope.collectionBean = data.data;
			} else {
				alert('操作失败。' + data.data);
			}
		})
		.error(function(data, status, headers, config) {
			alert('系统异常或网络不给力！');
		});

	//没有缩略图。
	$scope.hasNotThumbnail = function(){
		$scope.isThumbnail = false; 
	};
	
	//有缩略图。
	$scope.hasThumbnail = function(){
		$scope.isThumbnail = true; 
	};
	
	//存在外部链接。
	$scope.hasLink = function(){		
		$scope.isLinkFlag = true;

		$scope.infoSeo = false;
		$scope.infoOther = false;
		$scope.faceCheck = false;
	};

	//获取列表模板
	$http({
			method: 'GET',
			url: '/pccms/proj/projPageTplPack/list/type'			
		}).success(function(data, status, headers, config) {
	    	if(data.isSuccess){	 
	    		if(data.data){
	    			$scope.temp = data.data;
	    		}
	    	}else{
	    		alert('获取数据失败：' + data.data);
	    	}
	    }).error(function(data, status, headers, config) {
	    	alert('系统异常或网络不给力！');
	    });
	
	$scope.bean.pageTpl = [];
	//列表模板选中。
	$scope.listTempOk = {};
	for (var k in $scope.listTempOk) {
		$scope.listTempOk[k] = false;
	}
	$scope.selectListImageOne = function(row) {
		for (var k in $scope.listTempOk) {
			$scope.listTempOk[k] = false;
		}
		$scope.listTempOk[row._id] = true;
		$scope.bean.pageTpl[0] = {
			'id': row._id,
			'type': 'LIST'
		}
	};
	
	//详情模板选中。
	$scope.detailTempOk = {};
	for (var k in $scope.detailTempOk) {
		$scope.detailTempOk[k] = false;
	}
	$scope.selectDetailImageOne = function(row) {
		for (var k in $scope.detailTempOk) {
			$scope.detailTempOk[k] = false;
		}
		$scope.detailTempOk[row._id] = true;
		$scope.bean.pageTpl[1] = {
			'id': row._id,
			'type': 'DETAIL'
		}
	};
	
	//提交保存。
	$scope.saveBean = function() {
		console.log(JSON.stringify($scope.bean));
		$http.post('/pccms/proj/infoCtg', $scope.bean)
			.success(function(data, status, headers, config) {

				if (data.isSuccess) {
					$state.go('classify');
				} else {
					alert('分类录入失败。' + data.data);
				}
			}).error(function(data, status, headers, config) {
				alert('系统异常或网络不给力！');
			});
	};
}]);

angular.module('infoApp').directive('beyond', function() {
	 return {
        restrict : 'ACE',
        replace : true,        
        scope : {
            maxCount : '@maxCount'          
        },
        link : function(scope, element, attrs) {           	
        	element.find('.form-control').bind('keyup',function(){
        		var o = $(this).val();
				if(o.length >0 ){
					element.find('.mess-zx').html(o.length);
				}else{
					element.find('.mess-zx').html(0);
				}
        	});
		}
    }
});
angular.module('infoApp').directive('leftInformation', function() {
	 return {
        restrict : 'ACE',
        replace : true,        
        scope : {},
        link : function(scope, element, attrs) { 
				element.find('button').bind('click',function(){					
				$(this).hide();
				element.find('.left-info').show();
			});        	
		}
    }
});
angular.module('infoApp').directive('selectToggle', function() {
	 return {
        restrict : 'ACE',
        replace : true,        
        scope : {},
        link : function(scope, element, attrs) { 
				element.find('a').bind('click',function(){					
					var o = element.find('.dropdown-menu');						
					if(o.is(":hidden")){
						o.show();
					}else{
						o.hide();
					}
				});     	
		}
    }
});

infoApp.factory('commonTool',function() {
	return {
		getLocalTime: function() {
			var today=new Date();
			var y=today.getFullYear();
			var mh = today.getMonth()+1;
			var d= today.getDate();
			var h=today.getHours();
			var m=today.getMinutes();
			return y+'-'+mh+'-'+d+' '+h+':'+m;
		}
	}
});

//路由配置、
infoApp.config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/list');
		$stateProvider.state('list', { //文章列表。
		//	url: '/list?id&moduleId&name&page',
			url: '/list?moduleId&name&page',
			templateUrl: 'list.html',
			controller: 'listCtrl'
		}).state('add', { //文章录入。
			url: "/add",
			templateUrl: 'edit.html',
//			 url: '/add?moduleId&name&page',
//			 templateProvider: ['$stateParams', '$http', function ($stateParams,$http) {
//			 	return $http
//			         .get('../../module/extend/'+$stateParams.moduleId+'/'+$stateParams.page+'/render/')
//			         .then(function(response) {
//			             return response.data;
//			         });
//			 }],
			controller: 'editCtrl'
		}).state('edit', { //文章修改。
			url: '/edit/:id',
			templateUrl: 'edit.html',
			controller: 'editCtrl'
		}).state('classify', { //分类
			url: '/classify?moduleId&name&page',
			templateUrl: 'classify.html',
			controller: 'classifyCtrl'
		}).state('addClassify', { //分类录入
			url: '/addClassify',
			templateUrl: 'addClassify.html',
//			url: '/addClassify?moduleId&name&page',
//			templateProvider: ['$stateParams', '$http', function ($stateParams,$http) {
//				return $http
//			        .get('../../module/extend/'+$stateParams.moduleId+'/'+$stateParams.page+'/render/')
//			        .then(function(response) {
//			            return response.data;
//			        });
//			}],
			controller: 'addClassifyCtrl'
		});
	}

]);
