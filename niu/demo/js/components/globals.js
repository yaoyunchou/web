/*global module*/
(function () {
	"use strict";

	var exportObj;
	if (typeof exports === 'undefined') {
		exportObj = window;
	} else {
		exportObj = module.exports;
	}

	var appRoot = 'http://localhost:8083/pccms/';

	//when the location is invalid, replace it with the default location.
	if (exportObj.location && appRoot.toLowerCase().indexOf(window.location.origin.toLowerCase()) === -1) {
		appRoot = window.location.origin + '/web/niu/demo/';
	}
	exportObj.globals = {
		basAppRoot: appRoot,
		basAppRoute: appRoot + 'js/',
		debug: true,
		spaMode: false
	};
}());