//文章分类录入
infoApp.controller('addClassifyCtrl', ['$scope', '$http', '$state', 'utils', '$stateParams','platformModalSvc','commonTool',
    function ($scope, $http, $state, utils, $stateParams,platformModalSvc,commonTool) {
        "use strict";
        $scope.name = $stateParams.name;
        $scope.moduleId = $stateParams.moduleId;
        $scope.bean = {};
        $scope.bean.seo = {};
        $scope.bean.imgSm = {};
        $scope.bean.imgMd = {};

        $scope.bean.seo = {};
        $scope.infoSeo = true;
        $scope.infoOther = true;
        $scope.faceCheck = true;

        $scope.isLinkFlag = false;

        $scope.isThumbnail = false; //是否有缩略图。


        $scope.configDesc = {
            maximumWords: 300,
            initialFrameWidth: '100%',
			initialFrameHeight: 100,
            toolbars: [
                [
                    'fullscreen', 'source', '|', 'undo', 'redo', '|',
                    'bold', 'italic', 'underline', 'fontborder', '|', 'forecolor', 'backcolor', '|',
                    'fontfamily', 'fontsize', '|',
                    'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
                    'link'
                ]
            ]
        };

        //加载下拉树。
        $scope.classify = {};
        $scope.classify.activeItemBean = {};


        //没有缩略图。
        $scope.hasNotThumbnail = function () {
            $scope.isThumbnail = false;
        };
        //有缩略图。
        $scope.hasThumbnail = function () {
            $scope.isThumbnail = true;
        };
        //存在外部链接。
        $scope.hasLink = function () {
            $scope.isLinkFlag = true;

            $scope.infoSeo = false;
            $scope.infoOther = false;
            $scope.faceCheck = false;
        };
        $scope.noLink = function () {
            $scope.isLinkFlag = false;

            $scope.infoSeo = true;
            $scope.infoOther = true;
            $scope.faceCheck = true;
        };


        //修改就去加载表单数据。
        if ($stateParams.id) {
            if ($stateParams.isLink === 'true') {
                $scope.hasLink();
            }

            $http.get('/pccms/proj/infoCtg/' + $stateParams.id)
                .success(function (data, status, headers, config) {
                    if (data.isSuccess) {
                        $scope.bean = data.data;

                        //图片。
                        $scope.img = {};
                        if (data.data.imgSm.url) {
                            $scope.imageExist = true;
                            $scope.isThumbnail = true;
                            $scope.img.thumbnail = [];
                            $scope.img.thumbnail[0] = {};
                            $scope.img.thumbnail[0].url = data.data.imgSm.url;
                        }

                        $scope.classify.activeItemBean = {
                            _id: data.data.parentCtg.id,
                            name: data.data.parentCtg.name
                        };

                        if (data.data.imgMd.url) {
                            $scope.img.lmicon = [];
                            $scope.img.lmicon[0] = {};
                            $scope.img.lmicon[0].url = data.data.imgMd.url;
                        }
                        try {
                            if (data.data.pageTpl[0].id) {
                                $scope.listTempOk[data.data.pageTpl[0].id] = true;
                            }
                            if (data.data.pageTpl[1].id) {
                                $scope.detailTempOk[data.data.pageTpl[1].id] = true;
                            }

                        }
                        catch (e) {

                        }
                    } else {
                    	platformModalSvc.showWarmingMessage(data.data,'提示');
                    }
                }).error(function (data, status, headers, config) {
                    console.log('系统异常或网络不给力！');
                });

        } else {
            $scope.bean = {};
            $scope.bean.seo = {};
            $scope.classify = {};
            $scope.bean.imgSm = {};
            $scope.bean.imgMd = {};
            $http.get('/pccms/proj/infoCtg/tree/all?moduleId=' + $stateParams.moduleId)
                .success(function (data, status, headers, config) {
                    if (data.isSuccess) {
                        $scope.collectionBean = data.data;
                    } else {
                    	platformModalSvc.showWarmingMessage(data.data,'提示');
                    }
                })
                .error(function (data, status, headers, config) {
                    console.log('系统异常或网络不给力！');
                });

            $scope.classify.activeItemBean = {};
        }


        $scope.setNetAddress = function () {
          
            if ($scope.bean.name && !$stateParams.id) {
                $http({
                    method: 'GET',
                    url: '/pccms/proj/infoCtg/page ',
                    params: {
                        'staticPageName': codefans_net_CC2PY($scope.bean.name),
                        'id': ''
                    }
                }).success(function (data, status, headers, config) {
                    if (data.isSuccess) {
                        $scope.bean.seo.staticPageName = data.data;
                    } else {
                    	platformModalSvc.showWarmingMessage(data.data,'提示');
                    }
                }).error(function (data, status, headers, config) {
                    console.log('系统异常或网络不给力！');
                });
            } else if (!$scope.bean.name && !$stateParams.id) {
                $scope.bean.seo.staticPageName = '';
            }
        };

        //验证网页访问地址是否重复
        $scope.verRepeat = function () {
           var  id = $stateParams.id ? $stateParams.id : "";
            $http({
                method: 'GET',
                url: '/pccms/proj/infoCtg/page',
                params: {'staticPageName': codefans_net_CC2PY($scope.bean.seo.staticPageName), 'id': id}
            }).success(function (data, status, headers, config) {
                if (data.isSuccess) {
                    $scope.bean.seo.staticPageName = data.data;
                } else {
                	platformModalSvc.showWarmingMessage(data.data,'提示');
                }
            }).error(function (data, status, headers, config) {
                console.log('系统异常或网络不给力！');
            });
        };


        //加载下拉树。
        $scope.classify = {};
        $scope.classify.activeItemBean = {};
        $scope.bean.pageTpl = [];
        
        $http.get('/pccms/proj/infoCtg/tree/all?moduleId=' + $stateParams.moduleId)
            .success(function (data) {
                if (data.isSuccess) {
                    $scope.collectionBean = data.data;
                    if ($stateParams.id) {

                    } else {
                        try{
                            $scope.classify.activeItemBean = {
                                _id: data.data[0]._id,
                                name: data.data[0].name
                            };
                        }catch(e){

                        }

                    }

                } else {
                	platformModalSvc.showWarmingMessage(data.data,'提示');
                }
            })
            .error(function (data, status, headers, config) {
                console.log('系统异常或网络不给力！');
            });

        //获取列表页模板
        $http({
            method: 'GET',
            url: '/pccms/proj/infoCtg/projPageTplList/type',
            params: {'pageTplType': 'LIST', 'moduleId': $stateParams.moduleId}
        }).success(function (data, status, headers, config) {
        	if(data.isSuccess){	 
	    		if(data.data){
	    			$scope.tempList = data.data;
	    			if($scope.tempList && $scope.tempList.length){
	    				var hasCheckedItem = false;
	    				angular.forEach($scope.tempList, function(tempItem){
	    					if($scope.listTempOk[tempItem._id]){
	    						hasCheckedItem = true;
	    						$scope.bean.pageTpl[0] = {
    								'id': tempItem._id,
    								'type': 'LIST'
	    						}
	    						return false;
	    					}
	    				});
	    				if(!hasCheckedItem){
	    					//清空脏数据
	    					//默认第一个打钩
	    					$scope.listTempOk[$scope.tempList[0]._id]= true;
	    					$scope.bean.pageTpl[0] = {
	    							'id': $scope.tempList[0]._id,
	    							'type': 'LIST'
	    						}
	    				}
	    				
	    			}
	    			else{
	    				$scope.bean.pageTpl[0] = null;
	    			}
	    		}
	    	}else{
	    		platformModalSvc.showWarmingMessage(data.data,'提示');
	    	}
        }).error(function (data, status, headers, config) {
            console.log('系统异常或网络不给力！');
        });

        //获取详情页模板
        $http({
            method: 'GET',
            url: '/pccms/proj/infoCtg/projPageTplList/type',
            params: {'pageTplType': 'DETAIL', 'moduleId': $stateParams.moduleId}
        }).success(function (data, status, headers, config) {
        	if(data.isSuccess){	 
	    		if(data.data){
	    			$scope.tempDetail = data.data;
	    			if($scope.tempDetail && $scope.tempDetail.length){
	    				var hasCheckedItem = false;
	    				angular.forEach($scope.tempDetail, function(tempItem){
	    					if($scope.detailTempOk[tempItem._id]){
	    						
	    						hasCheckedItem = true;
	    						//赋予对应的值
	    						
	    						$scope.bean.pageTpl[1] = {
	    							'id': tempItem._id,
	    							'type': 'DETAIL'
	    						}
	    						return false;
	    					}
	    				});
	    				if(!hasCheckedItem){
	    					//清空脏数据
	    					//默认第一个打钩
	    					$scope.detailTempOk[$scope.tempDetail[0]._id]= true;
	    					//赋予对应的值
	    					$scope.bean.pageTpl[1] = {
    							'id': $scope.tempDetail[0]._id,
    							'type': 'DETAIL'
	    					}
	    				}
	    			}
	    			else{
	    				$scope.bean.pageTpl[1] =null;
	    			}
	    		}
	    	}else{
	    		platformModalSvc.showWarmingMessage(data.data,'提示');
	    	}

        }).error(function (data, status, headers, config) {
            console.log('系统异常或网络不给力！');
        });
        
        //列表模板选中。
        $scope.listTempOk = {};
        for (var k in $scope.listTempOk) {
            $scope.listTempOk[k] = false;
        }
        $scope.selectListImageOne = function (row) {
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
        $scope.selectDetailImageOne = function (row) {
            for (var k in $scope.detailTempOk) {
                $scope.detailTempOk[k] = false;
            }
            $scope.detailTempOk[row._id] = true;
            $scope.bean.pageTpl[1] = {
                'id': row._id,
                'type': 'DETAIL'
            }
        };
        
        //
        var flagSpeedTree = false;
        $scope.itemChanged = function(){
            flagSpeedTree = true;

        };

        //提交保存。
        $scope.saveBean = function () {

            //获取moduleId
            if ($stateParams.moduleId) {
                $scope.bean.moduleId = $stateParams.moduleId;
            }
            if ($scope.isLinkFlag) {
                $scope.bean.isLink = true;
                $scope.bean.seo = null;
            }
            console.log($scope.bean.seo);
            //获取下拉树参数、
            if(flagSpeedTree||! $scope.bean.path){
                $scope.classify.activeItemBean.path
                    ? $scope.bean.path = $scope.classify.activeItemBean.path + $scope.classify.activeItemBean._id + ','
                    : $scope.bean.path = ',' + $scope.classify.activeItemBean._id + ',';

            }


           $scope.bean.imgSm.url = $('#thumbnail').attr('src') || '';

            $scope.bean.imgMd.url = $('#lmicon').attr('src') || '';

            var _saveBean;
            if ($stateParams.id) { //修改。
                _saveBean = $http.put('/pccms/proj/infoCtg/' + $stateParams.id, $scope.bean);

            } else { //新增。
                _saveBean = $http.post('/pccms/proj/infoCtg', $scope.bean);
            }

            _saveBean.success(function (data, status, headers, config) {
                var tip = $stateParams.id ? '修改成功！':'新增成功！';
                if (data.isSuccess) {
                    platformModalSvc.showSuccessTip(tip);
                    $state.go('classify', {
                        'moduleId': $stateParams.moduleId,
                        'name': $stateParams.name,
                        'page': $stateParams.page
                    });
                } else {
                	platformModalSvc.showWarmingMessage(data.data,'提示');
                }
            }).error(function (data, status, headers, config) {
                console.log('系统异常或网络不给力！');
            });
        };

        //重置
        $scope.clearFormBtn = function() {
            $state.go('addClassify', {
                'moduleId': $stateParams.moduleId,
                'name': $stateParams.name,
                'page': $stateParams.page
            }, {
                reload: true
            });
        };
    }]);
