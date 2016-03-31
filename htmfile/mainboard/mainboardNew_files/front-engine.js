/**
 * ***************************************************************************
 * 前端页面js引擎
 * 
 * @创建日期 : 2015.05.28
 * @创建者 : 瞿博
 *      ***************************************************************************
 */
// TODO 格式还需进一步修改，采用strict方式。
(function($) {
	var _globalDefaults = {
		pageSize : 15
	};
	
	// 待排序的数组
	// 排序字段名
	// TODO
	var _sort = function(arr, keyName) {
		// 快速排序实现
		return "";
	};
	
	var _appendSubMenu = function($parent, $iframe, basePath, mainMenu, pid) {
		var menuItems = mainMenu[pid];
		for (var i = 0; i < menuItems.length; i++) {
			// 拼装子菜单
			var menuItem = menuItems[i];
			// 添加li
			var menuItemId = menuItem.menuId + "_li";
			var liHtml = "<li id=" + menuItemId + "><a>" + menuItem.menuName + "</a></li>";
			$parent.append(liHtml);
			if (menuItem.url == null || menuItem.url == "") {
				// 无url情况下添加次级菜单
				var ulId = menuItem.menuId + "_submenu";
				var ulHtml = "<ul id=" + ulId + "></ul>";
				$('#' + menuItemId).append(ulHtml);
				_appendSubMenu($('#' + ulId), $iframe, basePath, mainMenu, menuItem.menuId);
			} else {
				// 有url情况下跳转至url
				// TODO id全部带_，不使用.。
				var menuId = menuItem.menuId;
				var menuUrl = basePath + menuItem.url;
				menuUrl += menuUrl.indexOf("?") == -1 ? "?" : "&";
				menuUrl += "menuId=" + menuId;
				$('#' + menuItemId).on('click',{
					$iframe: $iframe,
					url: menuUrl
				}, function(e) {
					// TODO 写成活的参数
//					$('#menu_submenu').superfish('hide');
					$iframe.attr('src', e.data.url);
				});
			}
		}
	};
	
	// 需jquery-superfish插件支持，引入相关js、css文件
	// TODO 优化代码，使用jquery缓存，存储basePath、mainMenu、iframe等信息
	var initMainMenu = function(jq, params) {
		var defaults = {
			menuInfoId: 'main_menu_info',
			modeNavId: 'menu_mode_nav',
			submenuId: 'menu_submenu',
			iframeId: 'page_content_iframe',
		};
		// TODO 若params为空或""，则使用默认设置
//		var menuInfoId = params.menuInfoId == null ? defaults.menuInfoId : params.menuInfoId;
		
		// 目标操作对象
		var $mainMenu = $(jq);
		
		// 变量定义
		// 以下4个参数必须传入，若不设置则报错。
		var basePath = params.basePath;
		var $menuInfo = $('#' + defaults.menuInfoId);
		var $modeNav = $('#' + defaults.modeNavId);
		var $submenu = $('#' + defaults.submenuId);
		var $iframe = $('#' + defaults.iframeId);
		
		// 获取信息
		// TODO 待删除
		var str = $menuInfo.val();
		var mainMenu = $.parseJSON(str);
		$menuInfo.remove();
		// 按菜单等级分类
		var mainMenuGroupByLevel = [];
		
		// 拼装模块选择层
		var modeNavArr = mainMenu['%root%'];
		var modeNavUlId = defaults.modeNavId + "_ul";
		var modeNavHtml = "<ul id='" + modeNavUlId + "' class='menu-mode-nav-ul'></ul>";
		$modeNav.append(modeNavHtml);
		for (var i = 0; i < modeNavArr.length; i++) {
			var modeBtn = modeNavArr[i];
			// 图片路径待修改
			var modeBtnHtml = "<li id='" + modeBtn.menuId + "' class='menu-mode-nav-li'>" +
				"<img src='" + basePath + "/pages/mainboard/img/" + modeBtn.menuIcon + ".png'>" + modeBtn.menuName +
				"</li>";
			$('#' + modeNavUlId).append(modeBtnHtml);
			// 绑定事件
			$('#' + modeBtn.menuId).on('click', {
				$submenu: $submenu,
				$iframe: $iframe,
				basePath: basePath,
				mainMenu: mainMenu
			}, function(e) {
				
				$('.menu-mode-nav-li').attr('style','background:#778899');
				$(this).attr('style','background:#4d5b69');
				
				e.preventDefault();
				// 重置$submenu
				e.data.$submenu.empty();
				// 即时拼装子菜单
				_appendSubMenu(e.data.$submenu, e.data.$iframe, e.data.basePath, e.data.mainMenu, this.id);
				// 初始化菜单
//				e.data.$submenu.superfish('show');
			});
		}
	}
	
	var initDatagrid = function(jq, params) {
		var defaults = {
			shortcutId: 'datagrid_shortcut',
		};
		// TODO 若params为空或""，则使用默认设置
//		var shortcutId = params.shortcutId == null ? defaults.shortcutId : params.shortcutId;
		
		// 目标操作对象
		var $datagrid = $(jq);
		console.log("initDatagrid_1");
		// 变量定义
		// 以下4个参数必须传入，若不设置则报错。
		var $shortcutMenu = $('#' + defaults.shortcutId);
//		var $datagridDialog = $('#' + params.datagridDialogId);
		var url = params.url == null ? "" : params.url;
		var columns = params.columns;
		// TODO 设置默认值，映射方法。
		// 使用循环，当外部params中有值则替换默认值。
		var pageSize = params.pageSize == null ? _globalDefaults.pageSize : params.pageSize;
		var queryParams = params.queryParams == null ? {} : params.queryParams;
		queryParams.pageSize = pageSize;
		console.log(url);
		console.log(columns);
		console.log(queryParams);
		// 初始化datagrid
		$datagrid.datagrid({
			// 请求路径
			url : url,
			queryParams : queryParams,
			// 只允许选中单行
			singleSelect : true,
			// 表头标题图片
			iconCls : 'icon-search',
			// 显示行号
			rownumbers : false,
			// 自动调整行距
			autoRowHeight : false,
			// 显示底部分页栏
			pagination : true,
			pageNumber : 1,
			// 每页显示的记录条数
			pageSize : pageSize,
			// 可以设置每页记录条数的列表
			pageList : [ _globalDefaults.pageSize ],
			// 自适应宽度，防止水平滚动
			fitColumns : true,
			// 隔行变色
			striped : true,
			// 滚动条宽度
			scrollbarSize : 0,
			loadMsg : "正努力为您加载中......",
			columns : columns,
			// 单元格单击事件
			onClickCell : function() {
			},
			// TODO 单元格双击事件
			onDblClickCell : function(index, field, v) {
//				alert("双击事件，待修改");
//				var listprice = $(this).datagrid("getRows")[index].listprice;
//				$shortcutMenu.menu('hide');
//				$datagridDialog.dialog('open');
			},
			 // 单元格右键单击事件
			onRowContextMenu : function(e, rowIndex, rowData) {
				// 阻止浏览器捕获右键事件
				e.preventDefault();
				var mouseX = event.clientX;
				var mouseY = event.clientY;
				$shortcutMenu.menu('show', {
					left : mouseX + 2,
					top : mouseY
				});
			}
		});
		// 设置分页控件
		var pager = $datagrid.datagrid('getPager');
		$(pager).pagination({
			// 页数文本框前显示的汉字
			beforePageText: '第',//页数文本框前显示的汉字 
		    afterPageText: '页    共 {pages} 页', 
		    displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录', 
			layout : [ 'first', 'prev', 'sep', 'manual', 'sep', 'next','last' ],
			// 分页跳转触发
			onSelectPage : function(pageNumber, pageSize) {
				// 加屏蔽
				$datagrid.datagrid("loading");
				// 设置参数
				// TODO queryParams = $("#form-query").serializeObject();
				// TODO 需读取搜索栏内容，放入queryParams中
				queryParams.currentPage = pageNumber;
				queryParams.pageSize = pageSize;
				// ajax获取数据
				$.ajax({
					url : url,
					data : queryParams,
					dataType : "json",
					success : function(result) {
						$datagrid.datagrid('loadData', result);
						// 移除屏蔽
						$datagrid.datagrid("loaded");
					},
					error : function(err) {
						$.messager.alert('操作提示', '获取信息失败...请联系管理员!', 'error');
						// 移除屏蔽
						$datagrid.datagrid("loaded");
					}
				});
			}
		});
	};

	// 初始化datagridMenu
	var initDatagridMenu = function(jq, params) {
		var defaults = {
			menuInfoId: 'datagrid_menu_info',
			toolbarId: 'datagrid_toolbar_customize',
			shortcutId: 'datagrid_shortcut'
		};
		// TODO 若params为空或""，则使用默认设置
//		var menuInfoId = params.menuInfoId == null ? defaults.menuInfoId : params.menuInfoId;
		
		// 变量定义
		$datagridMenu = $(jq);
		
		// 变量定义
		// 以下3个参数必须传入，若不设置则报错。
		var $menuInfo = $('#' + defaults.menuInfoId);
		var $toolbar = $('#' + defaults.toolbarId);
		var $shortcutMenu = $('#' + defaults.shortcutId);

		// 获取信息
		// TODO 待删除
		var str = $menuInfo.val();
		var datagridMenu = $.parseJSON(str);
		$menuInfo.remove();
		// 按idx排序
//		datagridMenu = _sort(datagridMenu, 'idx');

		// 对菜单项进行分类
		var toolbarArr = [];
		var shortcutArr = [];
		for (var i = 0; i < datagridMenu.length; i++) {
			if (datagridMenu[i].menuType == 'toolbar') {
				toolbarArr.push(datagridMenu[i]);
			} else if (datagridMenu[i].menuType == 'shortcut') {
				shortcutArr.push(datagridMenu[i]);
			}
		}

		// 添加toolbar按钮
		for (var i = 0; i < toolbarArr.length; i++) {
			var toolbarBtn = toolbarArr[i];
			// TODO 此处应改为使用默认值
			var className = "btn btn-success datagrid-customize-btn";
			var html = "<input type='button' id='" + toolbarBtn.menuId + "' class='" + className +
				"' value='" + toolbarBtn.menuName + "' />";
			$toolbar.append(html);
			// 绑定事件
			$('#' + toolbarBtn.menuId).on('click', {
				url : toolbarBtn.url
			}, function(e) {
				this.url=toolbarBtn.url;
				eval(e.data.url);
			});
		}

		// 添加快捷菜单项
		for (var i = 0; i < shortcutArr.length; i++) {
			var shortcutBtn = shortcutArr[i];
			$shortcutMenu.menu('appendItem', {
				text: shortcutBtn.menuName,
				onclick: function() {
					eval(shortcutBtn.url);
				}
			});
		}
	};

	// 初始化搜索框
	// TODO 第一版设计。之后需再修改
	/*
		设置规定
		标签:类别
		暂时只做input类型，下拉列表、地址选择、日期选择另行设计。
		title-width默认为20，input-width默认为50
		datagridId: 'datagridId',
		searchBtnId: 'datagrid_search_btn'(可省略),
		searchItems:
		[{
			field: 'name',
			title: '姓名',
		},
		{
			field: 'age',
			title: '年龄',
			title-width: 20,
			input-width: 50
		},
		{
			field: 'regionId',
			title: '地区选择',
			type: 'region'（暂未开放）
			title-width: 20,
			input-width: 50
		},
		{
			field: 'birth',
			title: '出生日期',
			type: 'time'（暂未开放）
			title-width: 20,
			input-width: 50
		}]
	*/
	var initSearch = function(jq, params) {
		var defaults = {
			titleWidth: 80,
			inputWidth: 200,
			datagridId: 'datagrid',
			searchBtnId: 'datagrid_search_btn',
			clearBtnId: 'datagrid_clear_search_btn'
		};
		
		// 默认搜索条件，如listType
		if (params.searchItems == null) {
			return;
		}
		var $search = $(jq);
		var $datagrid = $('#' + defaults.datagridId);
		var searchItems = params.searchItems;
		var datagridId = params.datagridId == null ? defaults.datagridId : params.datagridId;
		var searchBtnId = params.searchBtnId == null ? defaults.searchBtnId : params.searchBtnId;
		var clearBtnId = params.clearBtnId == null ? defaults.clearBtnId : params.clearBtnId;
		
		
		// 添加搜索按钮
		var searchBtnHtml = "<input type='button' id='" + searchBtnId + "' class='btn btn-default' value='查询' />";
		$search.append(searchBtnHtml);
		// 绑定搜索按钮事件
		$('#' + searchBtnId).on('click', function(e) {
			e.preventDefault();
			// TODO 暂时只支持input。将所有input放入params中。
			var queryParams = {};
			var inputArr = $search.find('input');
			for (var i = 0; i < inputArr.length; i++) {
				if ($(inputArr[i]).val() != '' && inputArr[i].id != searchBtnId) {
					eval("queryParams." + $(inputArr[i]).attr('name') + " = $(inputArr[i]).val();")
				}
			}
			$datagrid.datagrid('load', queryParams); 
		});
		
		// 添加重置按钮
		var clearBtnHtml = "<input type='button' id='" + clearBtnId + "' class='btn btn-default' value='重置' />";
		$search.append(clearBtnHtml);
		// 绑定重置按钮事件
		$('#' + clearBtnId).on('click', function(e) {
			e.preventDefault();
			$datagrid.datagrid('load', {}); 
		});
		
		// 添加输入框
		for (var i = 0; i < searchItems.length; i++) {
			var item = searchItems[i];
			var itemId = "search_" + item.field;
			var titleWidth = item.titleWidth == null ? defaults.titleWidth : item.titleWidth;
			var inputWidth = item.inputWidth == null ? defaults.inputWidth : item.inputWidth;
			var html = "<div class='input-group' style='float: left;padding-left:15px;' >" +
	         "<span class='input-group-addon' style='width:" + titleWidth + "px;'>" + item.title + "</span>" +
	         "<input  type='text' id='" + itemId + "' name='" + item.field + "' class='form-control' placeholder='' style='width:" + inputWidth + "px;'/>" +
	         "</div>";
			$search.append(html);
		}
	};

	// 初始化dialog
	var initDialog = function(jq, params) {
		// 变量定义
		// TODO 设置默认值，映射方法。
		// 使用循环，当外部options中有值则替换默认值。
		var href = params.href == null ? "" : params.href;

		// 目标操作对象
		var $dialog = $(jq);

		$dialog.dialog({
			title : '详细信息',
			width : 700,
			height : 600,
			closed : true,
			cache : false,
			position : [ 'left', 'bottom' ],
			href : href,
			modal : true
		});

		// 定义dialog坐标
		// TODO
		$dialog.panel('move', {
			left : 100,
			top : 100
		});
	};

	$.fn.frontEngine = function(methodName, params) {
		return $.fn.frontEngine.methods[methodName](this, params);
	};

	$.fn.frontEngine.methods = {
		initMainMenu : function(jq, params) {
			return initMainMenu(jq, params);
		},
		initDatagrid : function(jq, params) {
			return initDatagrid(jq, params);
		},
		initDatagridMenu : function(jq, params) {
			return initDatagridMenu(jq, params);
		},
		initSearch : function(jq, params) {
			return initSearch(jq, params);
		},
		initDialog : function(jq, params) {
			return initDialog(jq, params);
		}
	};

})(jQuery);