
// TODO ��ʽ�����һ���޸ģ�����strict��ʽ��
(function($) {
    var _default = {
        // ����Ŀurl�޸�ʱ�������޸Ĵ˴�url��
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
        // ��װdictMap����
        var result = {};
        for (var item in dictMap){
            // ��dictMap��ȡ�ֵ�����
            var dictArr = dictMap[item];
            // ת���ֵ�����
            var parsedArr = [];
            for (var i = 0; i < dictArr.length; i ++) {
                var dictItem = dictArr[i];
                // ת���ֵ���
                var parsedItem = {};
                parsedItem.id = dictItem.TYPE_CODE + '_' + parsedItem.KIND_CODE;
                parsedItem.value = dictItem.KIND_CODE;
                parsedItem.title = dictItem.KIND_NAME;
                // ��ת���õ��ֵ������������
                parsedArr[dictItem.IDX_NO - 1] = parsedItem;
            };
            // ��ת���õ��ֵ������������
            result[item] = parsedArr;
        }
        return result;
    };

    var _parseColumn = function(element) {
        // ��װcolumn����
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
        // ��װsearch����
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
        // ��װtoolbar����
        var toolbar = {};
        toolbar.id = 'toolbar-' + element.name;
        toolbar.name = element.name;
        toolbar.title = element.title;
        toolbar.idx = element.idx;
        return toolbar;
    };

    var _parseShortcutItem = function(element) {
        // ��װshortcut����
        var shortcut = {};
        shortcut.id = 'shortcut-' + element.name;
        shortcut.name = element.name;
        shortcut.title = element.title;
        shortcut.idx = element.idx;
        return shortcut;
    };

    // �贫��ҳ������
    // ���̣�
    // var pageData = $.frontEngine.initPageData();
    // ��
    // var pageData = $.frontEngine.initPageData({
    // 		pageName: 'elder_list'
    // });
    var initPageData = function(params) {
        var url = _default.basePath + '/common/getPageData';
        // ����pageName
        var pageName = null;
        if (params && params.pageName && params.pageName != '') {
            pageName = params.pageName;
        }
        // ��ʼ��pageData
        var pageData = {};
        // ��ȡ�˵���Ϣ
        $.ajax({
            url: url,
            dataType: 'json',
            data: {
                pageName: pageName
            },
            async: false,
            success: function(result) {
                // ��������
                if (typeof(result) != undefined) {
                    // basePath��ֵ
                    pageData.basePath = _global.basePath = location.origin + result.basePath;
                    // �ֵ�����
                    if (result.dictMap) {
                        pageData.dictMap = _global.dictMap = _parseDictMap(result.dictMap);
                    }
                    // ҳ��Ԫ��ɸѡ����
                    if (result.elementList) {
                        var elementList = result.elementList;
                        // �����
                        var columns = [];
                        var searchItems = [];
                        var toolbarItems = [];
                        var shortcutItems = [];
                        for (var i = 0; i < elementList.length; i++) {
                            var element = elementList[i];
                            var type = element.type;
                            if (type == "column") {
                                // ��װcolumn����
                                var column = _parseColumn(element);
                                // ��column��������
                                if (!columns[column.level - 1]) columns[column.level - 1] = [];
                                columns[column.level - 1][column.idx - 1] = column;
                            } else if (type == "search") {
                                // ��װsearch����
                                var search = _parseSearchItem(element);
                                // ��search��������
                                searchItems[search.idx - 1] = search;
                            } else if (type == "toolbar") {
                                // ��װtoolbar����
                                var toolbar = _parseToolbarItem(element);
                                // ��toolbar��������
                                toolbarItems[toolbar.idx - 1] = toolbar;
                            } else if (type == "shortcut") {
                                // ��װshortcut����
                                var shortcut = _parseShortcutItem(element);
                                // ��toolbar��������
                                shortcutItems[shortcut.idx - 1] = shortcut;
                            }
                        }
                        // ���������pageData
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
        // ��defaultsת��Ϊ���ر�����defaults���ݣ�
        // { $iframe: $iframe, $mainSubmenu: $mainSubmenu }
        _setLocalArgs(defaults, this);
        // ƴװ�Ӳ˵�
        var menuItems = _global.mainMenu[pid];
        for (var i = 0; i < menuItems.length; i++) {
            var menuItem = menuItems[i];
            // ���li
            var menuItemId = menuItem.menuId + '-li';
            var liHtml = '<li id="' + menuItemId + '"><span>' + menuItem.menuName + '</span></li>';
            $parent.append(liHtml);
            var $menuItem = $('#' + menuItemId);
            if (menuItem.url == null || menuItem.url == '') {
                // ��url�������Ӵμ��˵�
                var ulId = menuItem.menuId + '-submenu';
                var ulHtml = '<ul id="' + ulId + '"></ul>';
                $menuItem.append(ulHtml);
                _appendSubMenu($('#' + ulId), menuItem.menuId, defaults);
            } else {
                // ��url�������ת��url
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
        // Ĭ��ֵ����
        var defaults = _setDefaults(params, this, {
            // �˵��ӿ�url
            url: _global.basePath + '/common/getMainMenu',
            // ��ģ��˵�
            rootMenuId: 'sys-nav-root-menu',
            $rootMenu: $('#sys-nav-root-menu'),
            // ���˵�
            mainMenuId: 'sys-nav-main-menu',
            $mainMenu: $('#sys-nav-main-menu'),
            // ���˵���ͷ
            mainHeaderId: 'sys-nav-main-header',
            $mainHeader: $('#sys-nav-main-header'),
            // ���˵�ģ����
            mainModeListId: 'sys-nav-main-mode-list',
            $mainModeList: $('#sys-nav-main-mode-list'),
            // ģ���Ӳ˵�
            mainSubmenuId: 'sys-nav-main-submenu',
            $mainSubmenu: $('#sys-nav-main-submenu'),
            // iframe
            iframeId: 'page-content-iframe',
            $iframe: $('#page-content-iframe')
        });

        // ��ȡ�˵���Ϣ
        $.ajax({
            url: url,
            dataType: 'json',
            async: false,
            success: function(result) {
                _global.mainMenu = result;
            },
        });

        // ƴװ��ģ��˵���
        var rootMenuArr = _global.mainMenu['%root%'];
        var rootMenuUlId = rootMenuId + '-ul';
        var rootMenuHtml = '<ul id="' + rootMenuUlId + '"></ul>';
        $rootMenu.append(rootMenuHtml);
        var $rootMenuUl = $('#' + rootMenuUlId);
        for (var i = 0; i < rootMenuArr.length; i++) {
            var menuBtn = rootMenuArr[i];
            // ͼƬ·�����޸�
            var menuBtnHtml = '<li id="' + menuBtn.menuId + '" class="sys-nav-root-menu-li">' +
                '<img src="' + _global.basePath + '/pages/mainboard/img/' + menuBtn.menuIcon + '.png" />' + menuBtn.menuName +
                '</li>';
            $rootMenuUl.append(menuBtnHtml);
        }

        // �󶨸�ģ��˵����¼�
        $rootMenu.on('click', 'li', function(e) {
            e.preventDefault();
            // ��ť����
            $rootMenu.find('li').removeClass('active');
            $(this).addClass('active');
            // ����$mainMenu
            $mainModeList.empty();
            $mainSubmenu.empty();
            // �л�div
            $rootMenu.hide();
            $mainMenu.show();
            // �滻�л���ť����
            $mainHeader.html($(this).clone());
            // ���mainModeListUl
            var mainModeListUlId = $mainModeList[0].id + '-ul';
            var mainModeListUlHtml = '<ul id="' + mainModeListUlId + '" class="' + mainModeListUlId + '"></ul>';
            $mainModeList.append(mainModeListUlHtml);
            // ƴװ���˵�����
            var $mainModeListUl = $('#' + mainModeListUlId);
            var menuItems = _global.mainMenu[this.id];
            for (var i = 0; i < menuItems.length; i++) {
                var menuItem = menuItems[i];
                // ���li
                var menuItemId = menuItem.menuId + '-li';
                var liHtml = '<li id="' + menuItemId + '">' +
                    '<img src="' + _global.basePath + '/pages/mainboard/img/' + menuItem.menuIcon + '.png" />' +
                    menuItem.menuName +
                    '</li>';
                $mainModeListUl.append(liHtml);
                // ���ִμ��˵�
                var ulId = menuItem.menuId + '-submenu';
                var ulHtml = '<ul id="' + ulId + '" class="main-submenu main-submenu-vertical"></ul>';
                $mainSubmenu.append(ulHtml);
                _appendSubMenu($('#' + ulId), menuItem.menuId, {
                    $iframe: $iframe,
                    $mainSubmenu: $mainSubmenu
                });
            }
        });

        // �����˵������¼�
        $mainModeList.on('click', 'li', function(e) {
            e.preventDefault();
            var thisId = this.id;
            var submenuId = thisId.substring(0, thisId.lastIndexOf('-'));
            var $submenu = $('#' + submenuId + '-submenu');
            $mainSubmenu.find('ul.main-submenu').hide();
            $submenu.show();
        });

        // ��ѡ��ģʽ��ť�¼�
        $mainHeader.unbind('click').on('click', function(e) {
            e.preventDefault();
            $rootMenu.show();
            $mainMenu.hide();
        });
    };

    var initDatagrid = function(params, jq) {
        // ��ɾ��
        var $datagrid = $(jq);
        // ��������
        $document = $(document);
        var defaults = _setDefaults(params, this, {
            shortcutId: 'datagrid-shortcut',
            $shortcut: $('#datagrid-shortcut')
        });

        // ʹ��ѭ�������ⲿparams����ֵ���滻Ĭ��ֵ��
        var pageSize = params.pageSize == null ? _global.pageSize : params.pageSize;
        var queryParams = params.queryParams == null ? {} : params.queryParams;
        queryParams.pageSize = pageSize;

        // ��ʼ��datagrid
        $datagrid.datagrid({
            // ����·��
            url : url,
            queryParams : queryParams,
            // ֻ����ѡ�е���
            singleSelect : true,
            // ��ͷ����ͼƬ
            iconCls : 'icon-search',
            // ��ʾ�к�
            rownumbers : false,
            // �Զ������о�
            autoRowHeight : false,
            // ��ʾ�ײ���ҳ��
            pagination : true,
            pageNumber : 1,
            // ÿҳ��ʾ�ļ�¼����
            pageSize : pageSize,
            // ��������ÿҳ��¼�������б�
            pageList : [ _global.pageSize ],
            // ����Ӧ��ȣ���ֹˮƽ����
            fitColumns : true,
            // ���б�ɫ
            striped : true,
            // ���������
            scrollbarSize : 0,
            loadMsg : '�����С���',
            columns : columns,
            // �б��е����¼�
            onClickRow: function(rowIndex, rowData) {
            },
            // �б���˫���¼�
            onDblClickRow: function(rowIndex, rowData) {
                // ������ָ��
                $document.data('rowData', rowData);
                // �鿴��Ŀ����
                List.view();
            },
            // �б����Ҽ������¼�
            onRowContextMenu: function(e, rowIndex, rowData) {
                // ��ֹ����������Ҽ��¼�
                e.preventDefault();
                // ������ָ��
                $document.data('rowData', rowData);
                // ��ʾ�Ҽ��˵�
                var mouseX = event.clientX;
                var mouseY = event.clientY;
                $shortcut.menu('show', {
                    left : mouseX + 2,
                    top : mouseY
                });
            }
        });

        // ���÷�ҳ�ؼ�
        var pager = $datagrid.datagrid('getPager');
        $(pager).pagination({
            // ҳ���ı���ǰ��ʾ�ĺ���
            beforePageText: '��',
            afterPageText: 'ҳ    �� {pages} ҳ',
            displayMsg: '��ǰ��ʾ {from} - {to} ����¼   �� {total} ����¼',
            layout : [ 'first', 'prev', 'sep', 'manual', 'sep', 'next','last' ],
            // ��ҳ��ת����
            onSelectPage: function(pageNumber, pageSize) {
                // ������
                $datagrid.datagrid('loading');
                // ���ò���
                // TODO queryParams = $('#form-query').serializeObject();
                // TODO ���ȡ���������ݣ�����queryParams��
                queryParams.currentPage = pageNumber;
                queryParams.pageSize = pageSize;
                // ajax��ȡ����
                $.ajax({
                    url : url,
                    data : queryParams,
                    dataType : 'json',
                    success: function(result) {
                        console.log(typeof(result));
                        $datagrid.datagrid('loadData', result);
                        // �Ƴ�����
                        $datagrid.datagrid('loaded');
                    },
                    error: function(err) {
                        $.messager.alert('������ʾ', '��ȡ��Ϣʧ��...����ϵ����Ա!', 'error');
                        // �Ƴ�����
                        $datagrid.datagrid('loaded');
                    }
                });
            }
        });
    };

    // ��ʼ��datagridMenu
    // TODO initPageDataͨ�÷�װ�����ȡ_global.basePath,pageOperations,mainMenu
    // TODO ʹ�û����ȡoperations
    // TODO ���ΪinitToolBar,initSearch,initShortcut����������
    // TODO ע��datagrid���漰shortcut����ز������漰����$document.data('rowData'),������Ϣ,$document.data('shortcutItem')
    var initDatagridMenu = function(params, jq) {
        // TODO ��ɾ��
        $datagridMenu = $(jq);
        // ��������
        $document = $(document);
        var defaults = _setDefaults(params, this, {
            menuInfoId: 'datagrid-menu-info',
            $menuInfo: $('#datagrid-menu-info'),
            toolbarId: 'datagrid-toolbar-customize',
            $toolbar: $('#datagrid-toolbar-customize'),
            shortcutId: 'datagrid-shortcut',
            $shortcut: $('#datagrid-shortcut')
        });

        // ��ȡ��Ϣ
        // TODO ��ɾ��
        var str = $menuInfo.val();
        var datagridMenu = $.parseJSON(str);
        $menuInfo.remove();

        // �Բ˵�����з���
        var toolbarArr = [];
        var shortcutArr = [];
        for (var i = 0; i < datagridMenu.length; i++) {
            if (datagridMenu[i].menuType == 'toolbar') {
                toolbarArr.push(datagridMenu[i]);
            } else if (datagridMenu[i].menuType == 'shortcut') {
                shortcutArr.push(datagridMenu[i]);
            }
        }

        // ���toolbar��ť
        for (var i = 0; i < toolbarArr.length; i++) {
            var toolbarBtn = toolbarArr[i];
            // TODO �˴�Ӧ��Ϊʹ��Ĭ��ֵ
            var className = 'btn btn-success datagrid-customize-btn';
            var html = '<input type="button" id="' + toolbarBtn.menuId + '" class="' + className +
                '" value="' + toolbarBtn.menuName + '"/>';
            $toolbar.append(html);
            // ���¼�
            $('#' + toolbarBtn.menuId).on('click', {
                url : toolbarBtn.url
            }, function(e) {
                eval(e.data.url);
            });
        }

        // ��ӿ�ݲ˵���
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
                // ����˵���ʱ������˵���
                $document.data('$shortcutItem', $(this));
                eval(e.data.url);
            });
        }
//		} else {
//			$shortcut.remove();
//		}
    };

    // ��ʼ��������
    // TODO ��һ����ơ�֮�������޸�
    /*
     ���ù涨
     ��ǩ:���
     ��ʱֻ��input���ͣ������б���ַѡ������ѡ��������ơ�
     title-widthĬ��Ϊ20��input-widthĬ��Ϊ50
     datagridId: 'datagridId',
     searchBtnId: 'datagrid-search-btn'(��ʡ��),
     searchItems:
     [{ field: 'name', title: '����' },
     { field: 'age', title: '����', title-width: 20, input-width: 50 },
     { field: 'regionId', title: '����ѡ��', type: 'region'����δ���ţ�, title-width: 20, input-width: 50 },
     { field: 'birth', title: '��������', type: 'time'����δ���ţ�, title-width: 20, input-width: 50 }]
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

        // ���������ť
        var searchBtnHtml = "<input type='button' id='" + searchBtnId + "' class='btn btn-default' value='��ѯ' />";
        $search.append(searchBtnHtml);
        // ��������ť�¼�
        $('#' + searchBtnId).on('click', function(e) {
            e.preventDefault();
            // TODO ��ʱֻ֧��input��������input����params�С�
            var queryParams = {};
            var inputArr = $search.find('input');
            for (var i = 0; i < inputArr.length; i++) {
                if ($(inputArr[i]).val() != '' && inputArr[i].id != searchBtnId) {
                    eval("queryParams." + $(inputArr[i]).attr('name') + " = $(inputArr[i]).val();")
                }
            }
            $datagrid.datagrid('load', queryParams);
        });

        // ������ð�ť
        var clearBtnHtml = "<input type='button' id='" + clearBtnId + "' class='btn btn-default' value='����' />";
        $search.append(clearBtnHtml);
        // �����ð�ť�¼�
        $('#' + clearBtnId).on('click', function(e) {
            e.preventDefault();
            $datagrid.datagrid('load', {});
        });

        // ��������
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

    // ��ʼ��������
    // TODO �������������json��
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

        // ��Ӵ�ѡ��datagrid-search-addinfo����ѡ��datagrid-search-info
        var searchAddinfoHtml = "<div id='" + searchAddInfo + "' class='datagrid-search-addinfo'></div>";
        var searchInfoHtml = "<div id='" + searchInfo + "' class='datagrid-search-info' > </div>";
        $searchDiv.append(searchAddinfoHtml);
        $searchDiv.append(searchInfoHtml);

        // ������ڿؼ�����
//		timeInputDefault = {
//			id: ,
//			className: ,
//			width: ,
//		}
        var searchTimeHtml = "<div id='hideTimeEmpty' class='hideTimeEmpty' actionid='showTimeEmpty'>" +
            "<label>����:</label>" +
            "<input id='year' actionid='showTimeEmpty' style='width: 50px;'>��" +
            "<input id='month' actionid='showTimeEmpty' tyle='width: 50px;'>��" +
            "<input id='day' actionid='showTimeEmpty' style='width: 50px;'>��" +
            "<input type='button' actionid='showTimeEmpty' class='btn btn-default action-ok-time' value='ȷ��'></div>";
        $searchDiv.append(searchTimeHtml);

        // ���������ť
        var searchBtnHtml = "<input type='button' id='" + searchBtnId + "' class='btn btn-default' value='��ѯ'/>";
        $toolbar.append(searchBtnHtml);

        // ��������ť�¼�
        $('#' + searchBtnId).on('click', function(e) {
            e.preventDefault();
            // TODO ��ʱֻ֧��input��������input����params�С�
            var queryParams = {};
            var inputArr = $searchDiv.find('input');
            for (var i = 0; i < inputArr.length; i++) {
                if ($(inputArr[i]).val() != '' && inputArr[i].id != searchBtnId) {
                    eval("queryParams." + $(inputArr[i]).attr('name') + " = $(inputArr[i]).val();")
                }
            }
            $datagrid.datagrid('load', queryParams);
        });

        // ������ð�ť
        var clearBtnHtml = "<input type='button' id='" + clearBtnId + "' class='btn btn-default' value='����' />";
        $toolbar.append(clearBtnHtml);

        // �����ð�ť�¼�
        $('#' + clearBtnId).on('click', function(e) {
            e.preventDefault();
            $datagrid.datagrid('load', {});
        });

        // ��װѡ��������ѡ��
        // radioѡ��
        var getradioID = "";
        for (var i = 0; i < searchItems.length; i++) {
            var item = searchItems[i];
            var titleWidth = item.titleWidth == null ? titleWidth: item.titleWidth;
            var inputWidth = item.inputWidth == null ? inputWidth: item.inputWidth;
            // ��ѡ��Ԫ��
            var htmlPreInput = "";
            // �ж�����: input:��ͨ�����, single:����ѡ��, multiple:����ѡ��
            if (item.type == 'input' || item.type == 'date') {
                // type:input,��ͨ�ı�����
                htmlPreInput = "<div class='input-group' style='float:left;padding-left:15px;margin-bottom:3px;'>" +
                    "<span class='input-group-addon' style='width:" + titleWidth + "px;'>" + item.title + "</span>" +
                    "<input id='" + item.id + "' name='" + item.name + "' class='form-control' style='width:" + inputWidth + "px;' value='" + item.data + "'/>" +
                    "<input type='button' class='btn btn-default action-ok' value='ȷ��'></div>";
            } else if (item.type == 'single' || item.type == 'multiple') {
                // type:single,����ѡ��
                htmlPreInput = "<div id='" + item.id + "' class='btn-group' data-toggle='buttons' style='padding-left:15px; margin-bottom:3px ;width: 100%'>" +
                    "<span class='input-group-addon' style='width:" + titleWidth + "px;line-height: 20px;float: left;'>" + item.title + "</span>";
                // ��ȡѡ��
                var options = _global.dictMap[item.dict];
                for (var x = 0; x < options; x++) {
                    var option = options[x];
                    htmlPreInput += "<label class='btn btn-primary' value='" + option.value + "'><input type='radio' name='options'>" + option.title + "</input></label>";
                }
                htmlPreInput += "</div>";
            }
            // ��ѡ�������
            $searchInfo.append(htmlPreInput);
            // ������tag
            var htmlTag = "<div class='searchName " + item.id + "'>" +
                "<span class='' style='float:left;margin: 4px 4px 0px 2px;'>" + item.title + ":</span>" +
                "<label name='" + item.field + "' class='' style='padding:0px;margin:4px 4px 0px 2px;color:#F00B0B;'></label>" +
                "<input type='button' class='action-no' style='height:25px;border:none' value='X'></div>";
            // ������tag
            $searchAddInfo.append(htmlTag);
        }

        // �������¼���
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

        // ʱ��������ȡ����
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

        // ʱ��ȷ�ϰ�ť:action-ok-time
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

        // ��ѡ��ť�¼�
        $(getradioID).unbind('click').on('click', function(e) {
            var getid = $(this).parent().attr("id");
            $("." + getid).attr("style", "display:inline-block;float:left;margin:4px 4px;font-size:12px;");
            $("." + getid + " label").text($(this).text());
            $("." + getid + " input[type=hidden]").val($(this).parent().attr("id"));
            $(this).parent().attr("style", "display:none;padding-left:15px; margin-bottom:3px ;width: 100%;");
        });

        // ȷ�ϰ�ť
        $(".action-ok").unbind('click').on('click', function(e) {
            var getid = $(this).prev().attr("id");
            var getvalue = $(this).prev().val();
            if (getvalue == "") return;
            //   $("."+getid+" label").attr("text",getvalue);
            $("." + getid + " label").text(getvalue);
            $("." + getid).attr("style", "display:inline-block;float:left;margin:4px 4px;font-size:12px;");
        });

        // �Ƴ���ť:�����,��ѡ��
        $(".action-no").unbind('click').on('click', function(e) {
            $(this).parent().attr("style", "display:none;float:left;margin:4px 4px;font-size:12px;");
            $(this).prev().text("");
        });

        // ��ѡ�Ͷ�ѡ��ť�Ƴ�
        $(".action-no-chick").unbind('click').on('click', function(e) {
            $(this).parent().attr("style", "display:none;float:left;margin:4px 4px;font-size:12px;");
            var getvalue = $(this).prev().val();
            $("#" + getvalue).attr("style", "display:inline-block;padding-left:15px;margin-bottom:3px;width: 100%");
            $(this).prev().prev().text("");
        });

        // ��ѡ��ť
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

        // ��ѡ��ѡ���ж�
        $(".checkbox-choose").unbind('click').on('click', function(e) {
            $(this).toggleClass('active');
        });
    };

    // ʱ����֤
    var _validTime = function (deadTimeDiv) {
        // ��������
        var result = false;
        var msg = '';
        var placement = 'bottom';
        var toggleObj;
        // ��,��,��
        var yearInput = deadTimeDiv.find('#year');
        var year = yearInput.val();
        var monthInput = deadTimeDiv.find('#month');
        var month = monthInput.val();
        var dayInput = deadTimeDiv.find('#day');
        var day = dayInput.val();
        // ʱ�����
        var today = new Date();
        var deadTimeInput = deadTimeDiv.find('#deadTime');
        var deadTime = '';
        // ִ����֤
        if (year == '') {
            toggleObj = 'year';
            msg = '����������';
        } else if (!/^[0-9]{4}$/.test(year)) {
            toggleObj = 'year';
            msg = '��ݸ�ʽ����';
        } else if (parseInt(year) > today.getFullYear() || parseInt(year) < 1900) {
            toggleObj = 'year';
            msg = '�������';
        }  else if (month == '') {
            toggleObj = 'month';
            msg = '����������';
        } else if (!/^[1-9]|0[1-9]|1[0-2]$/.test(month)) {
            toggleObj = 'month';
            msg = '�·ݸ�ʽ����';
        } else {
            var intYear = parseInt(year);
            var intMonth = parseInt(month) - 1;
            deadTime = new Date(intYear, intMonth);
            if (deadTime > today) {
                toggleObj = 'month';
                msg = '�·�����';
            } else if (day != '') {
                if (!/^[0-9]|0[0-9]|[1-2][0-9]|3[0-1]$/.test(day)) {
                    result = false;
                    toggleObj = 'day';
                    msg = '���ڸ�ʽ����';
                } else {
                    var intYear = parseInt(year);
                    var intMonth = parseInt(month) - 1;
                    var intDay = parseInt(day);
                    deadTime = new Date(intYear, intMonth, intDay);
                    if (deadTime > today) {
                        result = false;
                        toggleObj = 'day';
                        msg = '��������';
                    } else {
                        result = true;
                    }
                }
            } else {
                result = true;
            }
        }

        // ���ݽ����ʾpopover
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
        // ���ؽ��
        return result;
    };

    var initToolbar = function(params, jq) {

    }

    var initShortcut = function(params, jq) {

    }

    var _appendAreaHtml = function(areaPid, level, defaults) {
        // ��defaultsת��Ϊ���ر�����defaults���ݣ�
        // { url: url, $areaContent: $areaContent, $areaName: $areaName, $selectedArea: $selectedArea }
        _setLocalArgs(defaults, this);
        // ajax��ȡ����
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
        // ƴװul
        var ulId = 'area-level-' + level;
        var ulHtml = '<ul id="' + ulId + '" class="module-popupcity">';
        $areaContent.append(ulHtml);
        var $areaUl = $('#' + ulId);
        // ƴװ�����б�
        var areaHtml = '';
        for (var i = 0; i < areaArr.length; i++) {
            var area = areaArr[i];
            areaHtml += "<li id='area-" + area.AREA_ID + "'><a>" + area.AREA_NAME + "</a></li>";
        }
        $areaUl.html(areaHtml);
        // �󶨵��������¼�
        $areaUl.on("click", "li", function() {
            // ��������
            $areaUl.find('li').removeClass('active');
            $(this).addClass('active');
            // ƴװ����ȫ��
            var selectedArr = $areaContent.find('li.active');
            var areaNameArr = [];
            for (var i = 0; i < selectedArr.length; i++) {
                areaNameArr.push($(selectedArr[i]).children('a').html());
            }
            var areaFullName = areaNameArr.toString().replace(/,/g, ' ');
            $areaName.html(areaFullName);
            // ��������ȫ���Ƴ�
            $areaUl.nextAll('ul').remove();
            // �����¼�����
            var areaId = $(this).attr('id').split('-')[1];
            var areaLevel = parseInt($(this).parent('ul').attr('id').split('-')[2]);
            _appendAreaHtml(areaId, areaLevel + 1, defaults);
            // ������������Ϣ
            $selectedArea.val(areaId);
        });
    }

    // ��ʼ����������
    // �÷���������$.extends�У����÷���ʹ��$.frontEngine.initAreaSelect();
    // TODO �����û���������id��ȡĬ��ʡ����
    // �������⣺
    // 1.��ʽ��������Ϊ����
    // 2.�Ѿ�ѡ�������£��ٴδ򿪵�����������������ĵ���������(���������hiddenId��Ӧд��default������inputId�Զ����ɡ���Σ�����input���ݣ����ε��)��
    // 3.���ܻ���һ��ҳ��������input���е������������
    var initAreaSelect = function(params, jq) {
        var defaults = _setDefaults(params, this, {
            // �����ӿ�url
            url: _global.basePath + '/common/getAreaListByPid',
            // Ĭ�������
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

        // ���ɵ�������ѡ����div
        var areaSelectDivHtml = "<table class='pop_dialog_table'>" +
            "<tr><td class='pop_topleft'></td><td></td><td class='pop_topright'></td></tr>" +
            "<tr>" +
            "<td></td>" +
            "<td class='pop_content'>" +
            "<h2><span>ѡ�����</span></h2>" +
            "<div class='dialog_content'>" +
            "<div id='" + areaContentId + "' class='dialog_body'></div>" +
            "<div class='dialog_buttons'>" +
            "<span id='" + areaNameId + "'></span>" +
            "<input type='button' id='" + okBtnId + "' class='dialog_button' value='ȷ��' />" +
            "<input type='button' id='" + cancelBtnId + "' class='dialog_button' value='�ر�' />" +
            "</div></div></td></tr>" +
            "<tr><td class='pop_bottomleft'></td><td></td><td class='pop_bottomright'></td></tr>" +
            "</table>";
        $areaSelectDiv.html(areaSelectDivHtml);
        var $areaContent = $('#' + areaContentId);
        var $areaName = $('#' + areaNameId);
        var $okBtn = $('#' + okBtnId);
        var $cancelBtn = $('#' + cancelBtnId);

        // ����ʡ������
        _appendAreaHtml('root', 0, {
            url: url,
            $areaContent: $areaContent,
            $areaName: $areaName,
            $selectedArea: $selectedArea
        });

        // ������������¼�
        $areaInput.unbind('click').on('click', function(e) {
            $areaContent.find('a:eq(0)').click();
            $areaSelectDiv.show();
        });

        // ��ȷ����ť�¼�
        $okBtn.unbind('click').on('click', function(e) {
            $areaInput.val($areaName.text());
            $areaSelectDiv.hide();
        });

        // ��ȡ����ť�¼�
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
     ����:
     {
     dialogId: 'dialog-div',
     title: '��ͨ�Ի���',
     width: '500px',
     height: '400px',
     url: '',
     buttons: [{
     text: '����',
     handler: function() {
     save();
     }
     }, {
     text: 'ȡ��',
     handler: function() {
     closeWindow();
     }
     }],
     onClose: function(),
     }/
     */
    // ��ʾwindows
    var showWindow = function(params, jq) {
        var defaults = _setDefaults(params, this, {
            winId: 'win-div',
            $win: $('#win-div'),

            winIframeId: 'win-iframe',
            $winIframe: $('#win-iframe'),

            winLoadingId: 'win-loading',
            $winLoading: $('#win-loading'),
        });

        // ��ʾ�ȴ�gif����
        $winLoading.show();

        // ���궨��
        console.log($(window).height());
        console.log($(window).width());
        var top = ($(window).height() - height)/2;
        var left = ($(window).width() - width)/2;

        // ��ʼ������ʾwinDialog
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

        // ��ʾurlָ��ҳ��
        $winIframe.attr('src', params.url);
        $win.dialog('open');

        // ���صȴ�gif����
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
        mainboard.$.messager.confirm('������ʾ','ȷ��Ҫ������',function(e){
            if (e){
                $.ajax({
                    type: "POST",
                    url: url,
                    data: editFrame.$('#editForm').serialize(),
                    async: false,
                    error: function(request) {
                        mainboard.$.messager.alert('������ʾ',"����ʧ�ܣ�","error");
                    },
                    success: function(data) {
                        if (data && 'success' == data) {
                            mainboard.$.messager.alert('������ʾ', '����ɹ���', 'info', function() {
                                // ��ʱδ�õ��ò��ִ���
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
                            mainboard.$.messager.alert('������ʾ',"����ʧ�ܣ�","error");
                        }
                    }
                });
            }
        });
    };

    /*
     * ɾ������
     */
    var doRemove = function(url, $document) {
        // ��ȡ����
        var mainboard = parent;
        //��ȡ�����е���Ϣ
        var rowData= $document.data('rowData');
        //��ȡ��ID
        var ids = rowData[0];
        // ִ��ɾ������
        mainboard.$.messager.confirm('������ʾ', "ȷ��Ҫɾ����", function(r) {
            if (r) {
                $.ajax({
                    type: "POST",
                    url: url,
                    data: "ids="+ids,
                    async: asynFlag,
                    dataType: "text",
                    error: function(data) {
                        mainboard.$.messager.alert('������ʾ', "����ʧ�ܣ�", "error");
                    },
                    success: function(msg) {
                        if (data && "success" == data) {
                            mainboard.$.messager.alert('������ʾ', "ɾ���ɹ���", "info", function() {
                                mainboard.$.frontEngine.closeWindow();
                            });
                        } else {
                            mainboard.$.messager.alert('������ʾ', "����ʧ�ܣ�", "error");
                        }
                    }
                });
            }
        });
    };

    /*
     * �޸ķ���
     */
    var doUpdateStatus = function(flag, type, $document) {
        //��ȡ����
        var mainboard = parent;
        //��ȡ�����е���Ϣ
        var rowData= $document.data('rowData');
        //��ȡ��ID
        var ids = rowData[0];
        var optMsg = "״̬�޸ĳɹ���";
        var msgVal = "����";
        if (flag == 2)
            msgVal = "ͣ��";
        if (flag == 3) {
            msgVal = "ɾ��";
            optMsg = "ɾ���ɹ���";
        }
        mainboard.$.messager.confirm('������ʾ', "ȷ��Ҫ" + msgVal + "��", function(r) {
            if (r) {
                //ƴ�Ӳ���
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
                        mainboard.$.messager.alert('������ʾ',"����ʧ�ܣ�","error");
                    },
                    success: function(msg){
                        if (data && "success" == data) {
                            mainboard.$.messager.alert('������ʾ', msgVal + "�ɹ���", "info", function() {
                                mainboard.$.frontEngine.closeWindow();
                            });
                        } else {
                            mainboard.$.messager.alert('������ʾ', "����ʧ�ܣ�", "error");
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

    //�ж϶����Ƿ����
    var isEmpty = function(obj) {
        return obj == null || obj == "" || obj == "null" || typeof(obj) == "undefined";
    };

    /**
     * У�������Ƿ�Ϊ��
     * param id:У��id
     * param obj:У�����
     * param msg:��ʾ��Ϣ
     * param validType:У�����ͣ�1�ı���2��ͨ������3��״�ṹ������Ĭ��Ϊ1
     * param icon:��ʾͼ��(Ĭ��warning)
     * param fn:�ص�����
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
            $.messager.alert('������ʾ', msg, icon, function() {
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
        // �Ƿ�ִ��ͬ�� :falseΪͬ��
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
    // $.frontEngine.methodName��ʽ����
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
    // $().frontEngine('methodName', params)��ʽ����
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