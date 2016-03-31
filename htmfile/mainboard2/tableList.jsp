﻿<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/common/meta.jsp"%>
<!--[if IE 8]>
<html lang="en" class="ie8 no-js">
<![endif]-->
<!--[if IE 9]>
<html lang="en" class="ie9 no-js">
<![endif]-->
<!--[if !IE]><!-->
<html lang="en">
<!--<![endif]-->
<!-- BEGIN HEAD -->
<head>
<meta charset="utf-8">
<title>养老服务信息平台</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta content="webkit" name="renderer">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<meta content="" name="description">
<meta content="" name="author">
<!-- BEGIN 全局CSS -->
<link rel="stylesheet" type="text/css" href="${ctx}/scripts/plugins/jquery-easyui/themes/default/easyui.css">
<link rel="stylesheet" type="text/css" href="${ctx}/scripts/plugins/jquery-easyui/themes/icon.css">
<!-- END 全局CSS -->
<!-- BEGIN 页面CSS -->
<link rel="stylesheet" type="text/css" href="${local}/mainboard/css/tableList.css">
<!-- END 页面CSS -->
</head>
<!-- END HEAD -->
<!-- BEGIN BODY -->
<body class="page-left-content">
<!-- BEGIN 页面主体 -->
<!--  <h2>详细信息列表</h2> -->
	<div class="block form-query">
		<form id="form-query">
		<input type="hidden" id="listType" value="normal"/>
		<input type="hidden" id="menuId" value="${menuId}"/>
		<table  width="100%" border="0" cellpadding="0" cellspacing="0" class="noborder" style="margin:10px;">
			<tr style="display:none;">
				<td class="search-title" colspan="7"><img border="0" align="absmiddle" src=""><strong>查询</strong></td>
			</tr>
			<tr>
				<th class="align-right">姓名：</th>
				<td class="align-left"><input type="text" id="elderName" name="elderName"  class="query" original=""/></td>
				<th class="align-right">身份证号：</th>
				<td class="align-left"><input type="text" id="idCard" name="idCard"  class="query" original=""/></td>
				<th class="align-right">地址：</th>
				<td class="align-left"><input type="text" id="address" name="address"  class="query" original=""/></td>
				<td>
					<input type="button" value="&nbsp;&nbsp;查&nbsp;&nbsp;询&nbsp;&nbsp;" class="form-button-query" onclick="onquery();"/>&nbsp;
					<input type="button" value="&nbsp;&nbsp;清&nbsp;&nbsp;空&nbsp;&nbsp;" class="button" onclick="onclear();"/>
				</td>
			</tr>
		</table>
		</form>
	</div>
	
	<br/>
	
	<div id="toolbar">
	<!-- <button type="button" id="toolbar-new-btn">New</button><input id="search-txt" type="text"><button id="toolbar-search-btn" type="button">Search</button> -->
	</div>
	<!-- BEGIN datagrid -->
	<table id="datagrid" title="详细信息列表" class="table table-condensed"></table>
	<!-- END datagrid -->
	
	<!--BEGIN dialog -->
<div id="datagridDialog" class="easyui-dialog" title="My Dialog" style="width:700px;height:600px;"   
        data-options="iconCls:'icon-save',resizable:true,modal:true"> 
</div>
	<!-- END dialog -->
	
	<!-- BEGIN datagridMenu -->
	<div id="datagridMenu" class="easyui-menu" style="width:120px;">
		<ul>
		</ul>
	</div>
	<!-- END datagridMenu -->
	<!-- dialog
	<div id="dialog" class="easyui-dialog" title="My Dialog" style="width:700px;height:600px;" data-options="iconCls:'icon-save',resizable:true,modal:true"> 
	</div>
	<!-- dialog -->
<!-- BEGIN JAVASCRIPTS -->
<!-- BEGIN 核心JS库 -->
<script type="text/javascript" src="${ctx}/scripts/plugins/jquery-1.11.0.js"></script>
<script type="text/javascript" src="${ctx}/scripts/plugins/jquery-easyui/jquery.easyui.min.js"></script>
<script type="text/javascript" src="${ctx}/scripts/base/front-engine/front-engine.js"></script>
<!-- END 核心JS库 -->
<!-- BEGIN 页面JS -->
<script type="text/javascript" src="${local}/mainboard/js/tableList.js"></script>
<script>
jQuery(document).ready(function() {
	// 初始化页面
	List.init({
	});
});
</script>
<!-- END 页面JS -->
</body>
<!-- END BODY -->
</html>