var pageii = "add3";
var grid = null;


function addAccount() {
	$.frontEngineDialog.executeIframeDialog('add', '新增角色', 'artDialogTest2.html?ifid='+pageii, '1000', '610');
	
	
}


//iframe 全部同级时互相获取
function getUpdata() {
	
	var getUpdataTxt=$("#getUpdata1").val();

	var ifid=$.frontEngineDialog.getUrlParameter("ifid");
	//console.log(ifid);

	//$("#"+ifid).contents().find("#getUpdata3").val(getUpdataTxt);

	//$(parent.document.getElementById('getUpdata3')).val(getUpdataTxt);
	var $pd=$(window.parent.frames[ifid].document).find("#getUpdata3");
	//$("#getUpdata3",$pd.contentWindow.document).val(getUpdataTxt);
	var $close=$(parent.document.getElementById('title:add3')).prev();
	//$close.click();
	$($pd).val(getUpdataTxt);
	console.log(getUpdataTxt);
}

//iframe 内嵌
function getUpdata2() {

	var getUpdataTxt=$("#getUpdata").val();
	console.log(parent.document.getElementById('getUpdata'));

	var $close=$(parent.document.getElementById('title:add')).prev();
	//$close.click();

}