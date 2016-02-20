/*globals UE*/
/*
 insertimage重写
* */
(function (UE) {
	"use strict";

	var utils = UE.utils;
	UE.commands['insertimage'] = {
		execCommand:function (cmd, opt) {

			opt = utils.isArray(opt) ? opt : [opt];
			if (!opt.length) {
				return;
			}
			var me = this,
				range = me.selection.getRange(),
				img = range.getClosedNode();

			if(me.fireEvent('beforeinsertimage', opt) === true){
				return;
			}

			if (img && /img/i.test(img.tagName) && (img.className != "edui-faked-video" || img.className.indexOf("edui-upload-video")!=-1) && !img.getAttribute("word_img")) {
				var first = opt.shift();
				var floatStyle = first['floatStyle'];
				delete first['floatStyle'];
////                img.style.border = (first.border||0) +"px solid #000";
////                img.style.margin = (first.margin||0) +"px";
//                img.style.cssText += ';margin:' + (first.margin||0) +"px;" + 'border:' + (first.border||0) +"px solid #000";
				domUtils.setAttributes(img, first);
				me.execCommand('imagefloat', floatStyle);
				if (opt.length > 0) {
					range.setStartAfter(img).setCursor(false, true);
					me.execCommand('insertimage', opt);
				}

			} else {
				var html = [], str = '', ci;
				ci = opt[0];
				if (opt.length == 1) {
					str = '<img src="' + ci.src + '" ' + (ci._src ? ' _src="' + ci._src + '" ' : '') +
						(ci.width ? 'width="' + ci.width + '" ' : '') +
						(ci.height ? ' height="' + ci.height + '" ' : '') +
						(ci['floatStyle'] == 'left' || ci['floatStyle'] == 'right' ? ' style="float:' + ci['floatStyle'] + ';"' : '') +
						(ci.title && ci.title != "" ? ' title="' + ci.title + '"' : '') +
						(ci.border && ci.border != "0" ? ' border="' + ci.border + '"' : '') +
						(ci.alt && ci.alt != "" ? ' alt="' + ci.alt + '"' : '') +
						(ci.hspace && ci.hspace != "0" ? ' hspace = "' + ci.hspace + '"' : '') +
						(ci.vspace && ci.vspace != "0" ? ' vspace = "' + ci.vspace + '"' : '') + '/>';
					if (ci['floatStyle'] == 'center') {
						str = '<p style="text-align: center">' + str + '</p>';
					}
					html.push(str);

				} else {
					for (var i = 0; ci = opt[i++];) {
						str = '<p ' + (ci['floatStyle'] == 'center' ? 'style="text-align: center" ' : '') + '><img src="' + ci.src + '" ' +
							(ci.width ? 'width="' + ci.width + '" ' : '') + (ci._src ? ' _src="' + ci._src + '" ' : '') +
							(ci.height ? ' height="' + ci.height + '" ' : '') +
							' style="' + (ci['floatStyle'] && ci['floatStyle'] != 'center' ? 'float:' + ci['floatStyle'] + ';' : '') +
							(ci.border || '') + '" ' +
							(ci.title ? ' title="' + ci.title + '"' : '') + ' /></p>';
						html.push(str);
					}
				}

				me.execCommand('insertHtml', html.join(''));
			}

			me.fireEvent('afterinsertimage', opt)
		}
	};
}(UE));