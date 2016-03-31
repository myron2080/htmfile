
// TODO 格式还需进一步修改，采用strict方式。
(function($) {
    var _default = {
        // 当项目url修改时，必须修改此处url。
        basePath: location.origin + '/takecare'
    };

    var _global = {
        basePath: _default.basePath,
        pageSize: 15,
        mainMenu: null,
        dictMap: {}
    };

    var _setDefaults = function(params, proto, defaults) {
        for (var arg in params) {
            defaults[arg] = params[arg];
        }
        for (var arg in defaults) {
            proto[arg] = defaults[arg];
        }
        return defaults;
    };

    var _setLocalArgs = function(params, proto) {
        for (var arg in params) {
            proto[arg] = params[arg];
        }
    };

    var _parseDictMap = function(dictMap) {
        // 组装dictMap对象
        var result = {};
        for (var item in dictMap){
            // 从dictMap获取字典数组
            var dictArr = dictMap[item];
            // 转化字典数组
            var parsedArr = [];
            for (var i = 0; i < dictArr.length; i ++) {
                var dictItem = dictArr[i];
                // 转化字典项
                var parsedItem = {};
                parsedItem.id = dictItem.TYPE_CODE + '_' + parsedItem.KIND_CODE;
                parsedItem.value = dictItem.KIND_CODE;
                parsedItem.title = dictItem.KIND_NAME;
                // 将转化好的字典项放入结果数组
                parsedArr[dictItem.IDX_NO - 1] = parsedItem;
            };
            // 将转化好的字典数组放入结果集
            result[item] = parsedArr;
        }
        return result;
    };

    var _parseColumn = function(element) {
        // 组装column对象
        var column = {};
        column.field = element.name;
        column.title = element.title;
        column.idx = element.idx;
        if (element.args) {
            if (element.args.width) column.width = element.args.width;
            if (element.args.rowspan) column.rowspan = element.args.rowspan;
            if (element.args.colspan) column.colspan = element.args.colspan;
            if (element.args.align) column.align = element.args.align;
            column.level = element.args.level ? element.args.level : 1;
        }
        return column;
    };

    var _parseSearchItem = function(element) {
        // 组装search对象
        var search = {};
        search.id = 'search-' + element.name;
        search.name = element.name;
        search.title = element.title;
        search.idx = element.idx;
        if (element.args) {
            if (element.args.type) search.type = element.args.type;
            if (element.args.dict) search.dict = element.dict;
            if (element.args.data) search.data = element.args.data;
            if (element.args.titleWidth) search.titleWidth = element.args.titleWidth;
            if (element.args.inputWidth) search.inputWidth = element.args.inputWidth;
        }
        return search;
    };

    var _parseToolbarItem = function(element) {
        // 组装toolbar对象
        var toolbar = {};
        toolbar.id = 'toolbar-' + element.name;
        toolbar.name = element.name;
        toolbar.title = element.title;
        toolbar.idx = element.idx;
        return toolbar;
    };

    var _parseShortcutItem = function(element) {
        // 组装shortcut对象
        var shortcut = {};
        shortcut.id = 'shortcut-' + element.name;
        shortcut.name = element.name;
        shortcut.title = element.title;
        shortcut.idx = element.idx;
        return shortcut;
    };

    // 需传递页面名称
    // 例程：
    // var pageData = $.frontEngine.initPageData();
    // 或
    // var pageData = $.frontEngine.initPageData({
    // 		pageName: 'elder_list'
    // });
    var initPageData = function(params) {
        var url = _default.basePath + '/common/getPageData';
        // 定义pageName
        var pageName = null;
        if (params && params.pageName && params.pageName != '') {
            pageName = params.pageName;
        }
        // 初始化pageData
        var pageData = {};
        // 获取菜单信息
        $.ajax({
            url: url,
            dataType: 'json',
            data: {
                pageName: pageName
            },
            async: false,
            success: function(result) {
                // 处理结果集
                if (typeof(result) != undefined) {
                    // basePath赋值
                    pageData.basePath = _global.basePath = location.origin + result.basePath;
                    // 字典数据
                    if (result.dictMap) {
                        pageData.dictMap = _global.dictMap = _parseDictMap(result.dictMap);
                    }
                    // 页面元素筛选分类
                    if (result.elementList) {
                        var elementList = result.elementList;
                        // 结果集
                        var columns = [];
                        var searchItems = [];
                        var toolbarItems = [];
                        var shortcutItems = [];
                        for (var i = 0; i < elementList.length; i++) {
                            var element = elementList[i];
                            var type = element.type;
                            if (type == "column") {
                                // 组装column对象
                                var column = _parseColumn(element);
                                // 将column放入数组
                                if (!columns[column.level - 1]) columns[column.level - 1] = [];
                                columns[column.level - 1][column.idx - 1] = column;
                            } else if (type == "search") {
                                // 组装search对象
                                var search = _parseSearchItem(element);
                                // 将search放入数组
                                searchItems[search.idx - 1] = search;
                            } else if (type == "toolbar") {
                                // 组装toolbar对象
                                var toolbar = _parseToolbarItem(element);
                                // 将toolbar放入数组
                                toolbarItems[toolbar.idx - 1] = toolbar;
                            } else if (type == "shortcut") {
                                // 组装shortcut对象
                                var shortcut = _parseShortcutItem(element);
                                // 将toolbar放入数组
                                shortcutItems[shortcut.idx - 1] = shortcut;
                            }
                        }
                        // 将结果放入pageData
                        if (columns.length > 0) pageData.columns = columns;
                        if (searchItems.length > 0) pageData.searchItems = searchItems;
                        if (toolbarItems.length > 0) pageData.toolbar = toolbarItems;
                        if (shortcutItems.length > 0) pageData.shortcutItems = shortcutItems;
                    }
                }
            }
        });
        return pageData;
    };

    var _appendSubMenu = function($parent, pid, defaults) {
        // 将defaults转化为本地变量。defaults内容：
        // { $iframe: $iframe, $mainSubmenu: $mainSubmenu }
        _setLocalArgs(defaults, this);
        // 拼装子菜单
        var menuItems = _global.mainMenu[pid];
        for (var i = 0; i < menuItems.length; i++) {
            var menuItem = menuItems[i];
            // 添加li
            var menuItemId = menuItem.menuId + '-li';
            var liHtml = '<li id="' + menuItemId + '"><span>' + menuItem.menuName + '</span></li>';
            $parent.append(liHtml);
            var $menuItem = $('#' + menuItemId);
            if (menuItem.url == null || menuItem.url == '') {
                // 无url情况下添加次级菜单
                var ulId = menuItem.menuId + '-submenu';
                var ulHtml = '<ul id="' + ulId + '"></ul>';
                $menuItem.append(ulHtml);
                _appendSubMenu($('#' + ulId), menuItem.menuId, defaults);
            } else {
                // 有url情况下跳转至url
                var menuId = menuItem.menuId;
                var menuUrl = _global.basePath + menuItem.url;
                menuUrl += menuUrl.indexOf('?') == -1 ? '?' : '&';
                menuUrl += 'menuId=' + menuId;
                $menuItem.on('click', {
                    url: menuUrl,
                    $iframe: $iframe,
                    $mainSubmenu: $mainSubmenu
                }, function(e) {
                    e.data.$iframe.attr('src', e.data.url);
                    e.data.$mainSubmenu.find('li').removeClass('active');
                    $(this).addClass('active');
                });
            }
        }
    };

    var initMainMenu = function(params) {
        // 默认值定义
        var defaults = _setDefaults(params, this, {
            // 菜单接口url
            url: _global.basePath + '/common/getMainMenu',
            // 根模块菜单
            rootMenuId: 'sys-nav-root-menu',
            $rootMenu: $('#sys-nav-root-menu'),
            // 主菜单
            mainMenuId: 'sys-nav-main-menu',
            $mainMenu: $('#sys-nav-main-menu'),
            // 主菜单题头
            mainHeaderId: 'sys-nav-main-header',
            $mainHeader: $('#sys-nav-main-header'),
            // 主菜单模块列
            mainModeListId: 'sys-nav-main-mode-list',
            $mainModeList: $('#sys-nav-main-mode-list'),
            // 模块子菜单
            mainSubmenuId: 'sys-nav-main-submenu',
            $mainSubmenu: $('#sys-nav-main-submenu'),
            // iframe
            iframeId: 'page-content-iframe',
            $iframe: $('#page-content-iframe')
        });

        // 获取菜单信息
        $.ajax({
            url: url,
            dataType: 'json',
            async: false,
            success: function(result) {
                _global.mainMenu = result;
            },
        });

        // 拼装根模块菜单层
        var rootMenuArr = _global.mainMenu['%root%'];
        var rootMenuUlId = rootMenuId + '-ul';
        var rootMenuHtml = '<ul id="' + rootMenuUlId + '"></ul>';
        $rootMenu.append(rootMenuHtml);
        var $rootMenuUl = $('#' + rootMenuUlId);
        for (var i = 0; i < rootMenuArr.length; i++) {
            var menuBtn = rootMenuArr[i];
            // 图片路径待修改
            var menuBtnHtml = '<li id="' + menuBtn.menuId + '" class="sys-nav-root-menu-li">' +
                '<img src="' + _global.basePath + '/pages/mainboard/img/' + menuBtn.menuIcon + '.png" />' + menuBtn.menuName +
                '</li>';
            $rootMenuUl.append(menuBtnHtml);
        }

        // 绑定根模块菜单层事件
        $rootMenu.on('click', 'li', function(e) {
            e.preventDefault();
            // 按钮高亮
            $rootMenu.find('li').removeClass('active');
            $(this).addClass('active');
            // 重置$mainMenu
            $mainModeList.empty();
            $mainSubmenu.empty();
            // 切换div
            $rootMenu.hide();
            $mainMenu.show();
            // 替换切换按钮内容
            $mainHeader.html($(this).clone());
            // 添加mainModeListUl
            var mainModeListUlId = $mainModeList[0].id + '-ul';
            var mainModeListUlHtml = '<ul id="' + mainModeListUlId + '" class="' + mainModeListUlId + '"></ul>';
            $mainModeList.append(mainModeListUlHtml);
            // 拼装主菜单导航
            var $mainModeListUl = $('#' + mainModeListUlId);
            var menuItems = _global.mainMenu[this.id];
            for (var i = 0; i < menuItems.length; i++) {
                var menuItem = menuItems[i];
                // 添加li
                var menuItemId = menuItem.menuId + '-li';
                var liHtml = '<li id="' + menuItemId + '">' +
                    '<img src="' + _global.basePath + '/pages/mainboard/img/' + menuItem.menuIcon + '.png" />' +
                    menuItem.menuName +
                    '</li>';
                $mainModeListUl.append(liHtml);
                // 呈现次级菜单
                var ulId = menuItem.menuId + '-submenu';
                var ulHtml = '<ul id="' + ulId + '" class="main-submenu main-submenu-vertical"></ul>';
                $mainSubmenu.append(ulHtml);
                _appendSubMenu($('#' + ulId), menuItem.menuId, {
                    $iframe: $iframe,
                    $mainSubmenu: $mainSubmenu
                });
            }
        });

        // 绑定主菜单导航事件
        $mainModeList.on('click', 'li', function(e) {
            e.preventDefault();
            var thisId = this.id;
            var submenuId = thisId.substring(0, thisId.lastIndexOf('-'));
            var $submenu = $('#' + submenuId + '-submenu');
            $mainSubmenu.find('ul.main-submenu').hide();
            $submenu.show();
        });

        // 绑定选择模式按钮事件
        $mainHeader.unbind('click').on('click', function(e) {
            e.preventDefault();
            $rootMenu.show();
            $mainMenu.hide();
        });
    };

    var initDatagrid = function(params, jq) {
        // 待删除
        var $datagrid = $(jq);
        // 变量定义
        $document = $(document);
        var defaults = _setDefaults(params, this, {
            shortcutId: 'datagrid-shortcut',
            $shortcut: $('#datagrid-shortcut')
        });

        // 使用循环，当外部params中有值则替换默认值。
        var pageSize = params.pageSize == null ? _global.pageSize : params.pageSize;
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
            pageList : [ _global.pageSize ],
            // 自适应宽度，防止水平滚动
            fitColumns : true,
            // 隔行变色
            striped : true,
            // 滚动条宽度
            scrollbarSize : 0,
            loadMsg : '加载中……',
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
                $shortcut.menu('show', {
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
                // TODO queryParams = $('#form-query').serializeObject();
                // TODO 需读取搜索栏内容，放入queryParams中
                queryParams.currentPage = pageNumber;
                queryParams.pageSize = pageSize;
                // ajax获取数据
                $.ajax({
                    url : url,
                    data : queryParams,
                    dataType : 'json',
                    success: function(result) {
                        console.log(typeof(result));
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
    // TODO initPageData通用封装，如读取_global.basePath,pageOperations,mainMenu
    // TODO 使用缓存读取operations
    // TODO 拆分为initToolBar,initSearch,initShortcut三个方法。
    // TODO 注意datagrid中涉及shortcut的相关操作，涉及缓存$document.data('rowData'),整行信息,$document.data('shortcutItem')
    var initDatagridMenu = function(params, jq) {
        // TODO 待删除
        $datagridMenu = $(jq);
        // 变量定义
        $document = $(document);
        var defaults = _setDefaults(params, this, {
            menuInfoId: 'datagrid-menu-info',
            $menuInfo: $('#datagrid-menu-info'),
            toolbarId: 'datagrid-toolbar-customize',
            $toolbar: $('#datagrid-toolbar-customize'),
            shortcutId: 'datagrid-shortcut',
            $shortcut: $('#datagrid-shortcut')
        });

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
            var className = 'btn btn-success datagrid-customize-btn';
            var html = '<input type="button" id="' + toolbarBtn.menuId + '" class="' + className +
                '" value="' + toolbarBtn.menuName + '"/>';
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
            $shortcut.menu('appendItem', {
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
//			$shortcut.remove();
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
     [{ field: 'name', title: '姓名' },
     { field: 'age', title: '年龄', title-width: 20, input-width: 50 },
     { field: 'regionId', title: '地区选择', type: 'region'（暂未开放）, title-width: 20, input-width: 50 },
     { field: 'birth', title: '出生日期', type: 'time'（暂未开放）, title-width: 20, input-width: 50 }]
     */
    var initSearch = function(params, jq) {
        var $search = $(jq);
        var defaults = _setDefaults(params, this, {
            titleWidth: 80,
            inputWidth: 200,

            datagridId: 'datagrid',
            $datagrid: $('#datagrid'),

            searchDivId: 'datagrid-search',
            $searchDiv: $('#datagrid-search'),

            searchBtnId: 'datagrid-search-btn',
            clearBtnId: 'datagrid-clear-search-btn',
        });

        if (!params.searchItems) return;

        console.log($search[0]);

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
            var itemId = "search-" + item.field;
            var titleWidth = item.titleWidth == null ? defaults.titleWidth : item.titleWidth;
            var inputWidth = item.inputWidth == null ? defaults.inputWidth : item.inputWidth;
            var html = "<div class='input-group' style='float: left;padding-left:15px;' >" +
                "<span class='input-group-addon' style='width:" + titleWidth + "px;'>" + item.title + "</span>" +
                "<input  type='text' id='" + itemId + "' name='" + item.field + "' class='form-control' placeholder='' style='width:" + inputWidth + "px;'/>" +
                "</div>";
            $search.append(html);
        }
    };

    // 初始化搜索框
    // TODO 输入参数：对象，json串
    var initSearch_building = function(params, jq) {
        var defaults = _setDefaults(params, this, {
            titleWidth: 80,
            inputWidth: 200,

            datagridId: 'datagrid',
            $datagrid: $('#datagrid'),

            searchDivId: 'datagrid-search',
            $searchDiv: $('#datagrid-search'),

            searchBtnId: 'datagrid-search-btn',
            clearBtnId: 'datagrid-clear-search-btn',

            toolbarId: 'datagrid-toolbar-customize',
            $toolbar: $('#datagrid-toolbar-customize'),

            searchAddInfo: 'datagrid-search-addinfo',
            $searchAddInfo: $('#datagrid-search-addinfo'),

            searchInfo: 'datagrid-search-info',
            $searchInfo: $('#datagrid-search-info')
        });

        if (!params.searchItems) return;

        // 添加待选区datagrid-search-addinfo、已选区datagrid-search-info
        var searchAddinfoHtml = "<div id='" + searchAddInfo + "' class='datagrid-search-addinfo'></div>";
        var searchInfoHtml = "<div id='" + searchInfo + "' class='datagrid-search-info' > </div>";
        $searchDiv.append(searchAddinfoHtml);
        $searchDiv.append(searchInfoHtml);

        // 添加日期控件浮层
//		timeInputDefault = {
//			id: ,
//			className: ,
//			width: ,
//		}
        var searchTimeHtml = "<div id='hideTimeEmpty' class='hideTimeEmpty' actionid='showTimeEmpty'>" +
            "<label>日期:</label>" +
            "<input id='year' actionid='showTimeEmpty' style='width: 50px;'>年" +
            "<input id='month' actionid='showTimeEmpty' tyle='width: 50px;'>月" +
            "<input id='day' actionid='showTimeEmpty' style='width: 50px;'>日" +
            "<input type='button' actionid='showTimeEmpty' class='btn btn-default action-ok-time' value='确认'></div>";
        $searchDiv.append(searchTimeHtml);

        // 添加搜索按钮
        var searchBtnHtml = "<input type='button' id='" + searchBtnId + "' class='btn btn-default' value='查询'/>";
        $toolbar.append(searchBtnHtml);

        // 绑定搜索按钮事件
        $('#' + searchBtnId).on('click', function(e) {
            e.preventDefault();
            // TODO 暂时只支持input。将所有input放入params中。
            var queryParams = {};
            var inputArr = $searchDiv.find('input');
            for (var i = 0; i < inputArr.length; i++) {
                if ($(inputArr[i]).val() != '' && inputArr[i].id != searchBtnId) {
                    eval("queryParams." + $(inputArr[i]).attr('name') + " = $(inputArr[i]).val();")
                }
            }
            $datagrid.datagrid('load', queryParams);
        });

        // 添加重置按钮
        var clearBtnHtml = "<input type='button' id='" + clearBtnId + "' class='btn btn-default' value='重置' />";
        $toolbar.append(clearBtnHtml);

        // 绑定重置按钮事件
        $('#' + clearBtnId).on('click', function(e) {
            e.preventDefault();
            $datagrid.datagrid('load', {});
        });

        // 组装选择区、待选区
        // radio选择
        var getradioID = "";
        for (var i = 0; i < searchItems.length; i++) {
            var item = searchItems[i];
            var titleWidth = item.titleWidth == null ? titleWidth: item.titleWidth;
            var inputWidth = item.inputWidth == null ? inputWidth: item.inputWidth;
            // 待选区元素
            var htmlPreInput = "";
            // 判断类型: input:普通输入框, single:单项选择, multiple:多项选择
            if (item.type == 'input' || item.type == 'date') {
                // type:input,普通文本输入
                htmlPreInput = "<div class='input-group' style='float:left;padding-left:15px;margin-bottom:3px;'>" +
                    "<span class='input-group-addon' style='width:" + titleWidth + "px;'>" + item.title + "</span>" +
                    "<input id='" + item.id + "' name='" + item.name + "' class='form-control' style='width:" + inputWidth + "px;' value='" + item.data + "'/>" +
                    "<input type='button' class='btn btn-default action-ok' value='确认'></div>";
            } else if (item.type == 'single' || item.type == 'multiple') {
                // type:single,单项选择
                htmlPreInput = "<div id='" + item.id + "' class='btn-group' data-toggle='buttons' style='padding-left:15px; margin-bottom:3px ;width: 100%'>" +
                    "<span class='input-group-addon' style='width:" + titleWidth + "px;line-height: 20px;float: left;'>" + item.title + "</span>";
                // 获取选项
                var options = _global.dictMap[item.dict];
                for (var x = 0; x < options; x++) {
                    var option = options[x];
                    htmlPreInput += "<label class='btn btn-primary' value='" + option.value + "'><input type='radio' name='options'>" + option.title + "</input></label>";
                }
                htmlPreInput += "</div>";
            }
            // 待选区输入框
            $searchInfo.append(htmlPreInput);
            // 搜索栏tag
            var htmlTag = "<div class='searchName " + item.id + "'>" +
                "<span class='' style='float:left;margin: 4px 4px 0px 2px;'>" + item.title + ":</span>" +
                "<label name='" + item.field + "' class='' style='padding:0px;margin:4px 4px 0px 2px;color:#F00B0B;'></label>" +
                "<input type='button' class='action-no' style='height:25px;border:none' value='X'></div>";
            // 搜索栏tag
            $searchAddInfo.append(htmlTag);
        }

        // 搜索栏事件绑定
        $('body').unbind('click').on('click', function(e) {
            e = e || window.event;
            var src = e.target || e.srcElement;
            if ($(src).attr('actionid') != "showTimeEmpty") {
                $("#hideTimeEmpty").attr("style", "display:none;position:absolute;background-color:#eee;z-index: 5000; padding: 10px;");
            }
        });

        // .datagrid-search
        $('.datagrid-search').mouseleave(function(e) {
            e = e || window.event;
            var src = e.target || e.toElement;
            if ($(src).attr('actionid') == "showTimeEmpty") return;
            $("#hideTimeEmpty").attr("style", "display:none;position:absolute;background-color:#eee;z-index: 5000; padding: 10px;");
        });

        // 时间输入框获取焦点
        $(".showTimeEmpty").unbind('focus').on('focus', function(e) {
            $("#year").val("");
            $("#month").val("");
            $("#day").val("");
            var mouseX = $(this).offset().left;
            var mouseY = $(this).offset().top + 34;
            $(document).data('inputTimeID', this.id);
            $("#hideTimeEmpty").attr("style", "display:inline-block;position:absolute;background-color:#eee;top:" + mouseY + "px;left:" + mouseX + "px;z-index: 5000; padding: 10px;");
        });

        // datagrid-search-addinfo
        $(".showTimeEmpty").unbind('blur').on('blur', function(e) {
            e.preventDefault();
            var focusname = window.event.fromElement;
        });

        // 时间确认按钮:action-ok-time
        $(".action-ok-time").unbind('click').on('click', function(e) {
            if (!_validTime($("#hideTimeEmpty"))) return;
            var year = $("#year").val();
            var month = $("#month").val();
            var day = $("#day").val();
            var getInputTimeID = $(document).data('inputTimeID');
            $("#" + getInputTimeID).val(year + "-" + month + "-" + day);
            $(this).parent().attr("style", "display:none;position:absolute;background-color: #eee; z-index: 5000; padding: 10px;");
        });
        getradioID = getradioID.substring(0, getradioID.length - 1);

        // 单选按钮事件
        $(getradioID).unbind('click').on('click', function(e) {
            var getid = $(this).parent().attr("id");
            $("." + getid).attr("style", "display:inline-block;float:left;margin:4px 4px;font-size:12px;");
            $("." + getid + " label").text($(this).text());
            $("." + getid + " input[type=hidden]").val($(this).parent().attr("id"));
            $(this).parent().attr("style", "display:none;padding-left:15px; margin-bottom:3px ;width: 100%;");
        });

        // 确认按钮
        $(".action-ok").unbind('click').on('click', function(e) {
            var getid = $(this).prev().attr("id");
            var getvalue = $(this).prev().val();
            if (getvalue == "") return;
            //   $("."+getid+" label").attr("text",getvalue);
            $("." + getid + " label").text(getvalue);
            $("." + getid).attr("style", "display:inline-block;float:left;margin:4px 4px;font-size:12px;");
        });

        // 移除按钮:输入框,复选框
        $(".action-no").unbind('click').on('click', function(e) {
            $(this).parent().attr("style", "display:none;float:left;margin:4px 4px;font-size:12px;");
            $(this).prev().text("");
        });

        // 单选和多选按钮移除
        $(".action-no-chick").unbind('click').on('click', function(e) {
            $(this).parent().attr("style", "display:none;float:left;margin:4px 4px;font-size:12px;");
            var getvalue = $(this).prev().val();
            $("#" + getvalue).attr("style", "display:inline-block;padding-left:15px;margin-bottom:3px;width: 100%");
            $(this).prev().prev().text("");
        });

        // 复选框按钮
        $(".action-ok-checkbox").unbind('click').on('click', function(e) {
            var getid = $(this).parent().attr("id");
            var getObject = $("#" + getid + " .active input[name=checkbox]");
            var getValue = "";
            for (var i = 0; i < getObject.length; i++) {
                var ob = getObject[i];
                var value = $(ob).parent().text();
                value = value.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                getValue = i < getObject.length - 1 ? value + ",": value;
            }
            $("." + getid + " label").text(getValue);
            $("." + getid).attr("style", "display:inline-block;float:left;margin:4px 4px;font-size:12px;");
        });

        // 复选框选择判断
        $(".checkbox-choose").unbind('click').on('click', function(e) {
            $(this).toggleClass('active');
        });
    };

    // 时间验证
    var _validTime = function (deadTimeDiv) {
        // 变量定义
        var result = false;
        var msg = '';
        var placement = 'bottom';
        var toggleObj;
        // 年,月,日
        var yearInput = deadTimeDiv.find('#year');
        var year = yearInput.val();
        var monthInput = deadTimeDiv.find('#month');
        var month = monthInput.val();
        var dayInput = deadTimeDiv.find('#day');
        var day = dayInput.val();
        // 时间变量
        var today = new Date();
        var deadTimeInput = deadTimeDiv.find('#deadTime');
        var deadTime = '';
        // 执行验证
        if (year == '') {
            toggleObj = 'year';
            msg = '必须输入年';
        } else if (!/^[0-9]{4}$/.test(year)) {
            toggleObj = 'year';
            msg = '年份格式错误';
        } else if (parseInt(year) > today.getFullYear() || parseInt(year) < 1900) {
            toggleObj = 'year';
            msg = '年份有误';
        }  else if (month == '') {
            toggleObj = 'month';
            msg = '必须输入月';
        } else if (!/^[1-9]|0[1-9]|1[0-2]$/.test(month)) {
            toggleObj = 'month';
            msg = '月份格式错误';
        } else {
            var intYear = parseInt(year);
            var intMonth = parseInt(month) - 1;
            deadTime = new Date(intYear, intMonth);
            if (deadTime > today) {
                toggleObj = 'month';
                msg = '月份有误';
            } else if (day != '') {
                if (!/^[0-9]|0[0-9]|[1-2][0-9]|3[0-1]$/.test(day)) {
                    result = false;
                    toggleObj = 'day';
                    msg = '日期格式错误';
                } else {
                    var intYear = parseInt(year);
                    var intMonth = parseInt(month) - 1;
                    var intDay = parseInt(day);
                    deadTime = new Date(intYear, intMonth, intDay);
                    if (deadTime > today) {
                        result = false;
                        toggleObj = 'day';
                        msg = '日期有误';
                    } else {
                        result = true;
                    }
                }
            } else {
                result = true;
            }
        }

        // 根据结果显示popover
        $('#year').tooltip('destroy');
        $('#month').tooltip('destroy');
        $('#day').tooltip('destroy');
        if (!result) {
            $('#' + toggleObj).tooltip({
                position: placement,
                content: msg
            });
            $('#' + toggleObj).tooltip('show');
        }
        // 返回结果
        return result;
    };

    var initToolbar = function(params, jq) {

    }

    var initShortcut = function(params, jq) {

    }

    var _appendAreaHtml = function(areaPid, level, defaults) {
        // 将defaults转化为本地变量。defaults内容：
        // { url: url, $areaContent: $areaContent, $areaName: $areaName, $selectedArea: $selectedArea }
        _setLocalArgs(defaults, this);
        // ajax获取数据
        var areaArr = [];
        $.ajax({
            type: 'POST',
            url: url,
            data: {
                pid: areaPid
            },
            async: false,
            dataType: 'json',
            success: function(result) {
                areaArr = result;
            },
        });
        if (!areaArr || areaArr.length == 0) return;
        // 拼装ul
        var ulId = 'area-level-' + level;
        var ulHtml = '<ul id="' + ulId + '" class="module-popupcity">';
        $areaContent.append(ulHtml);
        var $areaUl = $('#' + ulId);
        // 拼装地区列表
        var areaHtml = '';
        for (var i = 0; i < areaArr.length; i++) {
            var area = areaArr[i];
            areaHtml += "<li id='area-" + area.AREA_ID + "'><a>" + area.AREA_NAME + "</a></li>";
        }
        $areaUl.html(areaHtml);
        // 绑定地区单击事件
        $areaUl.on("click", "li", function() {
            // 点击后高亮
            $areaUl.find('li').removeClass('active');
            $(this).addClass('active');
            // 拼装地区全名
            var selectedArr = $areaContent.find('li.active');
            var areaNameArr = [];
            for (var i = 0; i < selectedArr.length; i++) {
                areaNameArr.push($(selectedArr[i]).children('a').html());
            }
            var areaFullName = areaNameArr.toString().replace(/,/g, ' ');
            $areaName.html(areaFullName);
            // 本级往下全部移除
            $areaUl.nextAll('ul').remove();
            // 呈现下级数据
            var areaId = $(this).attr('id').split('-')[1];
            var areaLevel = parseInt($(this).parent('ul').attr('id').split('-')[2]);
            _appendAreaHtml(areaId, areaLevel + 1, defaults);
            // 更新隐含域信息
            $selectedArea.val(areaId);
        });
    }

    // 初始化地区级联
    // 该方法放置于$.extends中，调用方法使用$.frontEngine.initAreaSelect();
    // TODO 根据用户所属地区id获取默认省市区
    // 仍有问题：
    // 1.样式调整，改为浮层
    // 2.已经选择的情况下，再次打开地区搜索框，则已输入的地区高亮。(解决方案：hiddenId不应写入default，根据inputId自动生成。其次，根据input内容，依次点击)。
    // 3.可能会有一个页面有两个input都有地区级联的情况
    var initAreaSelect = function(params, jq) {
        var defaults = _setDefaults(params, this, {
            // 地区接口url
            url: _global.basePath + '/common/getAreaListByPid',
            // 默认输入框
            areaInputId: 'area-input',
            $areaInput: $('#area-input'),

            selectedAreaId: 'selected-area',
            $selectedArea: $('#selected-area'),

            areaSelectDivId: 'area-select-div',
            $areaSelectDiv: $('#area-select-div'),

            areaContentId: 'area-content',
            areaNameId: 'area-name',

            okBtnId: 'area-select-ok-btn',
            cancelBtnId: 'area-select-cancel-btn',
        });

        // 生成地区级联选择区div
        var areaSelectDivHtml = "<table class='pop_dialog_table'>" +
            "<tr><td class='pop_topleft'></td><td></td><td class='pop_topright'></td></tr>" +
            "<tr>" +
            "<td></td>" +
            "<td class='pop_content'>" +
            "<h2><span>选择地区</span></h2>" +
            "<div class='dialog_content'>" +
            "<div id='" + areaContentId + "' class='dialog_body'></div>" +
            "<div class='dialog_buttons'>" +
            "<span id='" + areaNameId + "'></span>" +
            "<input type='button' id='" + okBtnId + "' class='dialog_button' value='确定' />" +
            "<input type='button' id='" + cancelBtnId + "' class='dialog_button' value='关闭' />" +
            "</div></div></td></tr>" +
            "<tr><td class='pop_bottomleft'></td><td></td><td class='pop_bottomright'></td></tr>" +
            "</table>";
        $areaSelectDiv.html(areaSelectDivHtml);
        var $areaContent = $('#' + areaContentId);
        var $areaName = $('#' + areaNameId);
        var $okBtn = $('#' + okBtnId);
        var $cancelBtn = $('#' + cancelBtnId);

        // 呈现省级数据
        _appendAreaHtml('root', 0, {
            url: url,
            $areaContent: $areaContent,
            $areaName: $areaName,
            $selectedArea: $selectedArea
        });

        // 绑定输入栏点击事件
        $areaInput.unbind('click').on('click', function(e) {
            $areaContent.find('a:eq(0)').click();
            $areaSelectDiv.show();
        });

        // 绑定确定按钮事件
        $okBtn.unbind('click').on('click', function(e) {
            $areaInput.val($areaName.text());
            $areaSelectDiv.hide();
        });

        // 绑定取消按钮事件
        $cancelBtn.unbind('click').on('click', function(e) {
            $areaContent.find('a:eq(0)').click();
            $areaSelectDiv.hide();
        });
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
     }/
     */
    // 显示windows
    var showWindow = function(params, jq) {
        var defaults = _setDefaults(params, this, {
            winId: 'win-div',
            $win: $('#win-div'),

            winIframeId: 'win-iframe',
            $winIframe: $('#win-iframe'),

            winLoadingId: 'win-loading',
            $winLoading: $('#win-loading'),
        });

        // 显示等待gif动画
        $winLoading.show();

        // 坐标定义
        console.log($(window).height());
        console.log($(window).width());
        var top = ($(window).height() - height)/2;
        var left = ($(window).width() - width)/2;

        // 初始化并显示winDialog
        $win.dialog({
            title: params.title,
            width: params.width,
            height: params.height,
            buttons: params.buttons,
            top: top,
            left: left,
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
                    left=xv/2+'px';
                    isMove = true;
                }
                /*if (top + params.height > $(window).height()) {
                 top = $(window).height() - params.height;
                 isMove = true;
                 }*/

                if (isMove) {
                    $win.dialog('move', {
                        left: '350px',
                        top: '55px'
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
        var defaults = _setDefaults(params, this, {
            winId: 'win-div',
            $win: $('#win-div')
        });
        $win.dialog('close');
    };

    var doSave = function(url, id) {
        var mainboard = parent;
        var editFrame = mainboard.window['win-iframe'];
        mainboard.$.messager.confirm('操作提示','确定要保存吗？',function(e){
            if (e){
                $.ajax({
                    type: "POST",
                    url: url,
                    data: editFrame.$('#editForm').serialize(),
                    async: false,
                    error: function(request) {
                        mainboard.$.messager.alert('操作提示',"操作失败！","error");
                    },
                    success: function(data) {
                        if (data && 'success' == data) {
                            mainboard.$.messager.alert('操作提示', '保存成功！', 'info', function() {
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
    var doRemove = function(url, $document) {
        // 获取父级
        var mainboard = parent;
        //获取操作行的信息
        var rowData= $document.data('rowData');
        //获取其ID
        var ids = rowData[0];
        // 执行删除操作
        mainboard.$.messager.confirm('操作提示', "确定要删除吗？", function(r) {
            if (r) {
                $.ajax({
                    type: "POST",
                    url: url,
                    data: "ids="+ids,
                    async: asynFlag,
                    dataType: "text",
                    error: function(data) {
                        mainboard.$.messager.alert('操作提示', "操作失败！", "error");
                    },
                    success: function(msg) {
                        if (data && "success" == data) {
                            mainboard.$.messager.alert('操作提示', "删除成功！", "info", function() {
                                mainboard.$.frontEngine.closeWindow();
                            });
                        } else {
                            mainboard.$.messager.alert('操作提示', "操作失败！", "error");
                        }
                    }
                });
            }
        });
    };

    /*
     * 修改方法
     */
    var doUpdateStatus = function(flag, type, $document) {
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
        mainboard.$.messager.confirm('操作提示', "确定要" + msgVal + "吗？", function(r) {
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
                    dataType: "text",
                    error: function(data){
                        mainboard.$.messager.alert('操作提示',"操作失败！","error");
                    },
                    success: function(msg){
                        if (data && "success" == data) {
                            mainboard.$.messager.alert('操作提示', msgVal + "成功！", "info", function() {
                                mainboard.$.frontEngine.closeWindow();
                            });
                        } else {
                            mainboard.$.messager.alert('操作提示', "操作失败！", "error");
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
        if (isEmpty(obj)) obj = document.getElementById('win-iframe').contentWindow.$("#" + id);
        if (isEmpty(validType) || validType == 1) {
            val = obj.val();
        } else if (validType == 2) {
            val = obj.combobox("getValue");
        } else if (validType == 3) {
            val = obj.combotree("getValue");
        }

        if (trim(val) == "") {
            if (isEmpty(icon)) icon = "warning";
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

    var executeAjax = function(url, pars, asynFlag) {
        var retMsg;
        // 是否执行同步 :false为同步
        if (!asynFlag) asynFlag = false;
        $.ajax({
            type: "POST",
            url: url,
            data: pars,
            async: asynFlag,
            dataType:"text",
            success: function(msg) {
                retMsg  = msg;
            },
            error: function(data) {
            }
        });
        return retMsg;
    }

    // ****************************************************************************************************
    // $.frontEngine.methodName形式调用
    // ****************************************************************************************************
    $.extend({
        frontEngine: {
            initPageData: function(params) {
                return initPageData(params);
            },
            initMainMenu: function(params) {
                return initMainMenu(params);
            },
            initAreaSelect: function(params) {
                return initAreaSelect(params);
            },
            initSearch: function(params) {
                return initSearch(params);
            },
            showWindow: function(params) {
                return showWindow(params);
            },
            closeWindow: function(params) {
                return closeWindow(params);
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
        initDatagrid: function(params, jq) {
            return initDatagrid(params, jq);
        },
        initDatagridMenu: function(params, jq) {
            return initDatagridMenu(params, jq);
        },
        initDialog: function(params, jq) {
            return initDialog(params, jq);
        },
        initSearch: function(params, jq) {
            return initSearch(params, jq);
        },
    };
}) (jQuery);