var List = function() {
	var pageData = {};
	var basePath = '';
	var $document = $(document);
	var mainboard = parent;

	// ****************************************************************************************************
	// 初始化系列方法
	// ****************************************************************************************************
	// 初始化页面数据缓存
	var initPageData = function(params) {
		//basePath = params.basePath;
	};

	// 初始化树形
	var initZtree = function() {

	};


	// 初始化列表
	var initDatagrid = function() {
		// 根据不同listType显示不同列表
		 var colums;
			columns = [[
						{field: '',title: '',width: 1},
						{field: 'checkbox',title: 'checkbox',width: 15},
						{field: '',title: '操作',width: 0},
						{field: 'name',title: '姓名',width: 0},
						{field: 'loginName',title: '登录名',width: 0},
						{field: 'no',title: '工号',width: 0},
						{field: 'company.name',title: '归属公司',width: 0},
						{field: 'office.name',title: '归属部门',width: 0},
						{field: 'email',title: '邮箱',width: 0},
						{field: 'phone',title: '电话',width: 0},
						{field: 'mobile',title: '手机',width: 0},
						{field: 'userType',title: '用户类型',width: 0},
						{field: 'loginIp',title: '最后登陆IP',width: 0},
						{field: 'loginFlag',title: '是否启用',width: 0},
						{field: 'loginDate',title: '登陆日期',width: 0},
						{field: 'lastUpdateDate',title: '修改时间',width: 0},
						{field: 'createDate',title: '创建时间',width: 0}
			]];
		var $datagrid =$("#datagrid");
		$.ajax({
			url: 'data/data1.json',
			dataType: 'json',
			async: false,
			success: function(result) {
				pageData.datagridList = result;
			}
		});
		console.log(pageData.datagridList);

		var _thLength = columns[0].length;
		var tableHtml='<thead><tr>';
		var tableDataTDHtml='<tbody>';
		//for data th
		for (var i = 0; i < _thLength; i++) {
			//th
			tableHtml=tableHtml+'<th ';
			if(columns[0][i].width!=0){
				tableHtml=tableHtml+'width="'+columns[0][i].width+'px" ';
			}
			tableHtml=tableHtml+'>';
			if(columns[0][i].title=='checkbox'){
				tableHtml=tableHtml+'<input type="checkbox">';
			}else{
				tableHtml=tableHtml+columns[0][i].title;
			}
			tableHtml=tableHtml+'</th>';
		}
		tableHtml=tableHtml+'</tr></thead>';



		//for data td
		for (var j = 0, j_len = pageData.datagridList.length; j < j_len; j++) {
			tableDataTDHtml=tableDataTDHtml+'<tr>';
			for (var h = 0; h < _thLength; h++) {
				//td
				var tdtitle=columns[0][h].field;
				if( tdtitle==null || tdtitle=="" || typeof(tdtitle)=="undefined"){
					tableDataTDHtml=tableDataTDHtml+'<td></td>';
				}else{
					if(tdtitle=='checkbox'){
						tableDataTDHtml=tableDataTDHtml+'<td><input type="checkbox"></td>';
					}else{
						tableDataTDHtml=tableDataTDHtml+'<td>'+$(pageData.datagridList[j]).attr(tdtitle)+'</td>';
					}

				}
			}
			tableDataTDHtml=tableDataTDHtml+'</tr>';
		}

		tableDataTDHtml=tableDataTDHtml+'</tbody>';
		tableHtml=tableHtml+tableDataTDHtml;


		console.log(tableHtml);
		$datagrid.append(tableHtml);
		/*$("#datagrid").frontEngine('initDatagrid', {
			url: basePath + '/serviceWorkNo/queryList',
			columns: columns
		});*/

		/*
		<tbody>
		<tr>
		<td>item_index+1</td>
		<td><input type="checkbox"></td>
			<td>
			<a href="${BasePath !}/user/form.do?id=${(item.id) !}">编辑</a> |
			<a href="javascript:isEnabled('item.id')" >loginFlag 禁用 启用</a>

		| <a name="delete_item" href="${BasePath !}/user/delete.do?id=${(item.id) !}">删除</a>

			| <a href="javascript:showAllrole('${(item.id) !}')">分配角色</a> |
			<a href="javascript:showAlluserGroup('${(item.id) !}')">分配用户组</a>

			</td>
			<td>item.name</td>
			<td>item.loginName</td>
			<td>item.no</td>
			<td>item.company.name</td>
			<td>item.office.name</td>
			<td>item.email</td>
			<td>item.phone</td>
			<td>item.mobile</td>
			<td></td>
			<td align="center">启用 禁用</td>
		<td></td>
		</tr>
		</tbody>
		*/

	};
	
	// 初始化搜索框
	var initSearch = function() {
		// 根据不同listType显示不同列表
		$("#datagrid-search").frontEngine('initSearch', {
			searchItems:
				    [{field: 'userId',title: '用户帐号',width: 10},
					{field: 'userName',title: '用户姓名',width: 10},
					{field: 'companyId',title: '归属服务商',width: 10}
					/*{field: 'status',title: '用户状态',width: 10} */
					]
		});
	};
	


	
	// ****************************************************************************************************
	// 暴露在外的方法
	// ****************************************************************************************************
	return {
		init: function(params) {
			initPageData(params);
			initZtree();
			initDatagrid();
			//initSearch();
		}
	};
} ();