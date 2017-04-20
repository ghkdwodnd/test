<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="org.json.simple.JSONObject"%>
<%@ page import="java.sql.*" %>

<%
	request.setCharacterEncoding("UTF-8");
	response.setCharacterEncoding("UTF-8");
	
	String postId = request.getParameter("postId");
	
	Connection con = null;
	ResultSet rs = null;
	PreparedStatement pstmt = null;
	String sql;
	String callback = request.getParameter("callback");
	int cnt = 0;
	try{
		String url="jdbc:mariadb://localhost:33060/test";
		String id = "root";
		String pw = "1234";
		
		Class.forName("org.mariadb.jdbc.Driver");
		con = DriverManager.getConnection(url, id, pw);
	}catch(Exception e){out.println(e);}
	
	try{
		// 댓글 삭제
		sql = "delete from mysns_comment where pparent=?";
		pstmt = con.prepareStatement(sql);
		pstmt.setString(1, postId);
		pstmt.executeUpdate();
		// 게시글 삭제
		sql = "delete from mysns_post where pid=?";
		pstmt = con.prepareStatement(sql);
		pstmt.setString(1, postId);
		cnt = pstmt.executeUpdate();
	}catch(Exception e){e.printStackTrace();}
	JSONObject jsonObj = null;
	
	if(cnt > 0){
		jsonObj = new JSONObject();
		jsonObj.put("result", "success");
	}
	String jsonSt = jsonObj.toJSONString();
	
	out.println(callback + "(");
	out.println(jsonSt);
	out.println(")");
%>


