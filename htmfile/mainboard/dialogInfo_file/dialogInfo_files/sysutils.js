(function($) {
	// 绑定事件
	// 覆盖，多播，前置优先，后置优先
//	$.fn.on = function() {
//		
//		var on = function( types, selector, strategy, data, fn, one ) {
//			// 策略可同时设置多个
//			// $(...).data("events")获取事件对象列表
//			// 用on绑定之后再通过$(...).data("events")获取事件对象，传入策略属性
//			// 提前至首位，pushToFirst，放到事件列表第一个
//			// 保持首位，keepFirst，放到事件列表的第一个。如有其他事件放到了第一个，则再将该事件放到首位
//			// 保持末位，keepLast，放到事件列表的最后一个。如绑定其他事件，则再将该事件放到最后
//			// bind-once.click，bind-once.blur检查事件列表。如已绑定对应事件，则不绑定
//		};
//	
//	};

	
	// 将字符串转换为驼峰格式
	$.fn.strFormat = function(str){
		var re= /\.(\w)/g;
		return str.replace(re, function(){
			var args = arguments;
			return args[1].toUpperCase();
		});
	};

	// 绑定即时验证事件
	$.fn.instantValid = function() {
		var count = 0;
		if ($(this).data('events')) {
			var blurArr = $(this).data('events')['blur'] == null ? "" : $(this).data('events')['blur'];
			$.each(blurArr, function() {
				if (this['namespace'] == 'validate') {
					count ++;
				}
			});
		}
		if (count == 0) {
			$(this).on('blur.validate', function() {
				$(this).valid();
			});
		}
	};

	// 表单序列化
	$.fn.formSerialize = function() {
		var form = $(this);
		var str = '';
		var formData = new Array();
		$.each(form.find('input.form-control, select.form-control, textarea.form-control, input[type=hidden]'), function() {
			if ($(this).attr('name')) {
				var attrName = $(this).attr('name');
				var elementVal = $(this).val();
				if ($.trim($(this).val()) != '') {
					formData[attrName] = elementVal;
					str += attrName + '=' + elementVal + "&";
				}
			}
		});
		if (str != '') {
			str=str.substring(0, str.length-1);
		}
		return str;
	};

	/**
	 * 将表单信息保存到缓存中
	 *
	 * form 目标表单
	 */
	$.fn.holdFormData = function(form) {
		var formData = new Array();
		// 普通输入框，隐含域
		$.each(form.find('input.form-control, input[type=hidden]'), function() {
			if ($(this).attr('id')) {
				var elementId = $(this).attr('id');
				var elementVal = $(this).val();
				formData[elementId] = elementVal;
			}
		});
		// 下拉列表
		$.each(form.find('select.form-control'), function() {
			// 保存所选值
			var elementId = $(this).attr('id');
			var elementVal = $(this).val();
			formData[elementId] = elementVal;
			// 若存在data-relative标志，则保存下拉列表
			if ($(this).attr('data-relative')) {
				var optionsArr = $(this).children();
				var optionsArrId = elementId + "_options";
				formData[optionsArrId] = optionsArr;
			}
		});
		return formData;
	},

	/**
	 * 根据缓存信息恢复表单
	 *
	 * form 目标表单
	 * pageData 缓存对象
	 */
	$.fn.recoverForm = function(form, pageData) {
		// tag域
		$.each(form.find('[id$=tag_field_wrapper]'), function() {
			var hiddenInput = $(this).find('input[type=hidden]');
			var elementId = hiddenInput.attr('id');
			if (pageData[elementId] != hiddenInput.val()) {
				var disabledFlag = false;
				var selectedField = $(this).find('[id$=selected]');
				var unselectField = $(this).find('[id$=unselect]');
				// 恢复隐含域信息
				hiddenInput.val(pageData[elementId]);
				// 检查disabled标志，若存在则移除
				if ($(this).attr('disabled')) {
					disabledFlag = true;
					$(this).removeAttr('disabled');
				};
				// 恢复tag域
				$.each(selectedField.find('span.btn'), function(index, tag) {
					$(tag).click();
				});
				// 重新将tag移至checked区块中，并隐藏文字提示
				var selected = $(this).find('input[type=hidden]').val();
				var selectedArr = selected == '' ? '' : selected.split(',');
				if (selectedArr.length > 0) {
					$.each(unselectField.find('span.btn'), function(index, tag) {
						if ($(tag).attr('value').indexOf(selectedArr) != -1) {
							$(tag).click();
						}
					});
				};
				// 恢复disabled标志
				if (disabledFlag) {
					$(this).attr('disabled', true);
				};
			}
		});
		// 普通输入框，隐含域
		$.each(form.find('input.form-control, input[type=hidden]'), function() {
			var elementId = $(this).attr('id');
			var inputVal = $(this).val();
			if (pageData[elementId] != inputVal) {
				if (elementId) {
					$(this).val(pageData[elementId]);
				}
			}
		});
		// 下拉列表
		$.each(form.find('select.form-control'), function() {
			var elementId = $(this).attr('id');
			var selectedVal = $(this).val();
			// 若存在data-relative标志，则恢复下拉列表
			if ($(this).attr('data-relative')) {
				var optionsArrId = elementId + "_options";
				$(this).empty().append(pageData[optionsArrId]);
			}
			// 设置selected标记
			if (pageData[elementId] != selectedVal) {
				$.each($(this).find('option'), function() {
					if ($(this).val() == pageData[elementId]) {
						$(this).attr('selected', true);
					}
				});
			}
		});
	},

	// 初始化下拉列表，选定符合的选项
	$.fn.initSelect = function(options) {
		if (options == null) {
			options = new Array();
		}
		// 获取元素信息
		var elementData = $.parseJSON($(this).text());
		// 元素属性定义
		var attrArr = elementData['attr'];
		var attrHtml = '';
		if (attrArr) {
			$.each(attrArr, function(attrName, elementValue) {
				attrHtml += " " + attrName + "='" + elementValue + "'";
			});
		}
		// 生成selectHtml
		var selectHtml = new Array();
		selectHtml[0] = "<select" + attrHtml + ">";
		selectHtml[1] = "</select>";
		// 生成optionHtml，同时添加selected标记
		var optionsInfo = elementData['optionsInfo'];
		var selected = elementData['selected'];
		var optionHtml = "<option value=''>--</option>";
		if(optionsInfo) {
			$.each(optionsInfo, function(index, option) {
				var value = option.value != null ? option.value : option.id;
				var title = option.title != null ? option.title : option.name;
				var selectedHtml = value == selected ? ' selected=selected' : '' ;
				optionHtml += "<option value='" + value + "'" + selectedHtml + ">" + title + "</option>";
			});
		}
		// 呈现下拉列表
		$(this).replaceWith(selectHtml[0] + optionHtml + selectHtml[1]);
		// 级联设置，元素必须设置id、data-relative属性
		if (attrArr['id'] && attrArr['data-relative']) {
			// 初始化缓存
			if (options['selectData'] == null) {
				options['selectData'] = new Array();
				$.data['selectData'] = new Array();
			}
			// 获取元素对象
			var element = $("#" + attrArr['id']);
			// 变量定义
			var relativeAttrArr = attrArr['data-relative'].split('.');
			var namespace = relativeAttrArr[0];
			var relativeIndex = relativeAttrArr[1];
			var relativeArrName = namespace + '_arr';
			var relativeArr = options['selectData'][relativeArrName] == null ? new Array() : options['selectData'][relativeArrName];
			var elementDataName = attrArr['id'] + "_relative";
			var elementData = options['selectData'][elementDataName] == null ? element.val() : options['selectData'][elementDataName];
			// 设置级联信息
			relativeArr[relativeIndex] = attrArr['id'];
			// 更新缓存信息
			$.data['selectData'][relativeArrName] = relativeArr;
			$.data['selectData'][elementDataName] = elementData;
			// 级联方法
			var changeRelateSelectFunc = options[namespace + '_changeRelateSelect'];
			// 绑定级联方法
			element.on('change.relative', function(e) {
				e.preventDefault();
				changeRelateSelectFunc($(this));
			});
		}
	};

	// 初始化tag域，生成tag域的页面元素，并绑定按钮事件
	$.fn.initTagField = function() {
		// 获取元素信息
		var elementData = $.parseJSON($(this).text());
		// 变量定义
		var attrArr = elementData['attr'];
		var selected = elementData['selected'];
		var wrapperId = attrArr['id'] + '_tag_field_wrapper';
		var selectedFieldId = attrArr['id'] + '_selected';
		var unselectFieldId = attrArr['id'] + '_unselect';
		// 元素属性定义
		var elementId = attrArr['id'] != '' ? " id='" + attrArr['id'] + "'": '';
		var elementName = attrArr['name'] != '' ? " name='" + attrArr['name'] + "'": '';
		var elementWrapperId = wrapperId != '' ? " id='" + wrapperId + "'": '';
		var attrHtml = '';
		if (attrArr) {
			$.each(attrArr, function(attrName, elementValue) {
				if (attrName != 'id' && attrName != 'name') {
					attrHtml += " " + attrName + "='" + elementValue + "'";
				}
			});
		}
		// 生成tag域Html
		var html = new Array();
		html[0] = "<div" + elementWrapperId + ">";
		html[1] = "<input type='hidden'" + elementId + elementName + " value='" + selected + "'>";
		html[2] = "<div class='select2-container select2-container-multi form-control select2'" + attrHtml + ">";
		html[3] = "<div id='" + selectedFieldId + "' class='select2-choices util-btn-margin-top-7 util-btn-margin-right-3'>";
		html[4] = "<span class='btn btn-xs green-jungle cursor-default'>已选择</span>";
		html[5] = "<span class='btn btn-xs dark disabled' data-info='tip'>单击选择下方选项，可多选</span></div></div>";
		html[6] = "<div id='" + unselectFieldId + "'class='util-btn-margin-top-7 util-btn-margin-right-3'>";
		html[7] = "</div></div>";
		// 生成tagHtml
		var tagsInfo = elementData['tagsInfo'];
		var tagHtml = '';
		$.each(tagsInfo, function(index, tag) {
			var value = tag.value;
			var title = tag.title;
			tagHtml += "<span class='btn btn-xs grey' value='" + value + "'>" + title + "</span>";
		});
		// 呈现Tag域
		$(this).replaceWith(html[0] + html[1] + html[2] + html[3] + html[4] + html[5] + html[6] + tagHtml + html[7]);
		// 绑定按钮事件
		$('#' + wrapperId + ' span.btn').on('click', function(e) {
			e.preventDefault();
			var tag = $(this);
			var tagValue = tag.attr('value');
			var wrapper = tag.closest('[id$=tag_field_wrapper]');
			var selectedField = wrapper.find('[id$=selected]');
			var unselectField = wrapper.find('[id$=unselect]');
			var placeholder = wrapper.find('span[data-info=tip]');
			var hiddenInput = wrapper.find('input[type=hidden]');
			var hiddenArr = hiddenInput.val() == '' ? new Array() : hiddenInput.val().split(',');
			// 根据元素状态执行系列动作
			if (tag.hasClass('grey')) {
				// 若tag域设置为disabled，则无动作
				if (wrapper.attr('disabled')) {
					return;
				}
				// 点击时状态为“未选中”，则转化为“选中”
				tag.addClass('blue').removeClass('grey');
				// 第一次添加Tag时，隐藏文字提示
				if (hiddenArr.length == 0) {
					placeholder.hide();
				}
				// 移至checked区块中
				selectedField.append(tag);
				// 将id添加到隐含域中
				if (hiddenArr.indexOf(tagValue) == -1) {
					hiddenArr.push(tagValue);
					hiddenInput.val(hiddenArr);
				};
			} else if (tag.hasClass('blue')) {
				// 若tag域设置为disabled，则无动作
				if (wrapper.attr('disabled')) {
					return;
				}
				// 点击时状态为“选中”，则转化为“未选中”
				tag.addClass('grey').removeClass('blue');
				// 移至uncheck区块中
				unselectField.append(tag);
				// 将id从隐含域中去除
				if (hiddenArr.indexOf(tagValue) != -1) {
					hiddenArr.splice(hiddenArr.indexOf(tagValue), 1);
					hiddenInput.val(hiddenArr);
				}
				// 若没有任何tag被选中，则显示文字提示
				if (hiddenArr.length == 0) {
					placeholder.show();
				};
			};
		});
		// 根据隐含域内容，将tag移至checked区块中，并隐藏文字提示
		var selectedArr = selected == '' ? '' : selected.split(',');
		if (selectedArr.length > 0) {
			$('#' + selectedFieldId + ' span.btn.dark').hide();
			$.each($('#' + unselectFieldId + ' span.btn'), function(index, tag) {
				if (selectedArr.indexOf($(tag).attr('value')) != -1) {
					$(tag).addClass('blue').removeClass('grey');
					$('#' + selectedFieldId).append(tag);
				}
			});
		};
	};

	// 初始化模态框
	$.fn.initModal = function(options) {
		var the = $(this);
		var modalHeader = $('div.modal-header');
		var navBtns = modalHeader.find('button.btn-sm');
		// 绑定导航按钮事件
		navBtns.on('click', function(e) {
			e.preventDefault();
			var method = this.id.replace('_mode_btn', '');
			// 恢复所有按钮状态
			$.each(navBtns, function() {
				$(this).addClass('dark').removeClass('blue-madison');
			});
			// 设置当前按钮为选中状态
			$(this).addClass('blue-steel').removeClass('dark');
			// 恢复所有div为隐藏状态
			$.each($(this).closest('div.modal').find('div.form'), function() {
				$(this).hide();
			});
			// 显示对应div
			$('div[id^=' + method + ']').show();
			// 绑定确定按钮事件
			the.find('div.modal-footer button[data-info=sure]').unbind('click').on('click', function(e) {
				e.preventDefault();
				options.clickSureBtn(method);
			});
		});
	};
})(jQuery);