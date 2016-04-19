<%@page import="com.wuyizhiye.base.util.StringUtils"%>
<%@page import="com.wuyizhiye.base.util.SystemConfig"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
        pageEncoding="utf-8"%>
    <%@page import="com.wuyizhiye.framework.util.Uploader"%>

    <%
    request.setCharacterEncoding("utf-8");
	response.setCharacterEncoding("utf-8");
    Uploader up = new Uploader(request);
    String direct = request.getParameter("direct");
    up.setSavePath(SystemConfig.getParameter("image_path") + (StringUtils.isEmpty(direct)?"":("/"+direct)));
    String[] fileType = {".gif" , ".png" , ".jpg" , ".jpeg" , ".bmp"};
    up.setAllowFiles(fileType);
    up.setMaxSize(10000); //单位KB
    up.upload();
    response.getWriter().print("{'original':'"+up.getOriginalName()+"','url':'"+up.getFilePath()+"','title':'"+up.getTitle()+"','state':'"+up.getState()+"'}");
    %>
