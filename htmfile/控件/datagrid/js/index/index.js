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
			columns = $("#datagrid thead tr th");
		var $datagrid =$("#datagrid");
		$.ajax({
			url: 'data/data1.json',
			dataType: 'json',
			async: false,
			success: function(result) {
				pageData = result;

			}
		});
		var _thLength = columns.length;
		var tableDataTDHtml='<tbody>';
		//for data td
		var item_index=1;
		for (var j = 0, j_len = pageData.datagridList.length; j < j_len; j++) {
			var item_info=pageData.datagridList[j];
			tableDataTDHtml=tableDataTDHtml+'<tr listid="'+item_info.id+'"><td>'+item_index+'</td>';
			for (var h = 0; h < _thLength; h++) {
				//td
				var tdtitle=$(columns[h]).attr("field");
				if( tdtitle==null || tdtitle=="" || typeof(tdtitle)=="undefined"){
				}else{
					if(tdtitle=='operation'){
						var _arrOperation=pageData.operation;
						tableDataTDHtml=tableDataTDHtml+'<td>';
						if(_arrOperation.length>0){
							for (var k = 0, arr_operation=_arrOperation.length; k < arr_operation; k++) {
								if(k != 0){
									tableDataTDHtml=tableDataTDHtml+' | ';
								}
								var op_txt=_arrOperation[k].name;
								/*var op_type;
								if(_arrOperation[k].type=="edit"){
									op_type="edit";
								}else if(_arrOperation[k].type=="loginFlag"){
									var op_loginFlagTxt=item_info.loginFlag==1?"禁用":"启用";
									op_txt=	op_loginFlagTxt;
									op_type="loginFlag";
								}else if(_arrOperation[k].type=="delete"){
									op_type="delete";
								}else{
									op_type="";
								}*/
								var op_type=_arrOperation[k].type;
								if(_arrOperation[k].type=="loginFlag"){
									op_txt=	item_info.loginFlag==1?"禁用":"启用";
									op_type="loginFlag";
								}

								tableDataTDHtml=tableDataTDHtml+'<a href="javascript:;" typeOperaction="'+op_type+'" likUrl="'+_arrOperation[k].url+'" >'+op_txt+'</a>';
							}

						}

						tableDataTDHtml=tableDataTDHtml+'</td>';
					}else if(tdtitle=='checkbox'){
						tableDataTDHtml=tableDataTDHtml+'<td><input type="checkbox"></td>';
					}else if(tdtitle=='userType'){
						tableDataTDHtml=tableDataTDHtml+'<td>'+_getuserType(item_info.userType)+'</td>';
					}else if(tdtitle=='loginFlag'){
						var _loginFlagTxt=item_info.loginFlag==1?"启用":"禁用";
						tableDataTDHtml=tableDataTDHtml+' <td align="center">'+_loginFlagTxt+'</td>';
					}else{
						var getDataInfo;
						if(tdtitle.indexOf(".") > 0 ){
							var tdtitleArr=tdtitle;
							tdtitleArr = tdtitleArr.split(".");
							var $getfirst=$(pageData.datagridList[j]).attr(tdtitleArr[0]);
							getDataInfo=$($getfirst).attr(tdtitleArr[1]);
						}else{
							getDataInfo=$(pageData.datagridList[j]).attr(tdtitle);
						}
						getDataInfo = (getDataInfo==null || getDataInfo=="" || typeof(getDataInfo)=="undefined")? "" : getDataInfo;
						tableDataTDHtml=tableDataTDHtml+'<td>'+getDataInfo+'</td>';
					}

				}
			}
			tableDataTDHtml=tableDataTDHtml+'</tr>';
			item_index++;
		}
		tableDataTDHtml=tableDataTDHtml+'</tbody>';
		$datagrid.append(tableDataTDHtml);


	};

	var _getuserType=function(type){
		var rs;
		var userTypeDescribeList=pageData.userTypeDescribe;
		for (var j = 0, j_len = userTypeDescribeList.length; j < j_len; j++) {
			if(type==userTypeDescribeList[j].id){
				rs=userTypeDescribeList[j].name;
				break;
			}
		}
		return rs;

	}



	// 初始化时间
	var initClick = function() {

		// 绑定全选按钮事件
		/*$('#datagrid thead tr th[field="checkbox"] input[type="checkbox"]').unbind('click').on('click', function() {

			var getcheckList=$('#datagrid tbody input[type="checkbox"]');
			for (var j = 0; j < getcheckList.length; j++) {
				getcheckList[j].checked=this.checked;
			}

		});*/

		$('.table thead tr th[field="checkbox"] input[type="checkbox"]').unbind('click').on('click', function() {
			var evt = arguments[0] || window.event;
			var chkbox = evt.srcElement || evt.target;
			var checkboxes = $(".table tr td input[type='checkbox']");
			if (chkbox.checked) {
				checkboxes.prop('checked', true);
			} else {
				checkboxes.prop('checked', false);
			}

		});


		$('.table tbody tr td a').unbind('click').on('click', function(e) {
			e.preventDefault();
			var $tr=$(this).parents("tr");
			var op_id=$tr.attr("listid");
			var op_type=$(this).attr("typeOperaction");
			var op_likUrl=$(this).attr("likUrl");

			if(op_type=="edit"){

			}else if(op_type=="loginFlag"){

			}else if(op_type=="delete"){

			}else{

			}
			console.log(op_type);
		});



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
			initClick();
		}
	};
} ();


