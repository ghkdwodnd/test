<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import = "org.json.simple.*" %>
<%@ page import = "java.sql.*, java.text.*" %>
<%
		request.setCharacterEncoding("utf-8");
		String callback = request.getParameter("callback");
		String parentId = request.getParameter("parentId");
		String content = request.getParameter("content");
		String writer = request.getParameter("writer");
		
		long time = System.currentTimeMillis(); 
		SimpleDateFormat dayTime = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		String str = dayTime.format(new Date(time));
		
		
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
			
			String sql = "insert into mysns_comment(pparent,pcontent,pwritedate,pwriter)";
			sql += "values(?,?,?,?)";
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, parentId);
			pstmt.setString(2, content);
			pstmt.setString(3, str);
			pstmt.setString(4, writer);
			x = pstmt.executeUpdate();
			if(x == 1){
				obj.put("result", "success");
				rs = pstmt.executeQuery();
				if(rs.next()){
					obj.put("lastId", rs.getInt("pid"));
				}
			}
			else{
				obj.put("result", "nope!");
			}
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			if(pstmt!=null) try{pstmt.close();} catch(Exception e){}
			if(conn!=null) try{conn.close();} catch(Exception e){}
		}
		out.println(callback + "(" + obj + ")");
%>