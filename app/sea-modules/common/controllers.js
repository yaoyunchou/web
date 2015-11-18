

/*
var phonecatControllers = angular.module('phonecatControllers', []);

phonecatControllers.ng-controller="PhoneListCtrl"('PhoneListCtrl', ['$scope', 'Phone',
  function($scope, Phone) {
    $scope.phones = Phone.query();
    $scope.orderProp = 'age';
  }]);

phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone',
  function($scope, $routeParams, Phone) {
    $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
      $scope.mainImageUrl = phone.images[0];
    });

    $scope.setImage = function(imageUrl) {
      $scope.mainImageUrl = imageUrl;
    }
  }]);
*/

function PhoneListCtrl($scope,$http) {
	//建立数据模型
	//$scope.url="http://192.168.1.8:8080/p2p-web/appinterface/indexbanner.json";
	//console.log($scope.url);
  /*$scope.phones = [
    {"name": "Nexus S",
     "snippet": "Fast just got faster with Nexus S.","age":3},
    {"name": "Motorola XOOM™ with Wi-Fi",
     "snippet": "The Next, Next Generation tablet.","age":2},
    {"name": "MOTOROLA XOOM™",
     "snippet": "The Next, Next Generation tablet.","age":5}
  ];*/
  //设置默认排序方式
  

 
  
  
  
   $scope.hjfpost=function(myurl){
   	   var  jkurl="";
   	   
   	//console.log(myurl.parentNode.parentNode.childNodes.length);
   	
   	for( var i=0;i<(myurl.parentNode.parentNode.childNodes.length);i++){
   		
   		if(myurl.parentNode.parentNode.childNodes[i].className=="api_url"){
   			//console.log(myurl.parentNode.parentNode.childNodes[i].childNodes[1].innerHTML);
   			jkurl=myurl.parentNode.parentNode.childNodes[i].childNodes[1].innerHTML
   			//console.log(jkurl);
   		
   		}
   		if(myurl.parentNode.parentNode.childNodes[i].className=="api_params"){
   			jkurl+="?";
   			for(var j=0; j < myurl.parentNode.parentNode.childNodes[i].childNodes[3].childNodes.length;j++){
   					var cs=myurl.parentNode.parentNode.childNodes[i].childNodes[3].childNodes[j];
   			//console.log(cs.tagName);
   			
   			  if(cs.tagName=="INPUT"&&cs.value!=null){
   				  jkurl+=cs.name+"="+cs.value+"*";
   				
   			  }
   				
   			}
   			
   		
   			jkurl=jkurl+'';
   		}
   		
   		
   	}
   	
   	
   	   $http.post('lib/php/postandget.php?url='+jkurl).success(function(data) {
   	   	console.log(jkurl);
      	var myhtml = ProcessObject(data, 0, false, false, false);
   // $scope.phonesb = data;
   	for( var i=0;i<(myurl.parentNode.parentNode.childNodes.length);i++){
   		
   		
   		if(myurl.parentNode.parentNode.childNodes[i].className=="return_area"){
   			myurl.parentNode.parentNode.childNodes[i].innerHTML='<pre class="CodeContainer">'+myhtml+'</pre>';
   			
   		}
   		
   	}
   // myhtml = myhtml.replace("undefined","&nbsp;")
 
       $scope.phonesb=myhtml;
  });
   }
 
}

/*function PhoneListCtrl($scope, $http) {
  $http.get('phones/phones.json').success(function(data) {
    $scope.phonesx = data;
  });

  $scope.orderProp = 'age';
}
*/
window.TAB="&nbsp;&nbsp;";
window.SINGLE_TAB = " ";
window.ImgCollapsed = "img/Collapsed.gif";
window.ImgExpanded = "img/Expanded.gif";
window.QuoteKeys = false;//引号
window.IsCollapsible =true;
function $id(id){ return document.getElementById(id); }
function IsArray(obj) {
  return  obj && typeof obj === 'object' && typeof obj.length === 'number' && !(obj.propertyIsEnumerable('length'));
}


