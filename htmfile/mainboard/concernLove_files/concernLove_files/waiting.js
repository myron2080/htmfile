function waiting_init()
{
	document.write("<div name='div_waiting' id='div_waiting' style='position:absolute; display:none;" +
				   "left:0px; top:0px; width:76px; height:76px; z-index:9999;'><img src=\"../images/waiting/loading1.gif\" align=\"absmiddle\"></div>"); 
	   
}
waiting_init();
function waiting()
{
	
	document.getElementById("div_waiting").style.left = (document.body.offsetWidth - parseInt(document.getElementById("div_waiting").style.width))/2 + 'px';
	document.getElementById("div_waiting").style.top = (document.body.offsetHeight - parseInt(document.getElementById("div_waiting").style.height))/2 + 'px';
	document.getElementById("div_waiting").style.display = "";
}
function waiting_stop()
{
	eval("div_waiting").style.display = "none";
}
