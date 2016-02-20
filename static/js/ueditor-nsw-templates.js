/*globals baidu*/
(function (baidu) {
	"use strict";

	var utils = baidu.editor.utils,
		domUtils = baidu.editor.dom.domUtils,
		UIBase = baidu.editor.ui.UIBase,
		uiUtils = baidu.editor.ui.uiUtils;

	var NswTemplates = baidu.editor.ui.nswtemplates = function (options) {
		this.initOptions(options);
		this.initUIBase();
	};
	NswTemplates.prototype = {
		getHtmlTpl: function () {
			return '<div id="##" class="nswtemplate %%" onclick="return $$._onClick(event, this);" onmousedown="return $$._onMouseDown(event, this);">XXE</div>';
		},
		postRender: function () {
			var me = this;
			domUtils.on(window, 'resize', function () {
				setTimeout(function () {
					if (!me.isHidden()) {
						me._fill();
					}
				});
			});
		},
		show: function (zIndex) {
			this._fill();
			this.getDom().style.display = '';
			this.getDom().style.zIndex = zIndex;
		},
		hide: function () {
			this.getDom().style.display = 'none';
			this.getDom().style.zIndex = '';
		},
		isHidden: function () {
			return this.getDom().style.display === 'none';
		},
		_onMouseDown: function () {
			return false;
		},
		_onClick: function (e, target) {
			this.fireEvent('click', e, target);
		},
		_fill: function () {
			var el = this.getDom();
			var vpRect = uiUtils.getViewportRect();
			el.style.width = vpRect.width + 'px';
			el.style.height = vpRect.height + 'px';
		}
	};
	utils.inherits(NswTemplates, UIBase);

}(baidu));

