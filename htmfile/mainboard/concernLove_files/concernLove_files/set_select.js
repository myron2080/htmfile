function set_select(objStr,theValue)
{
	var obj =eval(objStr);
	for(var i=0;i<obj.length;i++)
	{
		if(obj.options[i].value==theValue)
		{
			obj[i].selected = true ;
			return;
		}
	}
}

function set_select_obj(obj,theValue)
{
	for(var i=0;i<obj.length;i++)
	{
		if(obj.options[i].value==theValue)
		{
			obj[i].selected = true ;
			return;
		}
	}
}

function get_select_value(objs)
{
   var value = '';
   if(objs.length)
   {
       for(i = 0; i < objs.length; i++)
       {
             if (objs[i].selected)
			 {
			    value = objs[i].value;
			    break;
			 }
       }
   }
   else
   {
       value = objs.value;
   }
   return value;
}

function get_checkbox_value(objs)
{
  var value;
  if(objs.length)
   {
       for(i = 0;i < objs.length; i++)
       {
             if (objs[i].checked)
			 {
			    value = objs[i].value;
			    break;
			 }
       }
   }
   else
   {
       value = objs.value;
   }
  return value; 
}

function get_checkbox_values(objs,splits){
  var value="";
  if(splits == null || splits == "" || typeof(splits) == "undefined"){
  	  splits = ",";
  }
  if(objs.length){
       for(i = 0;i < objs.length; i++){
             if (objs[i].checked){
             	if (value != "") value += splits;
			    value += objs[i].value;
			 }
       }
   }
   else{
       value = objs.value;
   }
   /*
   try{
	   if(value.substring(value.length-splits.length)==splits){
	   	  value = value.substring(0, value.length - splits.length);
	   }
   }catch(e){}
   * */
  return value; 
}

/**
 * 操作普通select
 * @param list
 * @param obj
 * @param flag flag=0时不显示“请选择”
 * @return
 */
function changeSelect2(listStr, obj, flag){
	obj.options.length = 0;
	var optn = new Option();
	var i = 0;
	var length_ = 0;
	var list;
	if(listStr){
		list = eval("("+listStr+")");
		length_ = list.length;
	}
	if(flag != 0 || flag == null){
		optn.value = "";
		optn.text = "请选择";
		obj.options[0] = optn;
		i = 1;
		length_ = length_ + 1;
	}
	
	if(list){
		var n = 0;
		for( ;i<length_;i++){
			optn = new Option();
			optn.value = list[n].id;
			optn.text = list[n].name;
			obj.options[i] = optn;
			n++;
		}
	}
	obj.selectedIndex = 0;
}

/**
 * 2个select的选项互相交换
 * @param fbox  来源select标签
 * @param tbox  目标select标签
 */
function multiSelect(fbox,tbox)
{
	
	var lastSelect
	window.status = "";
	for(var i=0; i<fbox.options.length; i++)
	{
		if(fbox.options[i].selected && fbox.options[i].value != "")
		{
			if(!valueInMulti(tbox,fbox.options[i].value))
			{
				var no = new Option();
				no.value = fbox.options[i].value;
				no.text = fbox.options[i].text;
				tbox.options[tbox.options.length] = no;
			}
			lastSelect = i;
		}
		//fbox.options[i].selected =false;
	}
	//if(lastSelect+1<i)
	//{
		//fbox.options[lastSelect+1].selected = true;
	//}
	multiDelete(fbox);
}
/**
 * 判断移动值是否相等
 */
function valueInMulti(box,value)
{
	for(var i=0;i<box.options.length;i++)
	{
		if(box.options[i].value == value)
		{
			return true;
		}
	}
	return false;
}
/**
 * 将select的选中项删除
 * @param box  要删除选项的select标签
 */
function multiDelete(box)
{
	lastSelect = 0;
	for(var i=0;i<box.options.length;i++)
	{
		if(box.options[i].selected && box.options[i].value != "")
		{
			for(var j=i;j<box.options.length-1;j++)
			{
				box.options[j].value = box.options[j+1].value;
				box.options[j].text = box.options[j+1].text;
				box.options[j].selected = box.options[j+1].selected;
			}
			box.options.length -= 1;
			i--;
			lastSelect = i;
		}
	}
	if(lastSelect!=0&&lastSelect+1<i)
	{
		box.options[lastSelect+1].selected = true;
	}
} 
/**
 * select选项向下移动
 * @param box  要移动选项的select标签
 */
function down_Select(box){
	if(checkSelect(box)){
		var lastSelect;
		for(var i=0;i<box.options.length;i++)
		{
			if(box.options[i].selected && box.options[i].value != "")
			{
		   		flag = 0;
		   		lastSelect = i+1;
				if(i < box.options.length-1){
					var temp_text = box.options[i].text;
					var temp_value = box.options[i].value;
					box.options[i].text = box.options[i+1].text;
					box.options[i].value = box.options[i+1].value;
					box.options[i+1].text = temp_text;
					box.options[i+1].value = temp_value;
				}else{
					lastSelect = i;
					alert("该级别已是最后级别");
				}
			}
		}
		clearSelect(box);
		box.options[lastSelect].selected = true;
	}
}
/**
 * 清空select
 选中项中
 * @param box  要移动选项的select标签
 */
function clearSelect(box){
	for(var i=0;i<box.options.length;i++)
	{
		box.options[i].selected = false;
	}
}
/**
 * select选项移动时只能选择一项进行移动，判断是否是选中了多行
 * @param box  要移动选项的select标签
 */
function checkSelect(box){
	var count = 0;
	for(var i=0;i<box.options.length;i++)
	{
		if(box.options[i].selected && box.options[i].value != "")
		{
			count++;
		}
	}
	if(count>1 || count == 0){
		alert("上下移动时请选择一项进行移动");
		return false;
	}
	return true;
}
/**
 * select选项向上移动
 * @param box  要移动选项的select标签
 */
function up_Select(box){
	if(checkSelect(box)){
		var lastSelect;
		for(var i=0;i<box.options.length;i++)
		{
			if(box.options[i].selected && box.options[i].value != "")
			{
				lastSelect = i-1;
				if(i > 0){
					var temp_text = box.options[i].text;
					var temp_value = box.options[i].value;
					box.options[i].text = box.options[i-1].text;
					box.options[i].value = box.options[i-1].value;
					box.options[i-1].text = temp_text;
					box.options[i-1].value = temp_value;
				}else{
					lastSelect = i;
					alert("该级别已是第一级别");
				}
			}
		}
		clearSelect(box);
		box.options[lastSelect].selected = true;
	}
}

function getSelectedIds(){
	var box = document.getElementById("list2");
	var roleIds="";
	for(var i=0;i<box.options.length;i++)
	{
		if(box.options[i].value != "")
		{
			roleIds += box.options[i].value+",";	
		}
	}
	return roleIds.substr(0,roleIds.length-1);
}