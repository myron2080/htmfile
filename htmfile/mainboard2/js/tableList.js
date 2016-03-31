var List = function() {
	var pageData = null;
	var basePath = location.origin + '/takecare';
	// ****************************************************************************************************
	// 初始化系列方法
	// ****************************************************************************************************
	// 初始化菜单
	var initMenu = function() {
		//初始化table 的工具栏, New 和 Search
		var initToolbar = $("<button class='btn btn-default' type='button' id='toolbar-new-btn'>New</button>" + 
		"<input id='search-txt' class='form-control' placeholder='姓名' type='text'>" + 
		"<button class='btn btn-default' id='toolbar-search-btn' type='button'>Search</button>");
		$("#toolbar").append(initToolbar);
		//初始化table 单击单元格出现的菜单
		$.ajax({
			type: "post",
			async: false,
			url: basePath + "/menu/queryPageMenu",
			data: {
				menuId: $("#menuId").val()
				},
			dataType: "json",
			success: function(resultJson) {
			//	alert($("#datagridMenu ul").html());
				tableMenu = resultJson;
				if (resultJson != null) {
					var menuObject = "";
					$(resultJson).each(function(index, element) {
						menuObject = $("<li action=" + element.method + ">" + element.name + "</li>");
						$("#datagridMenu ul").append(menuObject);
					})
					menuObject = $("<li>Exit</li>");
					$("#datagridMenu ul").append(menuObject);
				}
			}
		});
	};
	
	// 初始化列表双击时出现的Dialog
	var initDialog = function() {
	       //双击事件弹出框
			 	$('#datagridDialog').dialog({    
				    title: '详细信息',    
				    width: 700,    
				    height: 600,    
				    closed: true,    
				    cache: false,    
				    position: ['left', 'bottom'],
				    href: 'dialogInfo_file/dialogInfo.html',    
				    modal: true   
				}); 
			 	
			 	//定义dialog 坐标
		 		$('#datagridDialog').panel('move',{ 
			 		  left:100, 
			 		  top:100 
			 		});
		 		
		 		
		
	};
	
	
	// 初始化列表
	var initDatagrid = function() {
		// 根据不同listType显示不同列表
		
		
		$("#datagrid").frontEngine('initDatagrid', {
			datagridMenu: $('#datagridMenu'),
			datagridDialog: $('#datagridDialog'),
			url: basePath + '/elder/queryList',
			queryParams: {
				listType: "normal",
			},
			columns: [[
						{
							field: 'id',
							title: 'id',
							width: 20
						},
						{
							field: 'name',
							title: '姓名',
							width: 20
						},
						{
							field: 'age',
							title: '年龄',
							width: 10
						},
						{
							field: 'id_card',
							title: '身份证号',
							width: 70
						},
						{
							field: 'address',
							title: '地址',
							width: 90
						},
						{
							field: 'street_name',
							title: '街道',
							width: 60
						}
					]]
		});
	}
	
	// ****************************************************************************************************
	// 绑定元素事件
	// ****************************************************************************************************
	var bindEvent = function() {
		//li 获取鼠标焦点
		$('#datagridMenu ul li').unbind('mousemove').on('mousemove', 
		function(e) {
			e.preventDefault();
			$('#datagridMenu ul li').attr('style', 'background:#ffffff');
			$(this).attr('style', 'background:#9AC0CD');
		});
		//li 失去鼠标焦点
		$('#datagridMenu ul li').unbind('mouseout').on('mouseout', 
		function(e) {
			e.preventDefault();
			$('#datagridMenu ul li').attr('style', 'background:#ffffff');
		});
		//li 单击事件
		$('#datagridMenu ul li').unbind('click').on('click', 
		function(e) {
			e.preventDefault();
			if (this.innerHTML == "Exit") {
				$('#datagridMenu').menu('hide');
			} else {
				var row = $('#dg').datagrid('getSelected');
				if (row) {
					console.log('Item ID:' + row.itemid + "\nPrice:" + row.productid);
				}
				console.log($(this).attr("action") + " , " + this.innerHTML);
			}
		});
		//toolbar-new 按钮单击事件
		$('#toolbar-new-btn').unbind('click').on('click', 
		function(e) {
			e.preventDefault();
			console.log(this.innerHTML);
			//var menuObject=$("<div class='alert alert-warning'><a href='#' class='close' data-dismiss='alert'>&times;</a><strong>警告！</strong>您的网络连接有问题。</div>");
			//$('#toolbar-new-btn').append(menuObject);
			$('.alert-warning').attr('style', 'display:inline');
		});
		//toolbar-search 按钮单击事件
		$('#toolbar-search-btn').unbind('click').on('click', 
		function(e) {
			e.preventDefault();
			console.log(document.getElementById("search-txt").value);
		});
	}
	// ****************************************************************************************************
	// 作用域内部方法
	// ****************************************************************************************************

	// ****************************************************************************************************
	// 暴露在外的方法
	// ****************************************************************************************************
	return {
		init: function(params) {
			initMenu();
			initDialog();
			initDatagrid();
			bindEvent();
		}
	};
} ();