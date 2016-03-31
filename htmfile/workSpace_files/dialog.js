initDialog(3);
function initDialog(endIndex){
	var idEnd;
	for(var i = 1;i <= endIndex;i++){
		idEnd = i;
		if(idEnd == 1)
			idEnd = "";
		document.writeln('<div id="winDiv'+idEnd+'" class="easyui-dialog" data-options="modal:true,closed:true" style="overflow:hidden;">');
		document.writeln("<div name='win_waiting"+idEnd+"' id='win_waiting"+idEnd+"' style='position:absolute;display:none;left:50%;top:50%;margin-left:-38px;margin-top:-38px;" +
				   "width:76px; height:76px; z-index:9999;'><img src=\"images/waiting/loading1.gif\" align=\"absmiddle\"></div>"); 
		document.writeln('<iframe name="winFrame'+idEnd+'" id="winFrame'+idEnd+'" frameBorder="0" scrolling="auto" style="width: 100%;height:100%;" allowtransparency="true"></iframe>');
		document.writeln('</div>');
	}
}
var width1 = 420;//弹出窗口，编辑页面有1列的情况
var width2 = 700;//弹出窗口，编辑页面有2列的情况
var width3 = 900;//弹出窗口，编辑页面有3列的情况
function openWindow(title,width,height,url,buttons,closeFunc,winName){
	var openFrame = "winFrame";
	var winWaiting = "win_waiting";
	if(isEmpty(winName)){
		winName = "winDiv";
	}else{
		var idx = winName.substr(winName.length - 1);
		openFrame = openFrame + idx;
		winWaiting = winWaiting + idx;
	}
	$("#"+winWaiting).css("display","");
	$("#"+openFrame).attr("src",'');
	$('#'+winName).dialog({    
	    title: title,    
	    width: width,    
	    height: height,    
	    cache: false,    
	    //href: url,    
	    modal: true,
	    closed: true, //false，不用调用open方法也可直接打开弹出窗口
	    onClose:function(){
			try{
				$("#"+openFrame).attr("src",'');
				if(closeFunc){
					if(typeof(closeFunc) != "function")
						eval(closeFunc);
					else
						closeFunc();
				}
			}catch(e){};
		},
		onMove:function(left,top){
			var isMove = false;
			if(width > $(window).width() || height > $(window).height()){
				return;
			}
			if (left < 0){
				left = 0
				isMove = true;
			}
			if (top < 0){
				top = 0
				isMove = true;
			}
			if (left + width > $(window).width()){
				left = $(window).width() - width;
				isMove = true;
			}
			if (top + height > $(window).height()){
				top = $(window).height() - height;
				isMove = true;
			}
			if(isMove){
				$('#'+winName).dialog('move',{    
				  left:left,    
				  top:top    
				});
			}
		},
		buttons:buttons
	});
	$("#"+openFrame).attr("src",url);
	//$('#'+winName).dialog('refresh', url);
	$('#'+winName).dialog('open');
	$("#"+openFrame).load(function() { 
		$("#"+winWaiting).css("display","none");
	});
}

function changeButton(buttons,winName){
	if(typeof(winName) == 'undefined' || winName == null)
		winName = "winDiv";
	$("#"+winName).dialog({buttons: buttons});
}

function closeWindow(winName){
	if(typeof(winName) == 'undefined' || winName == null)
		winName = "winDiv";
	$('#'+winName).dialog('close');
}