function check_all(form,obj)
{
	var checkall =  form.checkAll.checked;
	if(obj){
		if(obj.length){
			for(var i=0;i<obj.length;i++){
				if(!obj[i].disabled){
					obj[i].checked = checkall;
				}
			}
		}
		else{
			if(!obj.disabled)
				obj.checked = checkall;
		}
	}
}

function check_item(form,obj)
{
	var flag = true;
	if(obj)
	{
		if(obj.length)
		{
			for(var i = 0;i < obj.length;i++ )
			{
				if(!obj[i].checked)
                {
					flag = false;
                    break;
               }
			}
		}
		else
		{
			if(!obj.checked)
				flag = false;
		}
		if(flag)
			form.checkAll.checked = true;
		else
			form.checkAll.checked = false;
	}
}

function check_un(form,obj)
{
	if(obj)
	{
		if(obj.length)
		{
			for(var i=0;i<obj.length;i++)
			{
				obj[i].checked = !obj[i].checked;
			}
		}
		else
		{
			obj.checked = !obj.checked;
		}
		check_item(form,obj);
	}
}

function check_obj(obj)
{
	var num = 0;
	if(obj)
	{
		if(obj.length > 0)
		{
			for(var i=0;i<obj.length;i++)
			{
				if(obj[i].checked)
				{
					num++;
				}
			}
		}
		else
			if(obj.checked)
				num ++;
	}
	return num;
}

/**
 * checkSelect校验选择项
 * @param obj 校验对象
 * @param multiple 是否多选，默认false
 * @param multipleDesc 单选时提示前缀描述，如"XX只能选择一项"
 */
function checkSelect(obj,multiple,multipleDesc){
	var pp = parent;
	var selectNum = check_obj(obj);
	if(pp.isEmpty(multiple)){
		multiple = false;
	}
	var msg = "请至少选择一项！";
	if(selectNum <= 0){
		if(!multiple)
			msg = "请选择一项！";
		pp.$.messager.alert('操作提示', msg, "warning");
	    return false;
	}
	if(selectNum != 1 && !multiple){
		msg = multipleDesc+"只能选择一项！";
		pp.$.messager.alert('操作提示', msg, "warning");
        return false;
    }

	return true;
}
