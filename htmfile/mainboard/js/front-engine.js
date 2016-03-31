/**
 * ***************************************************************************
 * 前端页面js引擎
 * @创建日期 : 2015.05.28
 * @创建者 : 瞿博
 * ***************************************************************************
 */
// TODO 格式还需进一步修改，采用strict方式。
(function($) {

	var initDatagrid = function(jq, params) {
		// 变量定义
		// 以下4个参数必须传入，若不设置则报错。
		var _datagridMenu = params.datagridMenu;
		var _datagridDialog = params.datagridDialog;
		var _url = params.url == null ? "" : params.url;
		var _columns = params.columns;
		// TODO 设置默认值，映射方法。
		// 使用循环，当外部params中有值则替换默认值。
		var _pageSize = params.pageSize == null ? 15 : params.pageSize;
		var _queryParams = params.queryParams;
		_queryParams.pageSize = _pageSize;
		
		// 目标操作对象
		var $datagrid = $(jq);

		// 初始化datagrid
		$datagrid.datagrid({
			// 请求路径
			url: _url,
			queryParams: _queryParams,
			// 只允许选中单行
			singleSelect: true,
			// 表头标题图片
			iconCls: 'icon-search',
			// 显示行号
			rownumbers: false,
			// 自动调整行距
			autoRowHeight: false,
			// 显示底部分页栏
			pagination: true,
			pageNumber: 1,
			// 每页显示的记录条数
			pageSize: _pageSize,
			// 可以设置每页记录条数的列表
			pageList: [15],
			// 自适应宽度，防止水平滚动
			fitColumns: true,
			// 隔行变色
			striped: true,
			// 滚动条宽度
			scrollbarSize: 0,
			loadMsg: "正努力为您加载中......",
			columns: _columns,
			// 添加单元格单击事件，拿到ID
			onClickCell: function() {
				/*var mouseX = event.clientX;
				var mouseY = event.clientY;
				_datagridMenu.menu('show', {
					left: mouseX + 2,
					top: mouseY
				});*/
			},
			// 添加单元格双击事件，拿到ID
			onDblClickCell: function(index, field, v) {
				var listprice = $(this).datagrid("getRows")[index].listprice;
				_datagridMenu.menu('hide');
				_datagridDialog.dialog('open');
			},
			onRowContextMenu: function(e, rowIndex, rowData) { //右键时触发事件
				  e.preventDefault(); //阻止浏览器捕获右键事件
				var mouseX = event.clientX;
				var mouseY = event.clientY;
				_datagridMenu.menu('show', {
					left: mouseX + 2,
					top: mouseY
				});
			}
		});

		// 设置分页控件
		var pager = $datagrid.datagrid('getPager');
		$(pager).pagination({
			// 页数文本框前显示的汉字
			beforePageText: '第 ',
			afterPageText: ' 页    共 {pages} 页',
			displayMsg: ' 当前显示  {from} - {to} 条记录   共 {total} 条记录',
			layout: ['first','prev','sep','manual','sep','next','last'],
			// 分页跳转触发
			onSelectPage: function (pageNumber, pageSize) {
				// 加屏蔽
				$datagrid.datagrid("loading");
				// 设置参数
				//_queryParams.currentPage = pageNumber;
				var formparms = $("#form-query").serializeObject();
				formparms.currentPage = pageNumber;
				formparms.pageSize = pageSize;
				// ajax获取数据
				$.ajax({
					url : _url,
					data : formparms,
					dataType: "json",
					success : function(result) {
						$datagrid.datagrid('loadData', result);
						//移除屏蔽
						$datagrid.datagrid("loaded");
					},
					error : function(err) {
						$.messager.alert('操作提示', '获取信息失败...请联系管理员!', 'error');
						//移除屏蔽
						$datagrid.datagrid("loaded");
					}
				});
			}
		});
	};

	// 初始化datagridDialog
	var initDialog = function(jq, params) {
		// 变量定义
		// TODO 设置默认值，映射方法。
		// 使用循环，当外部options中有值则替换默认值。
		var href = params.href == null ? "" : params.href;

		// 目标操作对象
		var $dialog = $(jq);

		$dialog.dialog({
			title: '详细信息',
			width: 700,
			height: 600,
			closed: true,
			cache: false,
			position: ['left', 'bottom'],
			href: href,
			modal: true
		});

		// 定义dialog坐标
		// TODO
		$dialog.panel('move', {
			left: 100,
			top: 100
		});
	};

	$.fn.frontEngine = function(methodName, params){
		return $.fn.frontEngine.methods[methodName](this, params);
	};

	$.fn.frontEngine.methods = {
		initDatagrid: function(jq, params) {
			return initDatagrid(jq, params);
		},
		initDialog: function(jq, params) {
			return initDialog(jq, params);
		}
	}

})(jQuery);

$.fn.serializeObject = function()  
{  
   var o = {};  
   var a = this.serializeArray();  
   $.each(a, function() {  
       if (o[this.name]) {  
           if (!o[this.name].push) {  
               o[this.name] = [o[this.name]];  
           }  
           o[this.name].push(this.value || '');  
       } else {  
           o[this.name] = this.value || '';  
       }  
   });  
   return o;  
};
//查询功能实现
onquery = function() {
	var formparms = $("#form-query").serializeObject();
	var pageSize = $('#datagrid').datagrid('getPager').data("pagination").options.pageSize;
	formparms.currentPage = 1;
	formparms.pageSize = pageSize;
	$("#datagrid").datagrid('load', $("#form-query").serializeObject());
};
//清除按钮的功能
onclear = function() {
	$('#form-query')[0].reset();
};