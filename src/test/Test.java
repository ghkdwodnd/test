package test;

import java.text.SimpleDateFormat;
import java.util.Date;

public class Test {
	long time = System.currentTimeMillis(); 

	SimpleDateFormat dayTime = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss");

	String str = dayTime.format(new Date(time));
}
