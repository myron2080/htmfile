function doCreate(titleName,width,height,url){
	var pp = parent;
	pp.openWindow(titleName,width,height,url,[{
		text:'保存',
		iconCls:'icon-ok',
		handler:function(){
			save();
		}
	},{
		text:'取消',
		iconCls:'icon-no',
		handler:function(){
			pp.closeWindow();
		}
	}]);
}

function edit(){
	doEdit('');
}

function doEdit(alertName){
	var ecForm = listFrame.document.all.ec;
	if(!checkSelect(ecForm.id,false,alertName))
		return;
	create(get_checkbox_value(ecForm.id));
}

function doSave(url,id){
	var pp = parent;
	var editFrame = pp.winFrame;
	pp.$.messager.confirm('操作提示','确定要保存吗？',function(r){
	    if (r){
	   	    $.ajax({
				cache: false,
				type: "POST",
				url:url,
				data:editFrame.$('#editForm').serialize(),
				async: false,
			    error: function(request) {
		            pp.$.messager.alert('操作提示',"操作失败！","error");
			    },
			    success: function(data) {
			    	if(data && "success" == data){
			    		pp.$.messager.alert('操作提示',"保存成功！","info",function(){
			    			 if(typeof(id) != 'undefined'){
						         if("" == id){
						         	search();
					         	 }else{
					         	 	var listFrame = document.getElementById("listFrame").contentWindow;
									listFrame.document.forms[0].submit();
								 }
			    			 }
					         pp.closeWindow();
			         	});
		         	}else{
		         		pp.$.messager.alert('操作提示',"操作失败！","error");
		         	}
			    }
			});
         }
     });
}

function doView(titleName,width,height,url,clearButton){
	var pp = parent;
	var buttons = null;
	if(pp.isEmpty(clearButton)){
		buttons = [{
				text:'关闭',
				iconCls:'icon-no',
				handler:function(){
					pp.closeWindow();
				}
			}];
	}
	pp.openWindow(titleName,width,height,url,buttons);
}

function doRemove(url){
	var pp = parent;
	var ecForm = listFrame.document.all.ec;
	if(!checkSelect(ecForm.id,true))
		return;
	
	pp.$.messager.confirm('操作提示',"确定要删除吗？",function(r){
	    if (r){
			var ids = get_checkbox_values(ecForm.id,',');
			
			var urls = url;
		    var params = "ids="+ids;
		    var str = executeAjax(urls,params,false);
		    
		    if(str != 'error'){
		    	pp.$.messager.alert('操作提示', "删除成功！", "info",function(){
		    		var listFrame = document.getElementById("listFrame").contentWindow;
					listFrame.document.forms[0].submit();
		    	});
			}else{
				pp.$.messager.alert('操作提示',"操作失败！","error");
			}
		}
	});
}

function doUpdateStatus(flag,type){
	var pp = parent;
	var ecForm = listFrame.document.all.ec;
	if(!checkSelect(ecForm.id,true))
		return;
	
	var optMsg = "状态修改成功！";
	var msgVal = "启用";
	if(flag == 2)
		msgVal = "停用";
	if(flag == 3){
		msgVal = "删除";
		optMsg = "删除成功！";
	}
	
	pp.$.messager.confirm('操作提示',"确定要"+ msgVal +"吗？",function(r){
	    if (r){
			var ids = get_checkbox_values(ecForm.id,',');
			
			var urls = "../common/updateStatus";
		    var params = "ids="+ids;
		    params += "&status="+flag;
		    params += "&type="+type;
		    var str = executeAjax(urls,params,false);
		    
		    if(str != 'error'){
		    	pp.$.messager.alert('操作提示', optMsg, "info",function(){
		    		var listFrame = document.getElementById("listFrame").contentWindow;
					listFrame.document.forms[0].submit();
		    	});
			}else{
				pp.$.messager.alert('操作提示',"操作失败！","error");
			}
		}
	});
}