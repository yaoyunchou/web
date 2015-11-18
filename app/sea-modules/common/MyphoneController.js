define(function(require, exports, module) {

   var $ = require('jquery1.42.min.js');
     //=> 加载的是 http://path/to/base/jquery/jquery/1.10.1/jquery.js
   console.log($().jquery);
   var biz = require('');
     //=> 加载的是 http://path/to/app/biz.js

});