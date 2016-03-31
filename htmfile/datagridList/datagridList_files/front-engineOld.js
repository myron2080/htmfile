/**
 * ***************************************************************************
 * 前端页面js引擎
 * 
 * @创建日期 : 2015.05.28
 * @创建者 : 瞿博
 *      ***************************************************************************
 */
// TODO 格式还需进一步修改，采用strict方式。
// TODO 文档内容：$(document).data()页面缓存，保存内容：basePath,mainMenu,pageOperations(原datagridMenu)等
(function($) {
	var _globalDefaults = {
		pageSize : 15
	};
	
	var _appendSubMenu = function($parent, $iframe, basePath, mainMenu, pid) {
		var menuItems = mainMenu[pid];
		for (var i = 0; i < menuItems.length; i++) {
			// 拼装子菜单
			var menuItem = menuItems[i];
			// 添加li
			var menuItemId = menuItem.menuId + "-li";
			var liHtml = "<li id=" + menuItemId + "><span>" + menuItem.menuName + "</span></li>";
			$parent.append(liHtml);
			var $menuItem = $('#' + menuItemId);
			if (menuItem.url == null || menuItem.url == "") {
				// 无url情况下添加次级菜单
				var ulId = menuItem.menuId + "-submenu";
				var ulHtml = "<ul id=" + ulId + "></ul>";
				$menuItem.append(ulHtml);
				_appendSubMenu($('#' + ulId), $iframe, basePath, mainMenu, menuItem.menuId);
			} else {
				// 有url情况下跳转至url
				var menuId = menuItem.menuId;
				var menuUrl = basePath + menuItem.url;
				menuUrl += menuUrl.indexOf("?") == -1 ? "?" : "&";
				menuUrl += "menuId=" + menuId;
				$menuItem.on('click',{
					$iframe: $iframe,
					url: menuUrl
				}, function(e) {
					// TODO 灵活参数
					$iframe.attr('src', e.data.url);
					// 修改此处选择器
					/*$('#menu-main-submenu-div ul li').removeClass('lichangebgc').addClass('defaultbgc');*/
					$('#menu-main-submenu-div ul li').removeClass('lichangebgc');
					$(this).addClass('lichangebgc');
				});
			}
			
			$menuItem.on('mouseover',{
				$iframe: $iframe,
				url: menuUrl
			}, function(e) {
				var submenuId = this.id.substring(0, this.id.lastIndexOf('-'));
				$('#' + submenuId + '-submenu').attr('style','display:block;');
			
			});
			
			$menuItem.on('mouseout',{
				$iframe: $iframe,
				url: menuUrl
			}, function(e) {
				var submenuId = this.id.substring(0, this.id.lastIndexOf('-'));
				$('#' + submenuId + '-submenu').attr('style','display:none;');
			
			});

		}
	};
	
	// 需jquery-superfish插件支持，引入相关js、css文件
	// TODO 优化代码，使用jquery缓存，存储basePath、mainMenu、iframe等信息
	var initMainMenu = function(params, jq) {
		var $document = $(document);
		var defaults = {
			// 菜单信息
			menuInfoId: 'main-menu-info',
			// 根菜单div
			rootMenuId: 'menu-root-div',
			// 主体菜单div
			mainMenuId: 'menu-main-div',
			// 根菜单显示按钮div
			switchBtnId: 'menu-switch-btn-div',
			// 模块详情导航div
			mainNavId: 'menu-main-nav-div',
			// 模块子菜单div
			mainSubmenuId: 'menu-main-submenu-div',
			// iframe
			iframeId: 'page-content-iframe',
		};
		// TODO 若params为空或""，则使用默认设置
//		var menuInfoId = params.menuInfoId == null ? defaults.menuInfoId : params.menuInfoId;
		
		// 目标操作对象
		var $menu = $(jq);
		
		// 变量定义
		// 以下4个参数必须传入，若不设置则报错。
		var basePath = params.basePath;
		var $menuInfo = $('#' + defaults.menuInfoId);
		var $rootMenu = $('#' + defaults.rootMenuId);
		var $mainMenu = $('#' + defaults.mainMenuId);
		var $switchBtn = $('#' + defaults.switchBtnId);
		var $mainNav = $('#' + defaults.mainNavId);
		var $mainSubmenu = $('#' + defaults.mainSubmenuId);
		var $iframe = $('#' + defaults.iframeId);
		
		// 获取信息
		// TODO 待删除
		var str = $menuInfo.val();
		var mainMenu = $.parseJSON(str);
		$menuInfo.remove();
		
		// 拼装根菜单层
		var rootMenuArr = mainMenu['%root%'];
		var rootMenuUlId = defaults.rootMenuId + "-ul";
		var rootMenuHtml = "<ul id='" + rootMenuUlId + "' class='" + rootMenuUlId + "'></ul>";
		$rootMenu.append(rootMenuHtml);
		var $rootMenuUl = $('#' + rootMenuUlId);
		for (var i = 0; i < rootMenuArr.length; i++) {
			var menuBtn = rootMenuArr[i];
			// 图片路径待修改
			var menuBtnHtml = "<li id='" + menuBtn.menuId + "' class='menu-root-div-ul-li'>" +
				"<img src='" + basePath + "/pages/mainboard/img/" + menuBtn.menuIcon + ".png'>" + menuBtn.menuName +
				"</li>";
			$rootMenuUl.append(menuBtnHtml);
		}
		
		// 绑定根菜单层事件
		$rootMenu.on('click', 'li', {
			$rootMenu: $rootMenu,
			$mainMenu: $mainMenu,
			$mainNav: $mainNav,
			$mainSubmenu: $mainSubmenu,
			$switchBtn: $switchBtn,
			$iframe: $iframe,
			basePath: basePath,
			mainMenu: mainMenu
		}, function(e) {
			e.preventDefault();
			// 改变按钮颜色
			
			e.data.$rootMenu.find('li').removeClass('changebgc');
			$(this).addClass('changebgc');
			
			// 重置$mainMenu
			e.data.$mainNav.empty();
			e.data.$mainSubmenu.empty();
			// 添加mainNavUl
			var mainNavUlId = e.data.$mainNav[0].id + "-ul";
			var mainNavUlHtml = "<ul id='" + mainNavUlId + "' class='" + mainNavUlId + "'></ul>";
			e.data.$mainNav.append(mainNavUlHtml);
			// 切换div
			e.data.$rootMenu.hide();
			e.data.$mainMenu.show();
			// 替换切换按钮内容
			e.data.$switchBtn.html($(this).clone());
			// 拼装主体菜单导航
			var $mainNavUl = $('#' + mainNavUlId);
			var menuItems = e.data.mainMenu[this.id];
			for (var i = 0; i < menuItems.length; i++) {
				var menuItem = menuItems[i];
				// 添加li
				var menuItemId = menuItem.menuId + "-li";
				var liHtml = "<li id='" + menuItemId + "' class='" + menuItemId + "'>" +
					"<img src='" + basePath + "/pages/mainboard/img/" + menuItem.menuIcon + ".png'>" + menuItem.menuName +
					"</li>";
				$mainNavUl.append(liHtml);
				// 添加次级菜单
				var ulId = menuItem.menuId + "-submenu";
				var ulHtml = "<ul id=" + ulId + "  class='menu-submenu menu-submenu-vertical' ></ul>";
				e.data.$mainSubmenu.append(ulHtml);
				_appendSubMenu($('#'+ulId), $iframe, basePath, mainMenu, menuItem.menuId);
			}
		});
		
		// 绑定主体菜单导航事件
		$mainNav.on('click', 'li', {
			$mainSubmenu: $mainSubmenu,
			$iframe: $iframe,
			basePath: basePath,
			mainMenu: mainMenu
		}, function(e) {
			e.preventDefault();
			var submenuId = this.id.substring(0, this.id.lastIndexOf('-'));
			$mainSubmenu.find('ul').hide();
			$('#' + submenuId + '-submenu').show();
		});
		
		// 绑定选择模式按钮事件
		$switchBtn.unbind('click').on('click', function(e) {
			e.preventDefault();
			$rootMenu.show();
			$mainMenu.hide();
		});
	}
	
	var initDatagrid = function(params, jq) {
		// 待删除
		var $datagrid = $(jq);
		// 变量定义
		$document = $(document);
		var defaults = {
			shortcutId: 'datagrid-shortcut',
		};
		// TODO 若params为空或""，则使用默认设置
//		var shortcutId = params.shortcutId == null ? defaults.shortcutId : params.shortcutId;
		
		// 以下4个参数必须传入，若不设置则报错。
		var $shortcutMenu = $('#' + defaults.shortcutId);
		var url = params.url == null ? "" : params.url;
		var columns = params.columns;
		
		// 使用循环，当外部params中有值则替换默认值。
		var pageSize = params.pageSize == null ? _globalDefaults.pageSize : params.pageSize;
		var queryParams = params.queryParams == null ? {} : params.queryParams;
		queryParams.pageSize = pageSize;
		
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
			loadMsg : "加载中……",
			columns : columns,
			// 列表行单击事件
			onClickRow: function(rowIndex, rowData) {
			},
			// 列表行双击事件
			onDblClickRow: function(rowIndex, rowData) {
				// 缓存所指行
				$document.data('rowData', rowData);
				// 查看项目详情
				List.view();
			},
			// 列表行右键单击事件
			onRowContextMenu: function(e, rowIndex, rowData) {
				// 阻止浏览器捕获右键事件
				e.preventDefault();
				// 缓存所指行
				$document.data('rowData', rowData);
				// 显示右键菜单
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
			beforePageText: '第',
		    afterPageText: '页    共 {pages} 页', 
		    displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录',
			layout : [ 'first', 'prev', 'sep', 'manual', 'sep', 'next','last' ],
			// 分页跳转触发
			onSelectPage: function(pageNumber, pageSize) {
				// 加屏蔽
				$datagrid.datagrid('loading');
				// 设置参数
				// TODO queryParams = $("#form-query").serializeObject();
				// TODO 需读取搜索栏内容，放入queryParams中
				queryParams.currentPage = pageNumber;
				queryParams.pageSize = pageSize;
				// ajax获取数据
				$.ajax({
					url : url,
					data : queryParams,
					dataType : 'json',
					success: function(result) {
						$datagrid.datagrid('loadData', result);
						// 移除屏蔽
						$datagrid.datagrid('loaded');
					},
					error: function(err) {
						$.messager.alert('操作提示', '获取信息失败...请联系管理员!', 'error');
						// 移除屏蔽
						$datagrid.datagrid('loaded');
					}
				});
			}
		});
	};
	
	// 初始化datagridMenu
	// TODO initPageData通用封装，如读取basePath,pageOperations,mainMenu
	// TODO 使用缓存读取operations
	// TODO 拆分为initToolBar,initSearch,initShortcut三个方法。 
	// TODO 注意datagrid中涉及shortcut的相关操作，涉及缓存$document.data('rowData'),整行信息,$document.data('shortcutItem')
	var initDatagridMenu = function(params, jq) {
		// TODO 待删除
		$datagridMenu = $(jq);
		// 变量定义
		$document = $(document);
		var defaults = {
			menuInfoId: 'datagrid-menu-info',
			toolbarId: 'datagrid-toolbar-customize',
			shortcutId: 'datagrid-shortcut'
		};
		// TODO 若params为空或""，则使用默认设置
//		var menuInfoId = params.menuInfoId == null ? defaults.menuInfoId : params.menuInfoId;
		
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
				eval(e.data.url);
			});
		}
		
		// 添加快捷菜单项
