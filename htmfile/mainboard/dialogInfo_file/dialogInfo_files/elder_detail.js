var Detail = function() {
	// 变量定义
	var pageData = {};
	var basePath = '';
	var elderForm = $('#elder_form');

	// 初始化缓存
	var handlePageData = function() {
		// basePath
		basePath = location.origin;
		var ctx = $('#ctx').val();
		if (ctx != null && ctx != '' ) {
			basePath += ctx;
		}
	};

	// 初始化按钮
	var handleBtns = function() {
		// 保存
		$('#save_btn').on('click', function(e) {
			e.preventDefault();
			if (elderForm.valid()) {
				$.messager.confirm('操作提示', '确定要保存吗？', function(r) {
					if (r) {
						$.ajax({
							cache: true,
							type: "POST",
							url: basePath + '/elder/doSave',
							data: elderForm.formSerialize(),
							error: function(request) {
								$.messager.alert('操作提示', '操作失败！', 'error');
							},
							success: function(data) {
								if (data) {
									$.messager.alert('操作提示', '操作成功！', 'info', function() {
										window.close();
									});
								} else {
									$.messager.alert('操作提示', '操作失败！', 'error');
								}
							}
						});
					}
				});
			} else {
				// TODO 提示信息需细化
				// 姓名，身份证，地址，社区……
//				if ('' == cardId|| null ==cardId){
//					$.messager.alert('操作提示',"请填写身份证号！","info");
//					return;
//				}
				$.messager.alert('操作提示', '未填写关键信息，请检查表单！', 'error');
			}
		});
		// 身份证号存在时所显示的按钮事件
		// 确定按钮
		var idCardInput = $('#idCard');
		$('#idCard_div').on('click', 'button.btn.btn-xs.red', function(e) {
			var url = basePath + '/elder/showDetail';
			url += '?elderId=' + $.data['isExist_elderId'];
			window.open(url, "", "", "no");
			idCardInput.val('');
			idCardInput.trigger('blur');
		});
		// 取消按钮
		$('#idCard_div').on('click', 'button.btn.btn-xs.default', function(e) {
			idCardInput.val('');
			idCardInput.trigger('blur');
		});
	};

	// 初始化input
	var handleInput = function() {
		// 填充生日与年龄
		var _fillBirthAndAge = function(info) {
			var ageInput = $('#age');
			var birthInput = $('#birth');
			var arr = birthInput.find('input.form-control');
			var hidden = birthInput.find('input[type=hidden]');
			if (info.length != 0) {
				// 填充生日input
				$.each(arr, function(i) {
					$(arr[i]).val(info[i]);
				});
				// 转化为时间
				var date = new Date(info[0], (info[1] - 1), info[2]);
				var timeMills = date.getTime();
				// 填充hidden
				hidden.val(timeMills);
				// 填充年龄
				var currentDate = new Date();
				var ageDate = new Date();
				ageDate.setTime(currentDate.getTime() - timeMills);
				ageInput.val(ageDate.getFullYear() - 1970);
			} else {
				ageInput.val('');
				hidden.val('');
				$.each(arr, function(i) {
					$(arr[i]).val('');
				});
			}
			// 执行验证
			hidden.valid();
		};
		// 设置生日input
		var _setBirthInput = function() {
			var birthInput = $('#birth');
			var arr = birthInput.find('input.form-control');
			var hidden = birthInput.find('input[type=hidden]');
			// 设置数值
			if (hidden.val()) {
				var info = new Array();
				var date = new Date();
				date.setTime(hidden.val());
				info[0] = date.getFullYear();
				info[1] = date.getMonth() + 1;
				info[2] = date.getDate();
				$.each(arr, function(i) {
					$(arr[i]).val(info[i]);
				});
			} else {
				$('#age').val('');
				$.each(arr, function(i) {
					$(arr[i]).val('');
				});
			}
			// 绑定事件
			$.each(arr, function() {
				$(this).on('blur.page',function() {
					var info = new Array();
					$.each(arr, function(i) {
						info[i] = arr[i].value;
					});
					if (!info[1]) {
						info[1] = 1;
					}
					if (!info[2]) {
						info[2] = 1;
					}
					// 填充数值
					_fillBirthAndAge(info);
				});
			});
		};
		// 设置身份证号input
		var _setIdCardInput = function() {
			// 绑定事件
			$('#idCard').on('blur', function(e) {
				e.preventDefault();
				if ($(this).valid()) {
					var idCard = $(this).val();
					var info = new Array();
					if (idCard.length == 15) {
						info[0] = '19' + idCard.substring(6, 8);
						info[1] = idCard.substring(8, 10);
						info[2] = idCard.substring(10, 12);
					} else if (idCard.length == 18) {
						info[0] = idCard.substring(6, 10);
						info[1] = idCard.substring(10, 12);
						info[2] = idCard.substring(12, 14);
					}
					_fillBirthAndAge(info);
				}
			});
		};
		// 设置联系人input(紧急联系人，其他联系人1，其他联系人2)
		var _setLinkmanInput = function() {
			var inputArr = [ '#keyLinkman', '#linkman1', '#linkman2' ];
			$.each(inputArr, function(index, div) {
				var inputs = $(div).find('input.form-control');
				var hidden = $(div).find('input[type=hidden]');
				$.each($(div).find('input.form-control'), function(i, element) {
					var info = hidden.val() == '' ? new Array() : hidden.val().split(',');
					// 设置数值
					if (hidden.val() != '') {
						$(element).val(info[i]);
					}
					// 绑定事件
					$(this).on('blur.validate',function() {
						var count = 0;
						$.each(inputs, function(x, input) {
							info[x] = $(input).val();
							if (!info[x]) {
								hidden.val('');
								count ++;
							}
						});
						if (count == 0) {
							hidden.val(info);
						}
						hidden.valid();
					});
				});
			});
		};
		_setBirthInput();
		_setIdCardInput();
		_setLinkmanInput();
	};

	// 初始化下拉列表
	var handleSelect = function() {
		// 处理所有'select'标记，转化为下拉列表，并设置选定项
		var _initSelect = function() {
			$.each($('div[data-element-type=select]'), function() {
				$(this).initSelect({
					selectData: $.data['selectData'],
					// 级联方法定义
					region_changeRelateSelect: function(element) {
						var elementId = element.attr('id');
						var relativeAttrArr = element.attr('data-relative').split('.');
						var namespace = relativeAttrArr[0];
						var relativeIndex = parseInt(relativeAttrArr[1]);
						var relativeArr = $.data['selectData'][namespace + '_arr'];
						var elementDataName = elementId + '_relative';
						if (element.val() != $.data['selectData'][elementDataName]) {
							// 更新缓存信息
							$.data['selectData'][elementDataName] = element.val();
							// 清空次级下拉列表
							var cleanArr = relativeArr.slice(relativeIndex + 1, relativeArr.length);
							if (cleanArr) {
								$.each(cleanArr, function(i, cleanRegion) {
									var optionHtml = "<option value=''>--</option>";
									$('#' + cleanRegion).empty().append(optionHtml).attr('disabled', true);
								});
							}
							// 填充次级下拉列表
							if (relativeArr[relativeIndex + 1]) {
								var nextSelect = $('#' + relativeArr[relativeIndex + 1]);
								var pidInfo = element.val();
								if (pidInfo) {
									$.ajax({
										async: false,
										url: basePath + '/elder/getRegion',
										type: 'post',
										data: {
											regionPid: pidInfo
										},
										dataType: 'json',
										success: function(regionList) {
											// 级联填充
											var optionHtml = "<option value=''>--</option>";
											$.each(regionList, function(i, region) {
												var value = region.value;
												var title = region.title;
												optionHtml += "<option value='" + value + "'>" + title + "</option>";
											});
											nextSelect.empty().append(optionHtml).removeAttr('disabled');
										},
									});
								}
							}
						}
					}
				});
			});
		};
		// 设置联系人select(紧急联系人，其他联系人1，其他联系人2)
		var _setLinkmanSelect = function() {
			var selectArr = [ '#keyLinkman', '#linkman1', '#linkman2'];
			$.each(selectArr, function(index, div) {
				var hidden = $(div).find('input[type=hidden]');
				// 设置选定项
				$.each($(div).find('select option'), function() {
					var info = hidden.val() == '' ? new Array() : hidden.val().split(',');
					if ($(this).val() == info[3]) {
						$(this).attr('selected', 'selected');
					};
				});
				// 绑定事件
				$(div).find('select').on('blur', function() {
					var info = hidden.val() == '' ? new Array() : hidden.val().split(',');
					var value = $(this).find('option:selected').attr('value');
					if (value) {
						info[3] = value;
					} else {
						info.length --;
					}
					hidden.val(info);
				});
			});
		};
		_initSelect();
		_setLinkmanSelect();
	};

	// 初始化Tag域
	var handleTagField = function() {
		// 处理所有'tag-field'标记，转化为Tag域，绑定Tag按钮事件，并设置选定项
		$.each($('div[data-element-type=tag-field]'), function() {
			$(this).initTagField();
		});
	};

	// 初始化信息验证
	var handleValidate = function() {
		// 添加验证规则
		var msg = '';
		msg += "该身份证号已存在，是否查看该老人详情？";
		msg += "<button type='button' class='btn btn-xs red margin-left-20'>确定</button>";
		msg += "<button type='button' class='btn btn-xs default margin-left-10'>取消</button>";
		$.validator.addMethod("isExistValidate", function(value, element) {
			var _isExistValidate = function(idCard) {
				if (!$.data['idCard_validate']) {
					$.data['idCard_validate'] = new Array();
				}
				var errorInfo = $.data['idCard_validate'][idCard] == null ? 'none' : $.data['idCard_validate'][idCard];
				var result = errorInfo;
				if (errorInfo == 'none') {
					result = true;
					$.ajax({
						async: false,
						url: basePath + '/elder/queryByIdCard',
						type: 'post',
						data: {
							'idCard': idCard,
						},
						dataType: 'json',
						error: function(request) {
							result = false;
							msg = '连接错误';
						},
						success: function(elderArr) {
							if (elderArr) {
								var existCount = 0;
								var sameFlag = false;
								for (var i = 0, lenth = elderArr.length; i < lenth; i++) {
									if (elderArr[i].status != 'del') {
										existCount++;
									}
									var elderId = $('#elderId').val();
									if (elderArr[i].id == elderId) {
										sameFlag = true;
									}
								}
								if (existCount > 0) {
									$.data['isExist_elderId'] = elderArr[0].id;
									result = false;
								}
								if (sameFlag) {
									result = true;
								}
							}
						},
					});
				}
				// 更新缓存数据
				if ($.data['idCard_validate'][idCard] != result) {
					$.data['idCard_validate'][idCard] = result;
				}
				return result;
			};
			return this.optional(element) || _isExistValidate(value);
		}, msg);
		// 验证规则
		Validator().init();
		var elderValidateRules = {
			rules: {
				'name': {
					required: true
				},
				// 身份证与老年优待证，其中之一必填
				'idCard': {
					require_from_group: [1, '#idCard, #cardNum'],
					idCardFormat: true,
					isExistValidate: true
				},
				// 身份证与老年优待证，其中之一必填
				'cardNum': {
					require_from_group: [1, '#idCard, #cardNum'],
					rangelength: [8, 8],
					digits: true
				},
				'birth': {
					required: true
				},
				'mobile': {
					mobile: true
				},
				'address': {
					required: true
				},
				// 省份
				// 城市
				// 城区
				'streetId': {
					notEqualsTo: ''
				},
				'communityId': {
					notEqualsTo: ''
				},
				'keyLinkman': {
					required: true
				}
			},
			// 错误信息
			messages: {
				'name': {
					required: '必须输入姓名'
				},
				'idCard': {
					require_from_group: '必须输入身份证号或者老年优待证号',
				},
				'cardNum': {
					require_from_group: '必须输入身份证号或者老年优待证号',
					rangelength: '老年优待证号输入错误，必须为8位数字',
					digits: '老年优待证号输入错误，必须为8位数字',
				},
				'birth': {
					required: '必须输入身份证号或者出生日期'
				},
				'address': {
					required: '必须输入现居住地址'
				},
				'streetId': {
					notEqualsTo: '必须选择所在街道'
				},
				'communityId': {
					notEqualsTo: '必须选择所在社区'
				},
				'keyLinkman': {
					required: '信息不完整，请输入完整的直系亲属或监护人信息'
				}
			},
		};
		// 设置验证规则
		elderForm.validate(elderValidateRules);
		// 载入页面时就执行一次校验，高亮所有必填项
		elderForm.valid();
		// 处理所有'data-instant-valid'标记
		$.each($('[data-instant-valid=true]'), function() {
			$(this).instantValid();
		});
	};
	
	// 初始化结束操作
	var handleInitOver = function() {
		// 将表单信息保存到缓存中
		pageData['elder'] = $.fn.holdFormData(elderForm);
		// 设置显示模式
		if ($('#mode').val() == 'readonly') {
			// 点击查阅时为只读模式
			_formMode(elderForm, 'readonly');
		} else {
			// 其他情况下可修改
			_formMode(elderForm, 'update');
		}
		// 加载结束，显示页面
		$('div.page-content-wrapper').show();
		$('div.page-footer').show();
	};
	
	// 内部方法定义
	// 页面模式
	var _formMode = function(form, mode) {
		if (mode == 'update') {
			form.find('.form-control').removeAttr('disabled');
			// tag域
			form.find('[id$=tag_field_wrapper]').removeAttr('disabled');
			form.find('[id$=unselect]').show();
			// 更改tag域文字提示
			$.each(form.find('span[data-info=tip]'), function() {
				$(this).text('单击选择下方选项，可多选');
			});
		} else if (mode == 'readonly') {
			form.find('.form-control').attr('disabled', true);
			// tag域
			form.find('[id$=tag_field_wrapper]').attr('disabled', true);
			form.find('[id$=unselect]').hide();
			// 更改tag域文字提示
			$.each(form.find('span[data-info=tip]'), function() {
				$(this).text('无');
			});
		}
	};

	return {
		// init方法
		init: function() {
			handlePageData();
			handleBtns();
			handleSelect();
			handleTagField();
			handleInput();
			handleValidate();
			handleInitOver();
		}
	};

}();