window._dateObj = new Date();
window._regexpObj = new RegExp();
function ProcessObject(obj, indent, addComma, isArray, isPropertyContent){
  var html = "";
  var comma = (addComma) ? "<span class='Comma'>,</span> " : ""; 
  var type = typeof obj;
  var clpsHtml ="";
  if(IsArray(obj)){
    if(obj.length == 0){
      html += GetRow(indent, "<span class='ArrayBrace'>[ ]</span>"+comma, isPropertyContent);
    }else{
      clpsHtml = window.IsCollapsible ? "<span><img src=\""+window.ImgExpanded+"\" onClick=\"ExpImgClicked(this)\" /></span><span class='collapsible'>" : "";
      html += GetRow(indent, "<span class='ArrayBrace'>[</span>"+clpsHtml, isPropertyContent);
      for(var i = 0; i < obj.length; i++){
        html += ProcessObject(obj[i], indent + 1, i < (obj.length - 1), true, false);
      }
      clpsHtml = window.IsCollapsible ? "</span>" : "";
      html += GetRow(indent, clpsHtml+"<span class='ArrayBrace'>]</span>"+comma);
    }
  }else if(type == 'object'){
    if (obj == null){
        html += FormatLiteral("null", "", comma, indent, isArray, "Null");
    }else if (obj.constructor == window._dateObj.constructor) { 
        html += FormatLiteral("new Date(" + obj.getTime() + ") /*" + obj.toLocaleString()+"*/", "", comma, indent, isArray, "Date"); 
    }else if (obj.constructor == window._regexpObj.constructor) {
        html += FormatLiteral("new RegExp(" + obj + ")", "", comma, indent, isArray, "RegExp"); 
    }else{
      var numProps = 0;
      for(var prop in obj) numProps++;
      if(numProps == 0){
        html += GetRow(indent, "<span class='ObjectBrace'>{ }</span>"+comma, isPropertyContent);
      }else{
        clpsHtml = window.IsCollapsible ? "<span><img src=\""+window.ImgExpanded+"\" onClick=\"ExpImgClicked(this)\" /></span><span class='collapsible'>" : "";
        html += GetRow(indent, "<span class='ObjectBrace'>{</span>"+clpsHtml, isPropertyContent);
        var j = 0;
        for(var prop in obj){
          var quote = window.QuoteKeys ? "\"" : "";
          html += GetRow(indent + 1, "<span class='PropertyName'>"+quote+prop+quote+"</span>: "+ProcessObject(obj[prop], indent + 1, ++j < numProps, false, true));
        }
        clpsHtml = window.IsCollapsible ? "</span>" : "";
        html += GetRow(indent, clpsHtml+"<span class='ObjectBrace'>}</span>"+comma);
      }
    }
  }else if(type == 'number'){
    html += FormatLiteral(obj, "", comma, indent, isArray, "Number");
  }else if(type == 'boolean'){
    html += FormatLiteral(obj, "", comma, indent, isArray, "Boolean");
  }else if(type == 'function'){
    if (obj.constructor == window._regexpObj.constructor) {
        html += FormatLiteral("new RegExp(" + obj + ")", "", comma, indent, isArray, "RegExp"); 
    }else{
        obj = FormatFunction(indent, obj);
        html += FormatLiteral(obj, "", comma, indent, isArray, "Function");
    }
  }else if(type == 'undefined'){
    html += FormatLiteral("undefined", "", comma, indent, isArray, "Null");
  }else{
    html += FormatLiteral(obj.toString().split("\\").join("\\\\").split('"').join('\\"'), "\"", comma, indent, isArray, "String");
  }
  return html;
}

function FormatLiteral(literal, quote, comma, indent, isArray, style){
  if(typeof literal == 'string')
    literal = literal.split("<").join("&lt;").split(">").join("&gt;");
  var str = "<span class='"+style+"'>"+quote+literal+quote+comma+"</span>";
  if(isArray) str = GetRow(indent, str);
  return str;
}

function FormatFunction(indent, obj){
  var tabs = "";
  for(var i = 0; i < indent; i++) tabs += window.TAB;
  var funcStrArray = obj.toString().split("\n");
  var str = "";
  for(var i = 0; i < funcStrArray.length; i++){
    str += ((i==0)?"":tabs) + funcStrArray[i] + "\n";
  }
  return str;
}

function GetRow(indent, data, isPropertyContent){
  var tabs = "";
  for(var i = 0; i < indent && !isPropertyContent; i++) tabs += window.TAB;
  if(data != null && data.length > 0 && data.charAt(data.length-1) != "\n")
    data = data+"\n";
  return tabs+data;                       
}

function CollapsibleViewClicked(){
  $id("CollapsibleViewDetail").style.visibility = $id("CollapsibleView").checked ? "visible" : "hidden";
  Process();
}


function QuoteKeysClicked(){
  window.QuoteKeys = $id("QuoteKeys").checked;
  Process();
}


function CollapseAllClicked(){
  EnsureIsPopulated();
  TraverseChildren($id("Canvas"), function(element){
    if(element.className == 'collapsible'){
      MakeContentVisible(element, false);
    }
  }, 0);
}

function ExpandAllClicked(){
  EnsureIsPopulated();
  TraverseChildren($id("Canvas"), function(element){
    if(element.className == 'collapsible'){
      MakeContentVisible(element, true);
    }
  }, 0);
}

function MakeContentVisible(element, visible){
  var img = element.previousSibling.firstChild;
  if(!!img.tagName && img.tagName.toLowerCase() == "img"){
    element.style.display = visible ? 'inline' : 'none';
    element.previousSibling.firstChild.src = visible ? window.ImgExpanded : window.ImgCollapsed;
  }
}

function TraverseChildren(element, func, depth){
  for(var i = 0; i < element.childNodes.length; i++){
    TraverseChildren(element.childNodes[i], func, depth + 1);
  }
  func(element, depth);
}

function ExpImgClicked(img){
  var container = img.parentNode.nextSibling;
  if(!container) return;
  var disp = "none";
  var src = window.ImgCollapsed;
  if(container.style.display == "none"){
      disp = "inline";
      src = window.ImgExpanded;
  }
  container.style.display = disp;
  img.src = src;
}

function CollapseLevel(level){
  EnsureIsPopulated();
  TraverseChildren($id("Canvas"), function(element, depth){
    if(element.className == 'collapsible'){
      if(depth >= level){
        MakeContentVisible(element, false);
      }else{
        MakeContentVisible(element, true);  
      }
    }
  }, 0);
}

function TabSizeChanged(){
  Process();
}

function EnsureIsPopulated(){
  if(!$id("Canvas").innerHTML && !!$id("RawJson").value) Process();
}

function MultiplyString(num, str){
  var sb =[];
  for(var i = 0; i < num; i++){
    sb.push(str);
  }
  return sb.join("");
}



function LinkToJson(){
  var val = $id("RawJson").value;
  val = escape(val.split('/n').join(' ').split('/r').join(' '));
  $id("InvisibleLinkUrl").value = val;
  $id("InvisibleLink").submit();
}