//		if (shortcutOpts.length > 0) {
			for (var i = 0; i < shortcutArr.length; i++) {
				var shortcutItem = shortcutArr[i];
				$shortcutMenu.menu('appendItem', {
					text: shortcutItem.menuName,
				});
				var $menuItem = $('div.menu-item:eq(' + i + ')');
				$menuItem.attr('id', shortcutItem.menuId)
				$menuItem.on('click', {
					url: shortcutItem.url,
				}, function(e) {
					// 点击菜单项时，缓存菜单项
					$document.data('$shortcutItem', $(this));
					eval(e.data.url);
				});
			}
//		} else {
//			$shortcutMenu.remove();
//		}
	};

	// 初始化搜索框
	// TODO 第一版设计。之后需再修改
	/*
		设置规定
		标签:类别
		暂时只做input类型，下拉列表、地址选择、日期选择另行设计。
		title-width默认为20，input-width默认为50
		datagridId: 'datagridId',
		searchBtnId: 'datagrid-search-btn'(可省略),
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
	var initSearch = function(params, jq) {
		var defaults = {
			titleWidth: 80,
			inputWidth: 200,
			datagridId: 'datagrid',
			searchBtnId: 'datagrid-search-btn',
			clearBtnId: 'datagrid-clear-search-btn'
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
		/*for (var i = 0; i < searchItems.length; i++) {
			var item = searchItems[i];
			var itemId = "search-" + item.field;
			var titleWidth = item.titleWidth == null ? defaults.titleWidth : item.titleWidth;
			var inputWidth = item.inputWidth == null ? defaults.inputWidth : item.inputWidth;
			var html = "<div class='input-group' style='float: left;padding-left:15px; margin-bottom:3px ;' >" +
	         "<span class='input-group-addon' style='width:" + titleWidth + "px;'>" + item.title + "</span>" +
	         "<input  type='text' id='" + itemId + "' name='" + item.field + "' class='form-control' placeholder='' style='width:" + inputWidth + "px;'/>" +
	         "</div>";
			$search.append(html);
		}*/

		for (var i = 0; i < searchItems.length; i++) {
		 var item = searchItems[i];
		 var itemId = "search-" + item.field;
		 var titleWidth = item.titleWidth == null ? defaults.titleWidth : item.titleWidth;
		 var inputWidth = item.inputWidth == null ? defaults.inputWidth : item.inputWidth;

			<!--输入框  -->
		 var htmlInput = "<div class='input-group' style='float: left;padding-left:15px; margin-bottom:3px ;' >" +
		 "<span class='input-group-addon' style='width:" + titleWidth + "px;'>" + item.title + "</span>" +
		 "<input  type='text' id='" + itemId + "' name='" + item.field + "' class='form-control' placeholder='' style='width:" + inputWidth + "px;'/>" +
		 "<input type='button' class='btn btn-default action-ok' value='确认' ></div>";

			<!--隐藏的输入框 和下拉框,复选框隐藏域 -->
		var htmlOut = "<div class='input-group " + itemId + "' style='float: left;padding-left:15px; margin-bottom:3px ;' >" +
			"<span class='input-group-addon' style='width:" + titleWidth + "px;float:left;line-height: 20px'>" + item.title + "</span>" +
			"<input  type='text' id='" + itemId + "' name='" + item.field + "' class='form-control' placeholder='' readonly='readonly' style='width:" + inputWidth + "px;' value='' />" +
			"<input type='button' class='btn btn-default action-no' value='X'></div>";



/*

		<!-- 下拉菜单 -->
		var htmlSelect = "<div class='input-group' style='float: left;padding-left:15px; margin-bottom:3px ;' >" +
			"<span class='input-group-addon' style='width:" + titleWidth + "px;'>" + item.title + "</span>" +
			"<select id='" + itemId + "' name='" + item.field + "' style='width:" + inputWidth + "px;padding: 6px 12px;font-size: 14px;font-weight: 400; color: #555;text-align: center;background-color: #ffffff;border: 1px solid #eee;'>"+
			"<option>aaaaaaaaaaaaaaaaaaaaaaaaa</option><option>bb</option><option>cc</option><option>dd</option><option>ee</option></select>"+
			"<input type='button' class='btn btn-default action-ok' value='确认' ></div>";

*/
			<!-- 单选多项-->
			var htmlRadiosInput ="<div id='" + itemId + "' class='btn-group' data-toggle='buttons' style='padding-left:15px; margin-bottom:3px ;width: 100%'>"+
			"<span class='input-group-addon' style='width:" + titleWidth + "px;line-height: 20px;'>" + item.title + "</span>" +
					//这里从数据库拿值,然后循环取值
					//"<label class='btn btn-primary '><input type='radio' name='options' > 家政服务</label>"+
				"<label class='btn btn-primary '><input type='radio' name='options' > 家政服务</label>"+
				"</div>";

			var htmlRadiosOut = "<div class='btn-group " + itemId + "' data-toggle='buttons' style='padding-left:15px; margin-bottom:3px ;'>" +
				"<span class='input-group-addon' style='width:" + titleWidth + "px;line-height: 20px;'>" + item.title + "</span>" +
				"<label class='btn btn-primary'><input type='radio' name='options' ></label>"+
				"<input type='hidden' value=''/><input type='button' class='btn btn-default action-no-chick'  value='X'></div>";


			<!--单选按钮  -->
		var htmlRadioInput = "<div id='" + itemId + "' class='btn-group' data-toggle='buttons' style='padding-left:15px; margin-bottom:3px ;width: 100%'>" +
			"<span class='input-group-addon' style='width:" + titleWidth + "px;line-height: 20px;float: left;'>" + item.title + "</span>" +
			"<label class='btn btn-primary'><input type='radio' name='options' > 是</label>"+
			"<label class='btn btn-primary'><input type='radio' name='options' > 否</label>"+
			"</div>";


		<!--隐藏的单选按钮 -->
		var htmlRadioOut = "<div class='input-group " + itemId + "' style='padding-left:15px; margin-bottom:3px ;' >" +
			"<span class='input-group-addon' style='width:" + titleWidth + "px;float:left;line-height: 20px'>" + item.title + "</span>" +
			"<label class='btn btn-primary'><input type='radio' name='options'></label>"+
			"<input type='button' class='btn btn-default action-no-chick' value='X'></div>";


			<!--  复选按钮-->
			var htmlRadioInput = "<div id='" + itemId + "' class='btn-group' data-toggle='buttons' style='padding-left:15px; margin-bottom:3px ;width: 100%'>" +
				"<span class='input-group-addon' style='width:" + titleWidth + "px;line-height: 20px;float: left;'>" + item.title + "</span>" +
					//这里从数据库拿值,然后循环取值
					// "<label class='btn btn-primary'><input type='checkbox'> 选项 1</label>"+
				"<label class='btn btn-primary'><input type='checkbox'> 选项 1</label>"+
				"<input type='button' class='btn btn-default action-ok-checkbox' value='确认'>"+
				"</div>";


			//搜索隐藏域
		$(".datagrid-search-addinfo").append();
		//搜索输入区
		$(".datagrid-search-info").append();

			//$search.append(html);

		}
	};
	
	/*
	 	html:
	 	<div id='dialog-div' class='easyui-dialog dialog-div' data-options='modal:true,closed:true' style='overflow:hidden;'>
		 	<div id='dialog-loading' name='dialog-loading' class='dialog-loading'>
		 		<img src='images/waiting/loading1.gif' align='absmiddle'>
		 	</div>
		 	<iframe id='dialog-iframe' name='dialog-iframe' frameBorder='0' scrolling='auto' style='width:100%;height:100%;' allowtransparency='true'></iframe>
	 	</div>
	 	传参:
		{
			dialogId: 'dialog-div',
			title: '普通对话框',
			width: '500px',
			height: '400px',
			url: '',
			buttons: [{
				text: '保存',
				handler: function() {
					save();
				}
			}, {
				text: '取消',
				handler: function() {
					closeWindow();
				}
			}],
			onClose: function(),
		}
	*/
	// 显示windows
	var showWindow = function(params, jq) {
		var defaults = {
			winId: 'win-div',
			winIframeId: 'win-iframe',
			winLoadingId: 'win-loading'
		};
		
		// 目标操作对象
		var $win = $('#' + defaults.winId);
		var $winIframe = $('#' + defaults.winIframeId);
		var $winLoading = $('#' + defaults.winLoadingId);
		
		// 显示等待gif动画
		$winLoading.show();
		
		// 初始化并显示winDialog
		$win.dialog({
			title: params.title,
			width: params.width,
			height: params.height,
			buttons: params.buttons,
			cache: false,
			modal: true,
			closed: true,
			onClose: function() {
				var onClose = params.onClose;
				try {
					$winIframe.attr('src', '');
					if (onClose) {
						if (typeof(onClose) != "function") {
							eval(onClose);
						} else {
							onClose();
						}
					}
				} catch (e) {};
			},
			onMove: function(left, top) {
				var isMove = false;
				/*if (params.width < $(window).width() || params.height < $(window).height()) {
				return;
				}*/
				if (left < 0) {
					left = 0
					isMove = true;
				}
				if (top < 0) {
					top = 0
					isMove = true;
				}
				if (left + params.width < $(window).width()) {
				//	left = $(window).width() - params.width;
					var xv = $(window).width() - params.width;
					left=xv/2+'px'
					isMove = true;
				}
				/*if (top + params.height > $(window).height()) {
					top = $(window).height() - params.height;
					isMove = true;
				}*/
				
				if (isMove) {
					$win.dialog('move', {
						left: left,
						top: '10%'
					});
				}
			/*	if (isMove) {
					$win.dialog('move', {
						left: '30%',
						top: '20%'
					});
				}*/

			}
		});
		
		// 显示url指向页面
		$winIframe.attr('src', params.url);
		$win.dialog('open');
		
		// 隐藏等待gif动画
		$winLoading.hide();
	};
	
	var closeWindow = function(params, jq) {
		var defaults = {
			winId: 'win-div',
		};
		$('#' + defaults.winId).dialog('close');
	};
	
	var doSave = function(url, id) {
		var mainboard = parent;
		var editFrame = mainboard.window['win-iframe'];
		mainboard.$.messager.confirm('操作提示','确定要保存吗？',function(e){
		    if (e){
		   	    $.ajax({
					cache: false,
					type: "POST",
					url: url,
					data: editFrame.$('#editForm').serialize(),
					async: false,
				    error: function(request) {
			            mainboard.$.messager.alert('操作提示',"操作失败！","error");
				    },
				    success: function(data) {
				    	if (data && 'success' == data){
				    		mainboard.$.messager.alert('操作提示', '保存成功！', 'info',function(){
				    			 // 暂时未用到该部分代码
//				    			 if(typeof(id) != 'undefined'){
//							         if ("" == id){
//							         	search();
//						         	 } else {
//						         	 	var listFrame = document.getElementById("listFrame").contentWindow;
//										listFrame.document.forms[0].submit();
//									 }
//				    			 }
				    			 mainboard.$.frontEngine.closeWindow();
				         	});
			         	} else {
			         		mainboard.$.messager.alert('操作提示',"操作失败！","error");
			         	}
				    }
				});
	         }
	     });
	};
	
	/*
	 * 删除方法
	 */
	var doRemove = function(url,$document) {
		// 获取父级
		var mainboard = parent;
		//获取操作行的信息
		var rowData= $document.data('rowData');
		//获取其ID
		var ids = rowData[0];
		console.log(ids);
		// 执行删除操作
		mainboard.$.messager.confirm('操作提示',"确定要删除吗？",function(r){
		    if (r){
			    $.ajax({
			    	   type: "POST",
			    	   url: url,
			    	   data: "ids="+ids,
			    	   async: asynFlag,
			    	   dataType:"text",
			    	   error:function(data) {
			    		   mainboard.$.messager.alert('操作提示',"操作失败！","error");
			    	   },
			    	   success: function(msg) {
					    	if (data && "success" == data){
					    		mainboard.$.messager.alert('操作提示',"删除成功！","info",function(){
					    			 mainboard.$.frontEngine.closeWindow();
					         	});
				         	}else{
				         		mainboard.$.messager.alert('操作提示',"操作失败！","error");
				         	}
			    	   }
			    	}); 
			}
		});
	};
	
	/*
	 * 修改方法
	 */
	var doUpdateStatus = function(flag,type,$document) {
		//获取父级
		var mainboard = parent;
		//获取操作行的信息
		var rowData= $document.data('rowData');
		//获取其ID
		var ids = rowData[0];
		var optMsg = "状态修改成功！";
		var msgVal = "启用";
		if (flag == 2)
			msgVal = "停用";
		if (flag == 3) {
			msgVal = "删除";
			optMsg = "删除成功！";
		}
		mainboard.$.messager.confirm('操作提示',"确定要"+ msgVal +"吗？", function(r) {
		    if (r) {
				//拼接参数
			    var params = "ids="+ids;
			    params += "&status="+flag;
			    params += "&type="+type;
			    $.ajax({
			    	   type: "POST",
			    	   url: "../common/updateStatus",
			    	   data: params,
			    	   async: false,
			    	   dataType:"text",
			    	   error:function(data){
			    		   mainboard.$.messager.alert('操作提示',"操作失败！","error");
			    	   },
			    	   success: function(msg){
					    	if (data && "success" == data){
					    		mainboard.$.messager.alert('操作提示',msgVal+"成功！","info",function(){
					    			 mainboard.$.frontEngine.closeWindow();
					         	});
				         	}else{
				         		mainboard.$.messager.alert('操作提示',"操作失败！","error");
				         	}
			    	   }
			    	}); 
			}
		});
	};
	
	var trim = function(str) {
		if (isEmpty(str)) return "";
		return str.replace(/(^\s*)|(\s*$)/g, "");	
	};
	
	//判断对象是否存在
	var isEmpty = function(obj) {
		return obj == null || obj == "" || obj == "null" || typeof(obj) == "undefined";
	};
	
	/**
	 * 校验数据是否为空
	 * param id:校验id
	 * param obj:校验对象
	 * param msg:提示信息
	 * param validType:校验类型（1文本框2普通下拉框3树状结构下拉框）默认为1
	 * param icon:提示图标(默认warning)
	 * param fn:回调函数
	 */
	var validData = function(id, msg, validType, obj, icon, fn) {
		var returnVal = true;
		var val = "";
		if (isEmpty(obj)) {
			obj = document.getElementById('win-iframe').contentWindow.$("#" + id);
		}
		if (isEmpty(validType) || validType == 1) {
			val = obj.val();
		} else if (validType == 2) {
			val = obj.combobox("getValue");
		} else if (validType == 3) {
			val = obj.combotree("getValue");
		}
		
		if (trim(val) == "") {
			if (isEmpty(icon)) {
				icon = "warning";
			}
			$.messager.alert('操作提示', msg, icon, function() {
				try {
					if (isEmpty(validType) || validType == 1) {
					 	obj.focus();
					} else if (validType == 2){
					 	obj.combobox().next('span').find('input').click();
					} else if (validType == 3){
						obj.combotree().next('span').find('input').click();
					}
				 	
				 	if (!isEmpty(fn)) {
				 		fn();
				 	}
			 	 } catch(e) {}
			});
		   	returnVal = false;
		}
		return returnVal;
	};
	
	var executeAjax=function(url, pars, asynFlag){
	 	var retMsg;
	    //是否执行同步 :false为同步
	    	if(!asynFlag){
	    		asynFlag=false;
	    	}
	    	$.ajax({
		    	   type: "POST",
		    	   url: url,
		    	   data: pars,
		    	   async: asynFlag,
		    	   dataType:"text",
		    	   success: function(msg){
		    	      retMsg  = msg;
		    	   },
		    	   error:function(data){
		    	   }
		    	}); 
	    	return retMsg;
	    }
	// ****************************************************************************************************
	// $.frontEngine.methodName形式调用
	// ****************************************************************************************************
	$.extend({
		frontEngine: {
			showWindow: function(params, jq) {
				return showWindow(params, jq);
			},
			closeWindow: function(params, jq) {
				return closeWindow(params, jq);
			},
			doSave: function(url, id) {
				return doSave(url, id);
			},
			doRemove: function(url, $document) {
				return doRemove(url, $document);
			},
			doUpdateStatus: function(flag, type, $document) {
				return doUpdateStatus(flag, type, $document);
			},
			validData: function(id, msg, validType, obj, icon, fn) {
				return validData(id, msg, validType, obj, icon, fn);
			},
			isEmpty: function(obj) {
				return isEmpty(obj);
			},
			trim: function(str) {
				return trim(str);
			},
			executeAjax: function(url, pars, asynFlag) {
				return executeAjax(url, pars, asynFlag);
			}
		}
	});
	
	// ****************************************************************************************************
	// $().frontEngine('methodName', params)形式调用
	// ****************************************************************************************************
	$.fn.frontEngine = function(methodName, params) {
		return $.fn.frontEngine.methods[methodName](params, this);
	};
	
	$.fn.frontEngine.methods = {
		initMainMenu: function(params, jq) {
			return initMainMenu(params, jq);
		},
		initDatagrid: function(params, jq) {
			return initDatagrid(params, jq);
		},
		initDatagridMenu: function(params, jq) {
			return initDatagridMenu(params, jq);
		},
		initSearch: function(params, jq) {
			return initSearch(params, jq);
		},
		initDialog: function(params, jq) {
			return initDialog(params, jq);
		}
	};
})(jQuery);



