<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import = "org.json.simple.*" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>
	<%
		JSONObject obj = new JSONObject();
		JSONObject subob = new JSONObject();
		JSONArray arr = new JSONArray();
		obj.put("result", "success");
		for(int i = 0;i<6;i++){
			subob.put("id", 1);
			subob.put("subject", 2);
			subob.put("content", 3);
			subob.put("writer", 4);
			subob.put("writedate", 5);
			arr.add(subob);
		}
		
		
		String arrst = arr.toJSONString();
		obj.put("data", arr);
		
		out.println("(" + obj  + ")");
		
		
	%>
</body>
</html>