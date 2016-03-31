var List = function() {
	var pageData = null;
	var basePath = '';

	// ****************************************************************************************************
	// 初始化系列方法
	// ****************************************************************************************************
	// 初始化页面数据缓存
	var initPageData = function(params) {
		basePath = params.basePath;
	};

	// 初始化菜单
	var initMenu = function() {
		$('#datagrid_menu').frontEngine('initDatagridMenu');
	};

	// 初始化列表
	var initDatagrid = function() {
		var listType = $('#listType').val();
		// 根据不同listType显示不同列表
		var columns;
		switch (listType) {
		// 正常 - normal
		case "normal":
			columns = [[
				{ field: 'id', title: 'id', width: 20 },
				{ field: 'name', title: '姓名', width: 20 },
				{ field: 'sex', title: '性别', width: 10 },
				{ field: 'age', title: '年龄', width: 10 },
				{ field: 'id_card', title: '身份证号', width: 10 },
				{ field: 'street_name', title: '街道', width: 10 },
				{ field: 'community_name', title: '社区', width: 10 },
				{ field: 'address', title: '地址', width: 10 },
				{ field: 'mobile', title: '手机', width: 10 },
				{ field: 'tel', title: '宅电', width: 10 },
				{ field: 'memo', title: '备注', width: 10 }
			]];
			break;
		// 迁出 - out
		case "out":
			columns = [[
				{ field: 'id', title: 'id', width: 20 },
				{ field: 'name', title: '姓名', width: 20 },
				{ field: 'sex', title: '性别', width: 10 },
				{ field: 'age', title: '年龄', width: 10 },
				{ field: 'id_card', title: '身份证号', width: 10 },
				{ field: 'out_place', title: '调出目标地市', width: 10 },
				{ field: 'memo', title: '备注', width: 10 }
			]];
			break;
		// 逝世 - dead
		case "dead":
			columns = [[
				{ field: 'id', title: 'id', width: 20 },
				{ field: 'name', title: '姓名', width: 20 },
				{ field: 'sex', title: '性别', width: 10 },
				{ field: 'age', title: '年龄', width: 10 },
				{ field: 'id_card', title: '身份证号', width: 10 },
				{ field: 'street_name', title: '街道', width: 10 },
				{ field: 'community_name', title: '社区', width: 10 },
				{ field: 'dead_attestor', title: '证明人或机构', width: 10 },
				{ field: 'memo', title: '备注', width: 10 }
			]];
			break;
		// 删除 - del
		case "del":
			columns = [[
				{ field: 'id', title: 'id', width: 20 },
				{ field: 'name', title: '姓名', width: 20 },
				{ field: 'sex', title: '性别', width: 10 },
				{ field: 'age', title: '年龄', width: 10 },
				{ field: 'id_card', title: '身份证号', width: 10 },
				{ field: 'street_name', title: '街道', width: 10 },
				{ field: 'community_name', title: '社区', width: 10 },
				{ field: 'memo', title: '删除原因', width: 10 }
			]];
			break;
		}
		console.log(listType);
		console.log(columns);
		
		$("#datagrid").frontEngine('initDatagrid', {
			url: basePath + '/elder/queryList',
			queryParams: {
				listType: listType,
			},
			columns: columns
		});
	};
	
	// 初始化搜索框
	var initSearch = function() {
		// 根据不同listType显示不同列表
		$("#datagrid_search").frontEngine('initSearch', {
			searchItems:
			[{
				field: 'elderName',
				title: '姓名',
			},
			{
				field: 'idCard',
				title: '身份证号',
				title_width: 80,
				input_width: 300
			},
			{
				field: 'address',
				title: '地址'
			}]
		});
	};
	
	// 初始化列表双击时出现的Dialog
	/* 	var initDialog = function() {
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
	}; */
	
	// ****************************************************************************************************
	// 暴露在外的方法
	// ****************************************************************************************************
	return {
		init: function(params) {
			initPageData(params);
			initMenu();
			initDatagrid();
			initSearch();
			//initDialog();
		}
	};
} ();