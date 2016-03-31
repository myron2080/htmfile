//处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外
function banBackSpace(e){   
    var ev = e || window.event;//获取event对象   
    var obj = ev.target || ev.srcElement;//获取事件源   
    
    var t = obj.type || obj.getAttribute('type');//获取事件源类型  
    
    //获取作为判断条件的事件类型
    var vReadOnly = obj.getAttribute('readonly');
    var vEnabled = obj.getAttribute('enabled');
    //处理null值情况
    vReadOnly = (vReadOnly == null) ? false : vReadOnly;
    vEnabled = (vEnabled == null) ? true : vEnabled;
    
    //当敲Backspace键时，事件源类型为密码或单行、多行文本的，
    //并且readonly属性为true或enabled属性为false的，则退格键失效
    var flag1=(ev.keyCode == 8 && (t=="password" || t=="text" || t=="textarea") 
                && (vReadOnly==true || vEnabled!=true))?true:false;
   
    //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
    var flag2=(ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea")
                ?true:false;        
    
    //判断
    if(flag2){
        return false;
    }
    if(flag1){   
        return false;   
    }   
}

function trim(str){
	if(isEmpty(str))
		return "";
		
	return str.replace(/(^\s*)|(\s*$)/g, "");	
}

function toJson(str){
	str=str.replace(/{/g,"{\"");
    str=str.replace(/=/g,"\":\"");
    str=str.replace(/,/g,"\",\"");
    str=str.replace(/}/g,"\"}");
    str=str.replace(/}\",\"{/g,"},{");
    str=str.replace(/ /g,"");
    var aa = eval('(['+str+'])');
    return aa;
}

function isFloat(value){
	if(!(/^([-]){0,1}([0-9]){1,}([.]){0,1}([0-9]){0,}$/.test(value)))
		return false;

	return true;
}
/**
 * 只能输入数字
 */
function isNum(value){
	if(!(/^[\d]*$/.test(value)))
		return false;

	return true;
}

/**
 * 清空/填充文本框默认值
 * param obj:校验文本框对象
 */
function changeValue(obj){
	if(typeof(obj) == "string"){
		obj = document.getElementById(obj);
	}
	obj.onfocus=function(){
		if(this.defaultValue == this.value){
			this.value = "";
		}
	}
	obj.onblur=function(){
		if("" == this.value){
			this.value = this.defaultValue;
		}
	}
}
/**
 * 格式化数字
 * param src:值
 * param pos:精确小数位
 */
function fomatFloat(src,pos){
	if(src == null || src == "" || isNaN(parseFloat(src))){
		src = 0;
	}
	src = parseFloat(src);
	if(pos && pos != "")
		src = src.toFixed(pos);
    return src;
}
//判断对象是否存在
function isEmpty(obj){
	return obj == null || obj == "" || obj == "null" || typeof(obj) == "undefined";
}
/**
 * 校验数据是否为空
 * param id:校验id
 * param obj:校验对象
 * param msg:提示信息
 * param validType:校验类型（1文本框2普通下拉框3树状结构下拉框）默认为1
 * param icon:提示图标(默认warning)
 * param fn:回调函数
 */
function validData(id,msg,validType,obj,icon,fn){
	var returnVal = true;
	var val = "";
	if(isEmpty(obj))
		obj = winFrame;
	
	obj = obj.$("#"+id);
	if(isEmpty(validType) || validType == 1){
		val = obj.val();
	}else if(validType == 2){
		val = obj.combobox("getValue");
	}else if(validType == 3){
		val = obj.combotree("getValue");
	}
	
	if(trim(val) == ""){
		if(isEmpty(icon)){
			icon = "warning";
		}
		$.messager.alert('操作提示',msg,icon,function(){
			try{
				if(isEmpty(validType) || validType == 1){
				 	obj.focus();
				}else if(validType == 2){
				 	obj.combobox().next('span').find('input').click();
				}else if(validType == 3){
					obj.combotree().next('span').find('input').click();
				}
			 	
			 	if(!isEmpty(fn)){
			 		fn();
			 	}
		 	 }catch(e){}
		});
	   	returnVal = false;
	}
	
	return returnVal;
}

function opennew(newurl,width,height,scrollbars)
{
	var returnValue;
	var theLeft,theTop
	width = screen.width;
	height = screen.height;
	theLeft=(screen.width-width)/2-2
	theTop=(screen.height-height)/2
	returnValue = window.open(newurl,"",'width='+width+',height='+height+',scrollbars='+scrollbars+',status=0,toolbar=0,resizable=1,left='+theLeft+',top='+theTop);
	returnValue.focus();
	return returnValue;
}