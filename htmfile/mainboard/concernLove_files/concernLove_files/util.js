function createXMLHttpRequest() {
	var xmlHttp = null;
	try {
		xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
	}
	catch (e) {
		try {
			xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		catch (e2) {
			xmlHttp = null;
		}
	}
	if (xmlHttp == null && typeof XMLHttpRequest == "undefined") {
		xmlHttp = new XMLHttpRequest();
	}
	return xmlHttp;
}

var retMsg;

function ajaxCall(rurl, pars, asynFlag){
	$.ajax({
	   type: "POST",
	   url: rurl,
	   data: pars,
	   async: asynFlag,
	   dataType:"text",
	   success: function(msg){
	      retMsg  = msg;
	   },
	   error:function(data){
	   		
	   }
	}); 
}

function executeAjax(url, pars, asynFlag){
	if(!asynFlag){
		asynFlag=false;
	}
	ajaxCall(url, pars, asynFlag);
	return retMsg;
}

function autocomplete(idName,urls,renderItemFun,selectFun,focusFun){
	$("#"+idName).autocomplete({
		minLength: 1,
		source: function(request, response) {
			$.ajax({
				url: urls,
				type : "POST",
				dataType : 'text',
				async : false,
				cache : false,
				data:{
					likeName:request.term
				},
				success: function(data) {
					if(data)
						response(eval("("+data+")"));
					else
						response("");
				}
			});
		},
		focus: function( event, ui ) {
			//联想框触发焦点时触发
			try{
				if(focusFun){
					if(typeof(focusFun) != "function")
						eval(focusFun(event,ui));
					else
						focusFun(event,ui);
				}
			}catch(e){}
			return false;
		},
		select: function( event, ui ) {
			try{
				if(selectFun){
					if(typeof(selectFun) != "function")
						eval(selectFun(event,ui));
					else
						selectFun(event,ui);
				}
			}catch(e){}
			return false;
		}
	}).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
		var itemHtml = "";
		if(renderItemFun){
			if(typeof(renderItemFun) != "function")
				itemHtml = eval(renderItemFun(ul, item));
			else
				itemHtml = renderItemFun(ul, item);
		}
		
		return $("<li>").append(itemHtml).appendTo(ul);
	};	
}