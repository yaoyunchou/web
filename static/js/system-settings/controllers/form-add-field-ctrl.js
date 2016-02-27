/**
 * Created by yaoyc on 2016/1/11.
 */
/*global angular*/
(function (angular) {
	"use strict";
	var systemSettingsApp = angular.module("systemSettingsApp");
	systemSettingsApp.controller('addFieldCtrl', ['$scope', 'messageCatalogSvc', 'messageListConfigSvc','platformModalSvc', function ($scope, messageCatalogSvc, messageListConfigSvc,platformModalSvc) {
		if($scope.modalOptions.data){
			//初始化UI
			$scope.optionField = {};
			$scope.UI = {};
			var inputType = $scope.modalOptions.data.formType;
			if($scope.modalOptions.data.select !=='Reg'){
				$scope.modalOptions.data.regular = '';
			}
			//$scope.select =  $scope.modalOptions.data.regular;


			$scope.fieldBean = $scope.modalOptions.data;
			/*if(inputType==='textarea'){
				inputType='text';
				$scope.fieldBean.isSingle = false;
				$scope.fieldBean.formType = 'text';
			}else if(inputType ==='text'){
				$scope.fieldBean.isSingle = true;
			}*/
			$scope.UI[inputType] = true;
		}else{
			$scope.UI={text:true,radio:true,checkbox:true,selected:true,textarea:true};
			$scope.fieldBean = {};
			$scope.optionField = {};
			$scope.fieldBean.data=[];
			$scope.fieldBean.intentionFormEcho =true;
			$scope.fieldBean.formId = $scope.modalOptions.formId;
			$scope.fieldBean.length = 30;
			$scope.fieldBean.formType = 'text';
			$scope.fieldBean.isSingle = true;
			$scope.fieldBean.isRequired = false;
			$scope.fieldBean.isVerify = false;
		}
		//保存数据
		$scope.addFieldBean = function addFieldBean(){
			if($scope.modalOptions.data){
				messageListConfigSvc.editFieldSvc($scope.fieldBean)
			}else{
				messageListConfigSvc.addfield($scope.fieldBean);
			}
			$scope.closeModal(true);
		};
		//多选的optionField 添加
		$scope.addOptionField = function addOptionField(){
			if($scope.optionField.name&&$scope.optionField.defaultValue){

				if($scope.fieldBean.data<1){
					$scope.optionField.orderBy = 1;
					//默认第一个添加的为选中
					$scope.optionField.isDefault=true;
					$scope.fieldBean.data.push($scope.optionField);
					$scope.optionField = {};
				}else{
					var flog = true;
					for(var i =0; i<$scope.fieldBean.data.length;i++){
						if($scope.fieldBean.data[i].name == $scope.optionField.name ){
							platformModalSvc.showWarmingTip("选项名已存在！");
							return  flog = false;
							break;
						}
						if ($scope.fieldBean.data[i].defaultValue == $scope.optionField.defaultValue){
							platformModalSvc.showWarmingTip("选项值已存在！");
							return  flog = false;
							break;
						}
					}
					if(flog){
						$scope.optionField.isDefault=false;
						var current = _.maxBy($scope.fieldBean.data,'orderBy').orderBy;
						$scope.optionField.orderBy =current + 1;
						$scope.fieldBean.data.push($scope.optionField);
						$scope.fieldBean.data = _.sortBy($scope.fieldBean.data,'orderBy');
						$scope.optionField = {};
					}

				}
			}else if(!$scope.optionField.name){
				platformModalSvc.showWarmingTip("选项名不能为空！");
			}else{
				platformModalSvc.showWarmingTip("选项值不能为空！");
			}
		};

		//设置默认
		$scope.isDefault = function isDefault(item){
			if($scope.fieldBean.formType !=='checkbox'){
				messageListConfigSvc.isDefault($scope.fieldBean.data);
				item.isDefault = true;
			}else{
				item.isDefault = !item.isDefault;
			}
		};

		//多选框与其他多选切换
		$scope.$watch('fieldBean.formType',function(newv,oldv){
			if(!$scope.modalOptions.data){
				if(newv==='checkbox'||oldv==='checkbox'){
					if($scope.fieldBean.data.length>0){
						messageListConfigSvc.isDefault($scope.fieldBean.data);
						$scope.fieldBean.data[0].isDefault = true;
					}
				}
				if(newv!=='text'){
					$scope.fieldBean = _.omit($scope.fieldBean,'intentionFormEcho')
				}else{
					$scope.fieldBean.intentionFormEcho = true;
				}
			}


		});
		/*$scope.checkboxFun = function checkboxFun(){
			if($scope.fieldBean.data.length){

			}else{
				messageListConfigSvc.isDefault($scope.fieldBean.data);
				$scope.fieldBean.data[0].isDefault = true;
			}
		};*/
		//排序
		$scope.interchange = function interchange(item1,item2){
			var order =item1.orderBy;
			item1.orderBy =item2.orderBy;
			item2.orderBy =order;
			$scope.fieldBean.data = _.sortBy($scope.fieldBean.data,'orderBy');
		};
		$scope.intentionFormEcho = function intentionFormEcho(){
			$scope.fieldBean.intentionFormEcho = false;
		};

		//删除optionFiled
		$scope.deleteOptionField = function deleteOptionField(index,item){
			platformModalSvc.showConfirmMessage('确定要删除当前选项吗?','网站操作信息提示').then(function(){
				if(item.isDefault){
					$scope.fieldBean.data.splice(index,1);
					$scope.fieldBean.data[0].isDefault = true;
				}else{
					$scope.fieldBean.data.splice(index,1);
				}
			})

		};

	}]);
}(angular));