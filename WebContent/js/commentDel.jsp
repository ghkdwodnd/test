<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import = "org.json.simple.*" %>
<%@ page import = "java.sql.*, java.text.*" %>
<%
	request.setCharacterEncoding("utf-8");
	String callback = request.getParameter("callback");
	String postId = request.getParameter("postId");
	
	Connection conn = null;
	PreparedStatement pstmt = null;
	ResultSet rs = null;
	JSONObject obj = new JSONObject();
	int x = 0;
	try{
		String url = "jdbc:mariadb://localhost:33060/test";
		String did = "root";
		String dpw = "1234";
		
		Class.forName("org.mariadb.jdbc.Driver");
		
		conn = DriverManager.getConnection(url,did,dpw);
		String sql = "delete from mysns_comment where pid = ?";
		pstmt = conn.prepareStatement(sql);
		pstmt.setString(1, postId);
		
		x = pstmt.executeUpdate();
		
		if(x == 1){
			obj.put("result", "success");
		}
		else{
			obj.put("result", "fail");
		}
	}catch(Exception e){
		e.printStackTrace();
	}finally{
		if(pstmt!=null) try{pstmt.close();} catch(Exception e){}
		if(conn!=null) try{conn.close();} catch(Exception e){}
	}
	out.println(callback + "(" + obj  + ")");
%>