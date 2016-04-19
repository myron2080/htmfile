   <%@page import="com.wuyizhiye.framework.util.Uploader"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
        pageEncoding="utf-8"%>
        <%@ page import="java.io.BufferedReader"%>
    <%@ page import="java.io.IOException"%>
    <%@ page import="java.io.InputStream"%>
    <%@ page import="java.io.InputStreamReader"%>
    <%@ page import="java.io.OutputStream"%>
    <%@ page import="java.io.File"%>
    <%@ page import="java.io.FileOutputStream"%>
    <%@ page import="java.util.Date"%>
    <%@page import="com.wuyizhiye.base.util.StringUtils"%>
     <%@page import="com.wuyizhiye.base.util.SystemConfig"%>

    <%
    request.setCharacterEncoding("utf-8");
	response.setCharacterEncoding("utf-8");
	
	String param = request.getParameter("action");
    Uploader up = new Uploader(request);
    String direct = request.getParameter("direct");
    String savePath = SystemConfig.getParameter("image_path") + (StringUtils.isEmpty(direct)?"":("/"+direct));
    up.setSavePath(savePath);
    String[] fileType = {".gif" , ".png" , ".jpg" , ".jpeg" , ".bmp"};
    up.setAllowFiles(fileType);
    up.setMaxSize(10000); //单位KB
    
    if(param!=null && param.equals("tmpImg")){
    	up.upload();
    	out.print("<script>parent.ue_callback('" + up.getUrl() + "','" + up.getState() + "')</script>");
    }else{
    	up.uploadBase64("content");
    	response.getWriter().print("{'url':'" + up.getUrl()+"',state:'"+up.getState()+"'}");
    }
    
    %>
