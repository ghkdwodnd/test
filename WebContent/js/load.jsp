<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import = "org.json.simple.*" %>
<%@ page import = "java.sql.*, java.text.*" %>

	<%
		request.setCharacterEncoding("utf-8");
		String callback = request.getParameter("callback");
		
		Connection conn = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		JSONObject obj = null;
		
		try{
			String url = "jdbc:mariadb://localhost:33060/test";
			String did = "root";
			String dpw = "1234";
			
			Class.forName("org.mariadb.jdbc.Driver");
			
			conn = DriverManager.getConnection(url,did,dpw);
			String sql = "select * from mysns_post order by pid desc";
			
			pstmt = conn.prepareStatement(sql);
			rs = pstmt.executeQuery();
			obj = new JSONObject();
			JSONObject subob = null;
			JSONArray arr = new JSONArray();
			obj.put("result", "success");
			while(rs.next()){
				subob = new JSONObject();
				subob.put("id", rs.getInt("pid"));
				subob.put("subject", rs.getString("psubject"));
				subob.put("content", rs.getString("pcontent"));
				subob.put("writer", rs.getString("pwriter"));
				subob.put("writedate", rs.getString("pwritedate"));
					
				arr.add(subob);
			}
			
			obj.put("data", arr);
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			if(rs!=null) try{rs.close();} catch(Exception e){}
			if(pstmt!=null) try{pstmt.close();} catch(Exception e){}
			if(conn!=null) try{conn.close();} catch(Exception e){}
		}
		out.println(callback + "(" + obj  + ")");
	%>
