(function(factory) {
	if (typeof define === 'function' && define.amd) {
		define("error", ['zepto'], factory)
	} else {
		factory(window.Zepto || window.jQuery, window, document)
	}
})(function($, window, document, undefined) {

	//----------进行错误验证----------
	$.fn.checkError = function(opt) {
		var option = $.extend([], _option, opt);

		//----------复制设置对象中的验证方法----------
		var error = option.error,
			_errors = option._errors,
			_this = this;
		for (var key in error) {
			_errors[key] = error[key];
		}
		delete option.error;

		var el = this.find(".js-error");
		//循环元素
		for (var i = 0, elLen = el.length; i < elLen; i++) {
			var _el = el[i];
			var $el = $(_el),
				fnName = _el.className.split(" "),
				iserror = false;
			//循环验证方法
			for (var j = 0, fnLen = fnName.length; j < fnLen; j++) {
				if (!/^js-error*/.test(fnName[j])) {
					continue;
				}
				if (option.only_check && !option.only_check[fnName[j]]) {
					continue;
				}
				var _fnObj = _errors[fnName[j]];
				if (_fnObj) {
					_fn = _fnObj.fn || _fnObj;
					var iserror = _fn.call($el);
					if (_fnObj.next) {
							_fnObj.next.call($el, iserror);
						};
					if (!iserror) {
						option.prompt.call($el, option);
						return false;
					}
				}
			}
		}
		return true;
	}

	//----------添加错误验证的方式----------
	$.addCheckFn = function(error) {
		var _errors = _option._errors;
		for (var key in error) {
			_errors[key] = error[key];
		}
	}

	//----------配置默认的几种验证方式----------
	$.check_error_option = {
		_errors: {
			"js-error-null": {fn: isNull},
			"js-error-email": {fn: isMail},
			"js-error-phone": {fn: isPhone},
			"js-error-idcard": {fn: isIdCard},
			"js-error-height": {fn: isSuitHeight}
		},
		prompt_show: true,
		prompt: function(option) {
			var prompt_text = "";
			if (!(typeof option == "string")) {
				if (option.prompt_show === false) {
					return;
				}
				prompt_text = this.attr("js-error-prompt")||"有错误"
				prompt_text = prompt_text==""?"有错误":prompt_text
			}else{
				prompt_text = option;
			}
			
			var newEl = $(promptHTML);
			newEl.text(prompt_text);
			prompt_div[0].parentNode.replaceChild(newEl[0], prompt_div[0]);
			prompt_div = newEl;
			prompt_div.on("transitionend webkitTransitionEnd", function() {
				prompt_div.hide();
			})
			prompt_div.show();
			prompt_div.css({
				"opacity": 0
			});
		}
	};
	var _option = $.check_error_option;

	//添加一个错误消息提示
	var promptHTML = '<div style="-webkit-transition:opacity 3s 2s; transition:opacity 3s 2s; position:fixed; display:none; opacity:0.8; top:0; width:100%; height:30px; text-align:center; font-size:12px; line-height:30px; background:red; color:#fff;">错误信息啊</div>'
	var prompt_div = $(promptHTML);
	$("body").append(prompt_div);

	//----------以下全是验证方法----------
	function isSuitHeight(val_fn) {
		var height_val = ~~this.val();
		var maxHeight = 220;
		var minHeight = 150;
		if (minHeight <= height_val && height_val <= maxHeight) {
			return true;
		} else {
			return false;
		}
	}

	function isNull(next) {
		var val = this.val();
		if (val && val != "") {
			return true;
		} else {
			return false;
		}
	}

	function isMail() {
		var error = true;
		var search_str = /^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/;
		var email_val = this.val();
		if (search_str.test(email_val)) {
			return true;
		} else {
			return false;
		}
	}

	function isPhone() {
		var error = true;
		var search_str = /^0?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/;
		var phone_val = this.val();
		if (search_str.test(phone_val)) {
			return true;
		} else {
			return false;
		}
	}

	function isIdCard() {
		var error = true;
		var IdCard_val = this.val();
		if (getIdCardInfo(IdCard_val)) {
			return true;
		} else {
			return false;
		}

		function getIdCardInfo(cardNo) {
			var info = {
				isTrue: false,
				year: null,
				month: null,
				day: null,
				isMale: false,
				isFemale: false
			};
			if (cardNo) {
				if (/^[a-zA-Z][0-9]{9}$/.test(cardNo)) {
					console.log("台湾身份证");
					return true;
				} else if (/^[1|5|7][0-9]{6}[0-9A-Z]?$/.test(cardNo)) {
					console.log("澳门身份证");
					return true;
				} else if (/^[A-Z][0-9]{6}[0-9|A]$/.test(cardNo)) {
					console.log("香港身份证");
					return true;
				}
			}
			if (15 != cardNo.length && 18 != cardNo.length) {
				return false;
			};
			if (15 == cardNo.length) {
				var year = cardNo.substring(6, 8);
				var month = cardNo.substring(8, 10);
				var day = cardNo.substring(10, 12);
				var p = cardNo.substring(14, 15); //性别位
				var birthday = new Date(year, parseFloat(month) - 1,
					parseFloat(day));
				// 对于老身份证中的年龄则不需考虑千年虫问题而使用getYear()方法
				if (birthday.getYear() != parseFloat(year) || birthday.getMonth() != parseFloat(month) - 1 || birthday.getDate() != parseFloat(day)) {
					info.isTrue = false;
				} else {
					info.isTrue = true;
					info.year = birthday.getFullYear();
					info.month = birthday.getMonth() + 1;
					info.day = birthday.getDate();
					if (p % 2 == 0) {
						info.isFemale = true;
						info.isMale = false;
					} else {
						info.isFemale = false;
						info.isMale = true
					}
				}
				return info.isTrue;
			}
			if (18 == cardNo.length) {
				var year = cardNo.substring(6, 10);
				var month = cardNo.substring(10, 12);
				var day = cardNo.substring(12, 14);
				var p = cardNo.substring(14, 17)
				var birthday = new Date(year, parseFloat(month) - 1,
					parseFloat(day));
				// 这里用getFullYear()获取年份，避免千年虫问题
				if (birthday.getFullYear() != parseFloat(year) || birthday.getMonth() != parseFloat(month) - 1 || birthday.getDate() != parseFloat(day)) {
					info.isTrue = false;
					return info;
				}
				var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子
				var Y = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X
				// 验证校验位
				var sum = 0; // 声明加权求和变量
				var _cardNo = cardNo.split("");
				if (_cardNo[17].toLowerCase() == 'x') {
					_cardNo[17] = 10; // 将最后位为x的验证码替换为10方便后续操作
				}
				for (var i = 0; i < 17; i++) {
					sum += Wi[i] * _cardNo[i]; // 加权求和
				}
				var i = sum % 11; // 得到验证码所位置
				if (_cardNo[17] != Y[i]) {
					return info.isTrue = false;
				}
				info.isTrue = true;
				info.year = birthday.getFullYear();
				info.month = birthday.getMonth() + 1;
				info.day = birthday.getDate();
				if (p % 2 == 0) {
					info.isFemale = true;
					info.isMale = false;
				} else {
					info.isFemale = false;
					info.isMale = true
				}
				return info.isTrue;
			}
			return info.isTrue;
		}
	}
})