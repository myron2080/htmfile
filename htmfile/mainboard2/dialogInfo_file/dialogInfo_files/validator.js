/**
	jQuery Validator 框架辅助类
	仅为老年服务平台项目服务
	必须导入jQuery、jQuery Validator支持框架
	options中必须包含rules、message信息
**/
var Validator = function() {
	return {
		init : function(options) {
			if (options == null) {
				options = {};
			}
			$.validator.setDefaults({
				errorElement: options['errorElement'] != null ? options['errorElement'] : 'span',
				errorClass: options['errorClass'] != null ? options['errorClass'] : 'help-block help-block-error',
				// 启动错误提示
				doNotHideMessage: options['doNotHideMessage'] != null ? options['doNotHideMessage'] : true,
				// 出错的最后元素获得焦点(关闭)
				focusInvalid: options['focusInvalid'] != null ? options['focusInvalid'] : false,
				// 忽略设置(关闭)
				ignore: options['ignore'] != null ? options['ignore'] : '',
				// 验证规则(对应name属性)
				rules: options['rules'],
				// 错误信息
				messages: options['messages'],
				errorPlacement: options['errorPlacement'] != null ? options['errorPlacement'] : function(error, element) {
					// 将name转换为驼峰格式
					var re= /\.(\w)/g;
					var elementName = element.attr('name').replace(re, function(){
						var args = arguments;
						return args[1].toUpperCase();
					});
					var str = elementName + '-error';
					error.attr('id', str);
					$(element).after(error);
				},
				highlight: options['highlight'] != null ? options['highlight'] : function(element) {
					$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
				},
				unhighlight: options['highlight'] != null ? options['highlight'] : function(element) {
					$(element).closest('.form-group').removeClass('has-error');
				},
				success: options['success'] != null ? options['success'] : function(element) {
					$(element).closest('.form-group').removeClass('has-error').addClass('has-success').addClass('valid');
				},
				invalidHandler: options['invalidHandler'] != null ? options['invalidHandler'] : function(event, validator) {
				},
				submitHandler: options['submitHandler'] != null ? options['submitHandler'] : function(form) {
					form.submit();
				},
			});
		},
	};
};