///*
// * 删除方法
// */
//function doRemove(url){
//	// 获取父级
//	var mainboard = parent;
//	// 获取id
//	//var ecForm = listFrame.document.all.ec;
//	//if(!checkSelect(ecForm.id,true))
//	//	return;
//	//获取操作行的信息
//	var rowData= $(document).data('rowData');
//	//获取其ID
//	var ids = rowData.id;
//	
//	console.log(ids);
//	// 执行删除操作
//	mainboard.$.messager.confirm('操作提示',"确定要删除吗？",function(r){
//	    if (r){
//	    	//此方法为复选框勾选模式删除,根据复选框选择的ID ,然后进行拼接
//		//	var ids = get_checkbox_values(ecForm.id,',');
//			/*function get_checkbox_values(objs,splits){
//				  var value="";
//				  if(splits == null || splits == "" || typeof(splits) == "undefined"){
//				  	  splits = ",";
//				  }
//				  if(objs.length){
//				       for(i = 0;i < objs.length; i++){
//				             if (objs[i].checked){
//				             	if (value != "") value += splits;
//							    value += objs[i].value;
//							 }
//				       }
//				   }
//				   else{
//				       value = objs.value;
//				   }
//				   	//try{
//					//   if(value.substring(value.length-splits.length)==splits){
//					//	   	  value = value.substring(0, value.length - splits.length);
//					//   }
//				  	// }catch(e){}
//				   
//				  return value; 
//				}*/
//			
//		    $.ajax({
//		    	   type: "POST",
//		    	   url: url,
//		    	   data: "ids="+ids,
//		    	   async: asynFlag,
//		    	   dataType:"text",
//		    	   error:function(data){
//		    		   mainboard.$.messager.alert('操作提示',"操作失败！","error");
//		    	   },
//		    	   success: function(msg){
//				    	if (data && "success" == data){
//				    		mainboard.$.messager.alert('操作提示',"删除成功！","info",function(){
//				    			// 暂时未用到该部分代码
////				    			if(typeof(id) != 'undefined'){
////							         if ("" == id){
////							         	search();
////						         	 } else {
////						         	 	var listFrame = document.getElementById("listFrame").contentWindow;
////										listFrame.document.forms[0].submit();
////									 }
////				    			 }
//				    			 mainboard.$.frontEngine.closeWindow();
//				         	});
//			         	}else{
//			         		mainboard.$.messager.alert('操作提示',"操作失败！","error");
//			         	}
//		    	   }
//		    	}); 
//		    
//		   // var urls = url;
//		  //  var params = "ids="+ids;
//		    // str 为操作返回结果信息
//		   // var str = executeAjax(urls,params,false);
//		    
//		   /* var retMsg;
//		    function ajaxCall(rurl, pars, asynFlag){
//		    	$.ajax({
//		    	   type: "POST",
//		    	   url: rurl,
//		    	   data: pars,
//		    	   async: asynFlag,
//		    	   dataType:"text",
//		    	   success: function(msg){
//		    	      retMsg  = msg;
//		    	   },
//		    	   error:function(data){
//		    	   }
//		    	}); 
//		    }
//		    //是否执行同步 :false为同步
//		    function executeAjax(url, pars, asynFlag){
//		    	if(!asynFlag){
//		    		asynFlag=false;
//		    	}
//		    	ajaxCall(url, pars, asynFlag);
//		    	return retMsg;
//		    }*/
//		  /*  if(str != 'error'){
//		    	pp.$.messager.alert('操作提示', "删除成功！", "info",function(){
//		    		var listFrame = document.getElementById("listFrame").contentWindow;
//					listFrame.document.forms[0].submit();
//		    	});
//			}else{
//				pp.$.messager.alert('操作提示',"操作失败！","error");
//			}*/
//		}
//	});
//}
//
//
//
///*
// * 修改方法
// */
//function doUpdateStatus(flag,type){
//	//获取父级
//	var mainboard = parent;
//	//获取ID
//	//var ecForm = listFrame.document.all.ec;
//	//判断是否多选,只能单选进行修改操作
//	//if(!checkSelect(ecForm.id,true))
//	//	return;
//	/**
//	 * checkSelect校验选择项
//	 * @param obj 校验对象
//	 * @param multiple 是否多选，默认false
//	 * @param multipleDesc 单选时提示前缀描述，如"XX只能选择一项"
//	 */
///*	function checkSelect(obj,multiple,multipleDesc){
//		var pp = parent;
//		var selectNum = check_obj(obj);
//		if(pp.isEmpty(multiple)){
//			multiple = false;
//		}
//		var msg = "请至少选择一项！";
//		if(selectNum <= 0){
//			if(!multiple)
//				msg = "请选择一项！";
//			pp.$.messager.alert('操作提示', msg, "warning");
//		    return false;
//		}
//		if(selectNum != 1 && !multiple){
//			msg = multipleDesc+"只能选择一项！";
//			pp.$.messager.alert('操作提示', msg, "warning");
//	        return false;
//	    }
//
//		return true;
//	}*/
//	//获取操作行的信息
//	var selectRow= $(document).data('rowData');
//	//获取其ID
//	var ids = selectRow.id;
//	console.log(ids);
//	
//	var optMsg = "状态修改成功！";
//	var msgVal = "启用";
//	if(flag == 2)
//		msgVal = "停用";
//	if(flag == 3){
//		msgVal = "删除";
//		optMsg = "删除成功！";
//	}
//	
//	mainboard.$.messager.confirm('操作提示',"确定要"+ msgVal +"吗？",function(r){
//	    if (r){
//	    	//此方法为复选框勾选模式删除,根据复选框选择的ID ,然后进行拼接  . 具体方法与上面一样
//			//var ids = get_checkbox_values(ecForm.id,',');
//			//var urls = "../common/updateStatus";
//			//拼接参数
//		    var params = "ids="+ids;
//		    params += "&status="+flag;
//		    params += "&type="+type;
//		    
//		    $.ajax({
//		    	   type: "POST",
//		    	   url: "../common/updateStatus",
//		    	   data: params,
//		    	   async: false,
//		    	   dataType:"text",
//		    	   error:function(data){
//		    		   mainboard.$.messager.alert('操作提示',"操作失败！","error");
//		    	   },
//		    	   success: function(msg){
//				    	if (data && "success" == data){
//				    		mainboard.$.messager.alert('操作提示',msgVal+"成功！","info",function(){
//				    			 if(typeof(id) != 'undefined'){
//							         if ("" == id){
//							         	search();
//						         	 } else {
//						         	 	var listFrame = document.getElementById("listFrame").contentWindow;
//										listFrame.document.forms[0].submit();
//									 }
//				    			 }
//				    			 mainboard.$.frontEngine.closeWindow();
//				         	});
//			         	}else{
//			         		mainboard.$.messager.alert('操作提示',"操作失败！","error");
//			         	}
//		    	   }
//		    	}); 
//		    
//		}
//	});
//}