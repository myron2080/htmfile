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


	var initSearch = function(params, jq) {

		var defaults = {
			titleWidth: 80,
			inputWidth: 200,
			datagridId: 'datagrid',
			searchBtnId: 'datagrid-search-btn',
			clearBtnId: 'datagrid-clear-search-btn',
			toolbarId: 'datagrid-toolbar-customize',
			searchAddInfo:'datagrid-search-addinfo',
			searchInfo:'datagrid-search-info'
		};

		// 默认搜索条件，如listType
		if (params.searchItems == null) {
			return;
		}
		var $search = $(jq);
		var $datagrid = $('#' + defaults.datagridId);
		var searchItems = params.searchItems;
		var $toolbar = $('#' + defaults.toolbarId);
		var $searchAddInfo = $('#' + defaults.searchAddInfo);
		var $searchInfo = $('#' + defaults.searchInfo);
		var datagridId = params.datagridId == null ? defaults.datagridId : params.datagridId;
		var searchBtnId = params.searchBtnId == null ? defaults.searchBtnId : params.searchBtnId;
		var clearBtnId = params.clearBtnId == null ? defaults.clearBtnId : params.clearBtnId;

		// 添加搜索按钮
		var searchBtnHtml = "<input type='button' id='" + searchBtnId + "' class='btn btn-default' value='查询' />";
		$searchAddInfo.append(searchBtnHtml);
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
		$toolbar.append(clearBtnHtml);
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

		/*	// 初始化搜索框
		 var initSearch = function() {
		 // 根据不同listType显示不同列表
		 $("#datagrid-search").frontEngine('initSearch', {
		 searchItems:
		 [{field: 'customerName',title: '客户姓名',type:'input',data:'jack'},
		 {field: 'mobilePhone',title: '客户手机',type:'input',data:'12345678911'},
		 {field: 'userId',title: '受理坐席',type:'input',data:'aa'},
		 {field: 'complainType',title: '投诉类型',type:'multiple',data:[{title:'家政服务',value:'1'},{title:'健康中心',value:'2'},{title:'视频连接',value:'3'},{title:'饮食',value:'4'}]},
		 {field: 'complainClass',title: '投诉等级',type:'single',data:[{title:'level1',value:'1'},{title:'level2',value:'2'},{title:'level3',value:'3'}]},
		 {field: 'startDate',title: '受理时间',type:'input',data:'jack'},
		 {field: 'ifVisit',title: '是否回访',type:'single',data:[{title:'是',value:'1'},{title:'否',value:'2'}]},
		 {field: 'orderStatus',title: '状态',type:'single',data:[{title:'正常',value:'1'},{title:'停止',value:'2'},{title:'暂缓',value:'3'}]},
		 {field: 'ifValid',title: '是否有效',type:'single',data:[{title:'是',value:'1'},{title:'否',value:'2'}]}]
		 });
		 };*/

		var getradioID="";

		for (var i = 0; i < searchItems.length; i++) {
			var item = searchItems[i];
			var itemId = "search-" + item.field;
			var titleWidth = item.titleWidth == null ? defaults.titleWidth : item.titleWidth;
			var inputWidth = item.inputWidth == null ? defaults.inputWidth : item.inputWidth;
			var itemType=item.type;		//类型 type
			var itemData=item.data;

			var htmlOut="";
			var htmlInput="";


			//判断类型: input:普通输入框, single:单项选择, multiple:多项选择
			if(itemType=='input'){
				<!--输入框  -->
				htmlInput = "<div class='input-group' style='float: left;padding-left:15px; margin-bottom:3px ;' >" +
					"<span class='input-group-addon' style='width:" + titleWidth + "px;'>" + item.title + "</span>" +
					"<input  type='text' id='" + itemId + "' name='" + item.field + "' class='form-control' placeholder='' style='width:" + inputWidth + "px;' value='" + itemData + "' />" +
					"<input type='button' class='btn btn-default action-ok' value='确认' ></div>";


				<!--隐藏的输入框 ,下拉框,复选框 -->
				htmlOut = "<div class='searchName " + itemId + "'>" +
					"<span class='' style='float:left;  margin: 4px 4px 0px 2px;'>" + item.title + ":</span>" +
						//"<label  type='text' id='" + itemId + "' name='" + item.field + "' class='' style='width:" + inputWidth + "px;padding: 0px;margin:4px 4px 0px 2px;color: #F00B0B;'></label>" +
					"<label  type='text'  name='" + item.field + "' class='' style='padding: 0px;margin:4px 4px 0px 2px;color: #F00B0B;'></label>" +
					"<input type='button' class='action-no' style='height: 25px;border: none' value='X' ></div>";
			}else if(itemType=='single'){
				<!-- 单选多项,单项选择-->
				htmlInput ="<div id='" + itemId + "' class='btn-group' data-toggle='buttons' style='padding-left:15px; margin-bottom:3px ;width: 100%'>"+
					"<span class='input-group-addon' style='width:" + titleWidth + "px;line-height: 20px;float: left;'>" + item.title + "</span>" ;
				//这里从数据库拿值,然后循环取值
				for (var j = 0; j < itemData.length; j++) {
					var dataradios = itemData[j];
					htmlInput+="<label class='btn btn-primary ' value='" + dataradios.value + "'><input type='radio' name='options' >" + dataradios.title + "</label>";
				}
				htmlInput+="</div>";

				<!--隐藏的单选按钮,单项选择框  :比下面多一个隐藏域-->
				htmlOut = "<div class='searchName " + itemId + "'>" +
					"<span class='' style='float:left;  margin: 4px 4px 0px 2px;'>" + item.title + ":</span>" +
					"<label  type='text'  name='" + item.field + "' class='' style='padding: 0px;margin:4px 4px 0px 2px;color: #F00B0B;'></label>" +
					"<input type='hidden' value=''/><input type='button' class='action-no-chick' style='height: 25px;border: none' value='X' ></div>";

				getradioID+="#"+itemId+" label,";



			}else if(itemType=='multiple'){
				htmlInput = "<div id='" + itemId + "' class='btn-group' data-toggle='buttons' style='padding-left:15px; margin-bottom:3px ;width: 100%'>" +
					"<span class='input-group-addon' style='width:" + titleWidth + "px;line-height: 20px;float: left;'>" + item.title + "</span>";
				//这里从数据库拿值,然后循环取值
				for (var k = 0; k < itemData.length; k++) {
					var dataradios = itemData[k];
					htmlInput+="<label class='btn btn-primary ' value='" + dataradios.value + "'><input type='checkbox'>" + dataradios.title + "</label>";
				}
				htmlInput+="<input type='button' class='btn btn-default action-ok-checkbox' value='确认'></div>";

				<!--隐藏的输入框 ,下拉框,复选框 -->
				htmlOut = "<div class='searchName " + itemId + "'>" +
					"<span class='' style='float:left;  margin: 4px 4px 0px 2px;'>" + item.title + ":</span>" +
					"<label  type='text'  name='" + item.field + "' class='' style='padding: 0px;margin:4px 4px 0px 2px;color: #F00B0B;'></label>" +
					"<input type='button' class='action-no' style='height: 25px;border: none' value='X' ></div>";


			}else if(itemType=='inputTime'){			//时间类型:inputTime

				<!--输入框  -->
				htmlInput = "<div class='input-group' style='float: left;padding-left:15px; margin-bottom:3px ;' >" +
					"<span class='input-group-addon' style='width:" + titleWidth + "px;'>" + item.title + "</span>" +
					"<input  type='text' id='" + itemId + "' name='" + item.field + "' actionid='showTimeEmpty' class='form-control showTimeEmpty' placeholder='' style='width:" + inputWidth + "px;' value='" + itemData + "' />" +
					"<input type='button' class='btn btn-default action-ok' value='确认' ></div>";


				<!--隐藏的输入框 ,下拉框,复选框 -->
				htmlOut = "<div class='searchName " + itemId + "'>" +
					"<span class='' style='float:left;  margin: 4px 4px 0px 2px;'>" + item.title + ":</span>" +
						//"<label  type='text' id='" + itemId + "' name='" + item.field + "' class='' style='width:" + inputWidth + "px;padding: 0px;margin:4px 4px 0px 2px;color: #F00B0B;'></label>" +
					"<label  type='text'  name='" + item.field + "' class='' style='padding: 0px;margin:4px 4px 0px 2px;color: #F00B0B;'></label>" +
					"<input type='button' class='action-no' style='height: 25px;border: none' value='X' ></div>";


			}

			<!--*******************   隐藏区 ***********************-->
			$searchAddInfo.append(htmlOut);
			<!--*******************   展示区 ***********************-->
			$searchInfo.append(htmlInput);





		}

		//时间输入框获取焦点
		$(".showTimeEmpty").unbind('focus').on('focus', {}, function (e) {
			$("#year").val("");
			$("#month").val("");
			$("#day").val("");
			var mouseX = $(this).offset().left;
			var mouseY=$(this).offset().top+34;
			$(document).data('inputTimeID', this.id);
			$("#hideTimeEmpty").attr("style","display: inline-block;position:absolute;background-color: #eee; top:" + mouseY + "px;left:"+mouseX+"px");
		});

		//datagrid-search-addinfo
		$(".showTimeEmpty").unbind('blur').on('blur', {}, function (e) {
			e.preventDefault();
			var focusname=window.event.fromElement;
			//var focusname=document.activeElement.tagName;

			//$("#hideTimeEmpty").attr("style","display:none;position:absolute;background-color: #eee; ");
		});


		//时间确认按钮:action-ok-time
		$(".action-ok-time").unbind('click').on('click	', {}, function (e) {
			if(!_validTime($("#hideTimeEmpty"))) return;
			var year=$("#year").val();
			var month=$("#month").val();
			var day=$("#day").val();
			var getInputTimeID=$(document).data('inputTimeID');
			$("#"+getInputTimeID).val(year+"-"+month+"-"+day);
			$(this).parent().attr("style","display:none;position:absolute;background-color: #eee; ");
			// 消除之前的popover
			$(".popover").remove();
		});


		 getradioID=getradioID.substring(0,getradioID.length-1);

		//单选按钮事件
		$(getradioID).unbind('click').on('click', {}, function (e) {
			var getid=$(this).parent().attr("id");
			$("."+getid).attr("style","display:inline-block;float:left;margin:4px 4px;font-size:12px;");
			$("."+getid+" label").text($(this).text());
			$("."+getid+" input[type=hidden]").val($(this).parent().attr("id"));
			$(this).parent().attr("style","display:none;padding-left:15px; margin-bottom:3px ;width: 100%;");
		});

		//确认按钮
		$(".action-ok").unbind('click').on('click', {}, function (e) {
			var getid=$(this).prev().attr("id");
			var getvalue=$(this).prev().val();
			if(getvalue=="") return;
			//   $("."+getid+" label").attr("text",getvalue);
			$("."+getid+" label").text(getvalue);
			$("."+getid).attr("style","display:inline-block;float:left;margin:4px 4px;font-size:12px;");
		});


		//移除按钮:输入框,复选框
		$(".action-no").unbind('click').on('click', {}, function (e) {
			$(this).parent().attr("style","display:none;float:left;margin:4px 4px;font-size:12px;");
		});

		//单选和多选按钮移除
		$(".action-no-chick").unbind('click').on('click', {}, function (e) {
			$(this).parent().attr("style","display:none;float:left;margin:4px 4px;font-size:12px;");
			var getvalue=$(this).prev().val();
			$("#"+getvalue).attr("style","display:inline-block;padding-left:15px;margin-bottom:3px;width: 100%");

		});



		//复选框按钮
		$(".action-ok-checkbox").unbind('click').on('click', {}, function (e) {
			var getid=$(this).parent().attr("id");
			var getObject= $("#"+getid+" .active input[type=checkbox]");
			var getvalue="";
			for(var i=0;i < getObject.length ;i++){
				// s +=String.fromCharCode(a[i]);
				var ob=getObject[i];
				var valu=$(ob).parent().text();
				valu=  valu.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
				if(i<getObject.length-1){
					getvalue+=valu+",";
				}else{
					getvalue+=valu;
				}
			}
			$("."+getid+" label").text(getvalue);
			$("."+getid).attr("style","display:inline-block;float:left;margin:4px 4px;font-size:12px;");
		});




	};



	// 时间验证
	var _validTime = function(deadTimeDiv) {
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
		console.log(year+" , "+month+" , "+day);
		// 时间变量
		var today = new Date();
		var deadTimeInput = deadTimeDiv.find('#deadTime');
		var deadTime = '';
		// 执行验证
		if (year == '' || month == '') {
			toggleObj = deadTimeDiv;
			msg = '时间输入不完整。必须输入年、月';
		} else if (!/^[0-9]{4}$/.test(year)) {
			toggleObj = yearInput;
			msg = '年份格式错误';
		} else if (parseInt(year) > today.getFullYear() || parseInt(year) < 1990) {
			toggleObj = yearInput;
			msg = '年份有误';
		} else if (!/^[1-9]|0[1-9]|1[0-2]$/.test(month)) {
			toggleObj = monthInput;
			msg = '月份格式错误';
		} else {
			var intYear = parseInt(year);
			var intMonth = parseInt(month) - 1;
			deadTime = new Date(intYear, intMonth);
			if (deadTime > today) {
				toggleObj = monthInput;
				msg = '月份有误';
			} else if (day != '') {
				if (!/^[0-9]|0[0-9]|[1-2][0-9]|3[0-1]$/.test(day)) {
					result = false;
					toggleObj = dayInput;
					msg = '日期格式错误';
				} else {
					var intYear = parseInt(year);
					var intMonth = parseInt(month) - 1;
					var intDay = parseInt(day);
					deadTime = new Date(intYear, intMonth, intDay);
					if (deadTime > today) {
						result = false;
						toggleObj = dayInput;
						msg = '日期有误';
					} else {
						result = true;
					}
				}
			} else {
				result = true;
			}
		}
		// 消除之前的popover
		var popoverArr = $('#dead_div').find('[data-toggle=popover]');
		for (var i = 0; i < popoverArr.length; i++ ) {
			$(popoverArr[i]).popover('destroy');
		}
		// 根据结果显示popover
		if (!result) {
			var popoverOptions = {
				content : msg,
				placement : placement
			};
			toggleObj.popover('destroy').popover(popoverOptions).popover('show');
		} else {
			deadTimeInput.val(deadTime.getTime());
		}
		// 返回结果
		return result;
	};



	// ****************************************************************************************************
	// $.frontEngine.methodName形式调用
	// ****************************************************************************************************
	$.extend({
		frontEngine: {
			initSearch: function(params, jq) {
				return initSearch(params, jq);
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
		initSearch: function(params, jq) {
			return initSearch(params, jq);
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