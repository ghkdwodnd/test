<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import = "org.json.simple.*" %>
<%@ page import = "java.sql.*, java.text.*" %>
	<%
		request.setCharacterEncoding("utf-8");
		String subject = request.getParameter("subject");
		String content = request.getParameter("content");
		String writer = request.getParameter("writer");
		
		long time = System.currentTimeMillis(); 
		SimpleDateFormat dayTime = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		String str = dayTime.format(new Date(time));
		
		String callback = request.getParameter("callback");
		Connection conn = null;
		PreparedStatement pstmt = null;
		
		JSONObject obj = new JSONObject();
		int x = 0;
		try{
			String url = "jdbc:mariadb://localhost:33060/test";
			String did = "root";
			String dpw = "1234";
			
			Class.forName("org.mariadb.jdbc.Driver");
			
			conn = DriverManager.getConnection(url,did,dpw);
			
			String sql = "insert into mysns_post(psubject, pcontent, pwritedate,pwriter) ";
			sql += "values(?,?,?,?)";
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, subject);
			pstmt.setString(2, content);
			pstmt.setString(3, str);
			pstmt.setString(4, writer);
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