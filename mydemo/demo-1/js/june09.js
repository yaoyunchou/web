/**
 * Created by Administrator on 2016/6/9.
 */
(function(){
    function createComparisonFunction(propertryName){
        return function (object1,object2){
            if(object1[propertryName]>object2[propertryName]){
                return  1;
            }else if(object1[propertryName]<object2[propertryName]){
                return -1;
            }else{
                return 0;
            }
        }
    }
    var data = [{name:'yao',age:18},{name:'huang',age:40},{name:'cheng',age:30}];
    data.sort(createComparisonFunction('name'));
    console.log(data);

    function factorial(num){
       // "use strict";
        if(num<=1){
            return 1;
        }else{
            return num*arguments.callee(num-1);
        }
    }
    console.log(factorial(5));
})();