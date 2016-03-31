// 身份证验证
jQuery.validator.addMethod("idCardFormat", function(value, element) {
	var _validateIdCard = function(num) {
		var len = num.length, re;
		if (len == 15)
			re = new RegExp(/^(\d{6})()?(\d{2})(\d{2})(\d{2})(\d{3})$/);
		else if (len == 18)
			re = new RegExp(/^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\d)$/);
		else {
			//alert("请输入15或18位身份证号,您输入的是 "+len+ "位");
			return false;
		}
		var result = num.match(re);
		if (result != null) {
			var date = null;
			var dateJdg = null;
			if (len == 15) {
				date = new Date("19" + result[3] + "/" + result[4] + "/" + result[5]);
				dateJdg = date.getYear() == result[3] && (date.getMonth() + 1) == result[4] && date.getDate() == result[5];
			} else {
				date = new Date(result[3] + "/" + result[4] + "/" + result[5]);
				dateJdg = date.getFullYear() == result[3] && (date.getMonth() + 1) == result[4] && date.getDate() == result[5];
			}
			if (!dateJdg) {
				return false;
			}
		}
		return true;
	};
	return this.optional(element) || _validateIdCard(value);
}, "身份证号输入错误");

// 手机号验证
jQuery.validator.addMethod("mobile", function(value, element) {
	var length = value.length;
	var mobile =  /^1+\d{10}$/;
	return this.optional(element) || (length == 11 && mobile.test(value));
}, "手机号码格式错误");

// 电话号码验证
jQuery.validator.addMethod("phone", function(value, element) {
	var tel = /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
	return this.optional(element) || (tel.test(value));
}, "电话号码格式错误");

// 邮政编码验证
jQuery.validator.addMethod("zipCode", function(value, element) {
	var tel = /^[0-9]{6}$/;
	return this.optional(element) || (tel.test(value));
}, "邮政编码格式错误");

// 中文的验证
jQuery.validator.addMethod("chinese", function(value, element) {
	var chinese = /^[\u4e00-\u9fa5]+$/;
	return this.optional(element) || (chinese.test(value));
}, "只能输入中文");

// 字母和数字的验证
jQuery.validator.addMethod("chrnum", function(value, element) {
	var chrnum = /^([a-zA-Z0-9]+)$/;
	return this.optional(element) || (chrnum.test(value));
}, "只能输入数字和字母(字符A-Z, a-z, 0-9)");

// 字符验证
jQuery.validator.addMethod("stringCheck", function(value, element) {
	return this.optional(element) || /^[\u0391-\uFFE5\w]+$/.test(value);
}, "只能包括中文字、英文字母、数字和下划线");

// 下拉列表验证
jQuery.validator.addMethod("notEqualsTo", function(value, element, arg){
	return value != arg;
}, "数值输入错误");
