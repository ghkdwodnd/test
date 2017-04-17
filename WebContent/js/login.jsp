<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@page import = "org.json.simple.*" %>
<%@page import = "java.sql.*" %>
	<%
		request.setCharacterEncoding("utf-8");
		String id = request.getParameter("id");
		String pw = request.getParameter("pw");
		String callback = request.getParameter("callback");
		
		Connection conn = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		JSONObject obj = new JSONObject();
		
		try{
			String url = "jdbc:mariadb://localhost:33060/test";
			String did = "root";
			String dpw = "1234";
			
			Class.forName("org.mariadb.jdbc.Driver");
			
			conn = DriverManager.getConnection(url,did,dpw);
			String sql = "select * from mysns_account where mid = ? and mpw =?";
			
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, id);
			pstmt.setString(2, pw);
			rs = pstmt.executeQuery();
			if(rs.next()){
				String dbpw = rs.getString("mpw");
				if(pw.equals(dbpw)){
					obj.put("result", "success");
				}
				else{
					obj.put("result", "wrong");
				}
			}
			else{
				obj.put("result", "zero!");
			}
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			if(rs!=null) try{rs.close();} catch(Exception e){}
			if(pstmt!=null) try{pstmt.close();} catch(Exception e){}
			if(conn!=null) try{conn.close();} catch(Exception e){}
		}
		out.println(callback + "(" + obj + ")");
	%>
