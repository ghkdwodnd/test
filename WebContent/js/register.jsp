<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import = "java.sql.*" %>
<%@ page import = "org.json.simple.*" %>

<%
		request.setCharacterEncoding("UTF-8");
		String id = request.getParameter("id");
		String pw = request.getParameter("pw");
		
		String callback = request.getParameter("callback");
		
		Connection conn = null;
		PreparedStatement pstmt = null;
// 		ResultSet rs = null;
		JSONObject obj = new JSONObject();
// 		JSONArray arr = new JSONArray();
		int x = 0;
		
		try{
			String url = "jdbc:mariadb://localhost:33060/test";
			String did = "root";
			String dpw = "1234";
			
			Class.forName("org.mariadb.jdbc.Driver");
			
			conn = DriverManager.getConnection(url,did,dpw);
			String sql = "insert into mysns_account(mid, mpw) values(?,?)";
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, id);
			pstmt.setString(2, pw);
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
		out.println(callback + "(" + obj + ")");
%>
