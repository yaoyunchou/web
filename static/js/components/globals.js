/*global baidu, module*/
(function () {
	"use strict";

	var exportObj, inBroswer = false;
	if (typeof exports === 'undefined') {
		exportObj = window;
		inBroswer = true;
	} else {
		exportObj = module.exports;
	}

	var appRoot = 'http://localhost:8083/pccms/';

	//when the location is invalid, replace it with the default location.
	if (exportObj.location && appRoot.toLowerCase().indexOf(window.location.origin.toLowerCase()) === -1) {
		appRoot = window.location.origin + '/pccms/';
	}
	exportObj.globals = {
		basAppRoot: appRoot,
		basAppRoute: appRoot + 'js/',
		basImagePath:'http://192.168.4.160:8080/nswcms//',
		defaultImg:appRoot+ 'img/nsw.png',
		debug: true,
		spaMode: false
	};

}());
