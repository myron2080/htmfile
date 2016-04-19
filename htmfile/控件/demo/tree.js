//引用jquery.ztree.core-3.5.js树形js基类
//数据源,从jsp获得,必须是json数据格式
//具体详细功能可看menu_list.jsp 和menu_role.jsp
var zNodes = [
{"id":1, "pId":0, "name":"test1","checked":true,"url":'xxx'},
{"id":2, "pId":0, "name":"test2","checked":false},
{"id":3, "pId":0, "name":"test3","checked":false},
{"id":4, "pId":1, "name":"test11","checked":false},
{"id":5, "pId":1, "name":"test12","checked":false},
{"id":6, "pId":2, "name":"test21","checked":false},
{"id":7, "pId":6, "name":"test211","checked":false},
{"id":8, "pId":6, "name":"test212","checked":false},
{"id":9, "pId":7, "name":"test2111","checked":false},
{"id":10, "pId":8, "name":"test2121","checked":false},
{"id":11, "pId":9, "name":"test21111","checked":false},
{"id":12, "pId":10, "name":"test21211","checked":false},
{"id":13, "pId":11, "name":"test211111","checked":false}
];
//数据属性
//tId：每一个节点唯一标示,name:节点名称，checked:true是否选中,icon:"/img/parent.gif"父节点展开和折叠图标,iconOpen:"/img"展开图标,iconClose:"url"折叠时的的图标
//保存节点的其他自定义数据信息时可以自己随意定义，不要与 zTree 使用的属性相同即可以上数据中id和pid数据属于自定义数据
//获取节点上的数据：treeNode.id,treeNode.pId

var tree_setting = {
	check : {//单选或复选框 使用此功能需要引入jquery.ztree.excheck-3.5.js 扩展
		enable : true,//是否显示,默认为false不显示
		chkStyle:"checkbox",//勾选框类型(checkbox 或 radio）时生效
		chkboxType : {//复选框 chkStyle:"checkbox"才生效
			"Y" : "ps",//Y 属性定义 checkbox 被勾选后的情况;N 属性定义 checkbox 取消勾选后的情况； "p" 表示操作会影响父级节点；"s" 表示操作会影响子级节点。
			"N" : "ps"
		},
		radioType:"level" //单选框chkStyle:"radio"时生效radioType = "level" 时，在每一级节点范围内当做一个分组；radioType = "all" 时，在整棵树范围内当做一个分组。
	},
	data : {//数据
		simpleData : {
			enable : true,//true / false 分别表示 使用 / 不使用 简单数据模式 默认false，一般使用简单数据方式
			idKey:"id",//节点数据中保存唯一标识的属性名称     默认值："id"
			pIdKey:"pId"//点数据中保存其父节点唯一标识的属性名称    默认值："pId"
		}
	},
	view: {//视图
		showIcon: true,//true / false 分别表示 显示 / 隐藏 图标  默认值为true
		showLine: true,//true / false 分别表示 显示 / 不显示 连线 默认值为true
		addHoverDom:addHoverDoms,//自定义函数用于当鼠标移动到节点上时，显示用户自定义控件可以用该函数加一个新增节点功能
		removeHoverDom:removeHoverDoms//用于当鼠标移出节点时，隐藏用户自定义控件
	},
	edit:{//编辑此功能需引用jquery.ztree.exedit-3.5.js 扩展
		enable:true,//true / false 分别表示 可以 / 不可以 编辑 默认值: false 为false时edit设置无效
		drag:{
			isCopy:true,//拖拽时, 设置是否允许复制节点
			isMove:true,//拖拽时, 设置是否允许移动节点 默认值：true
			prev:true,//true / false 分别表示 允许 / 不允许 移动到目标节点前面 默认值：true
			next:true,//true / false 分别表示 允许 / 不允许 移动到目标节点后面 默认值：true
			inner:true//true / false 分别表示 允许 / 不允许 成为目标节点的子节点 默认值：true
		},
		removeTitle : "删除菜单项", //删除按钮的信息
		renameTitle : "修改菜单项",//编辑按钮的信息
		showRemoveBtn:true, //true/ false 分别表示 显示 / 隐藏 删除按钮默认值：true 当点击某节点的删除按钮时：
		//1、首先触发 setting.callback.beforeRemove 回调函数，用户可判定是否进行删除操作。
		//2、如果未设置 beforeRemove 或 beforeRemove 返回 true，则删除节点并触发 setting.callback.onRemove 回调函数。
		showRenameBtn:true//true/ false 分别表示 显示 / 隐藏 编辑按钮默认值：true 
	},
	callback:{//回调函数
		beforeRemove:zTreeBeforeRemove,//自定义回调函数返回值是 true / false如果返回 false，zTree 将不删除节点，也无法触发 onRemove 事件回调函数
		beforeEditName:zTreeBeforeEditName,//自定义函数返回值是 true / false 如果返回 false，节点将无法进入 zTree 默认的编辑名称状态
		beforeDrag:beforeDrag,//自定义函数移动节点前函数如果返回 false，zTree 将终止拖拽也无法触发 onDrag / beforeDrop / onDrop 事件回调函数
		beforeDrop:beforeDrop//自定义函数移动节点后函数
	}
	
};
//初始化树形方法
jQuery(function($) {
	$.fn.zTree.init($("#menu_tree"), tree_setting, zNodes);
});
//删除节点前函数
function zTreeBeforeRemove(treeId, treeNode) {
	//此处可以弹出删除判断提示
	var zTree = $.fn.zTree.getZTreeObj("menu_tree");
	zTree.selectNode(treeNode);
	alert("要删除["+treeNode.name+"]?");
	return false;
}
//编辑节点前函数
function zTreeBeforeEditName(treeId, treeNode) {
	alert('编辑前');
	return false;
}
//移动节点前调用函数
function beforeDrag(treeId, treeNodes) {
	//操作多个节点时treeNodes是数组对象
	alert('要移动'+treeNodes[0].id+"么？");
	return true;
}//移动节点后调用函数
function beforeDrop(treeId, treeNodes, targetNode, moveType) {
	alert('移动成功');
	return true;
}
//鼠标移动到节点上
function addHoverDoms(treeId, treeNode) {
	var sObj = $("#" + treeNode.tId + "_span");
	if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
	var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
		+ "' title='add node' onfocus='this.blur();'></span>";
	sObj.after(addStr);
	var btn = $("#addBtn_"+treeNode.tId);
	if (btn) btn.bind("click", function(){
		alert("单击添加了");
		return false;
	});
}
//鼠标移出节点时
function removeHoverDoms(treeId, treeNode) {
	$("#addBtn_"+treeNode.tId).unbind().remove();
}