var currentUser = null; //로그인 한 사용자 정보 저장 변수
$(function() {	
    $('.Login').show();

    //회원가입 버튼
    $('.loginBtnJoin').click(function(){
        $('.Login').hide();
        $('.Join').show();
    });
    var isJoin = false;
    $('.joinBtnJoin').click(function(){
        if (isJoin) return false; //이미 회원가입 중이라면 수행하지 않음
        var id = $('.joinTxtID').val();
        var pw = $('.joinTxtPw').val();
        var pwc = $('.joinTxtPwc').val();

        if(!id){
            window.alert('아이디를 입력하세요');
            return false;
        }
        else if(!pw){
            window.alert('비밀번호를 입력하세요');
            return false;
        }
        else if(!pwc){
            window.alert('비밀번호를 확인하세요');
            return false;
        }
        else if(pw!=pwc){
            window.alert('비밀번호가 일치하지 않습니다.');
            return false;
        }
        isJoin = true;//회원가입 시도 
        $.ajax({
            url : 'http://localhost:8080/test/js/register.jsp',
            data : {id: id, pw: pw},
            dataType : 'jsonp',
            success : function(data){
            	console.log(data.result);
                if(data.result == "success"){
                    window.alert('회원가입 완료! 메인화면으로 돌아갑니다.');
                    $('.Join').hide();
                    $('.Login').show();
                }
                else{
                    window.alert('오류가 발생했습니다.');
                }
                isJoin = false;
            },
            error : function(){
                window.alert('에러왕!');
                isJoin = false;
            }
        });
    });

    $('.joinBtnCancel').click(function(){
        if(window.confirm('가입을 취소하시겠습니까?')){
            $('.Join').hide();
            $('.Login').show();
        }
    });
    //$('.Main').show();
    //글 작성화면 표시
    //$('.Write').show();
    
    //로그인 버튼
   
    var isLogin = false; //로그인 중인지 여부 파악하는 변수
    $('.loginBtnLogin').click(function(){
    	if(isLogin) return false; //이미 로그인 중이라면 수행하지 않음
    	var id = $('.loginTxtID').val();
    	var pw = $('.loginTxtPw').val();
    	if(!id){
    		window.alert('아이디를 입력하세요');
    		return false;
    	}
    	else if(!pw){
    		window.alert('비밀번호를 입력하세요');
    		return false;
    	}
    	isLogin = true;//로그인 시도
    	$.ajax({
    		url : 'http://localhost:8080/test/js/login.jsp',
    		data : {id:id, pw:pw},
    		dataType : 'jsonp',
    		success : function(data){
    			if(data.result == "success"){
    				window.alert('로그인 성공!');
    				$('.Login').hide();
    				$('.Main').show();
    				$('.NaviPadding > p').html('안녕하세요,<b>' + id + '</b>님');
    				currentUser = id;
    				loadPosts();
    			}
    			else if(data.result = "wrong"){
    				window.alert("잘못된 아이디나 비밀번호를 입력하셨습니다.");
    			}
    			else{
    				window.alert("에러왕!");
    			}
    			isLogin = false;
    		},
    		error : function(){
    			window.alert("에러왕!!");
    			isLogin = false;
    		}
    	});
    });
    
    $('.mainBtnWrite').click(function(){
    	$('.Main').hide();
    	$('.Write').show();
    	$('.writeTxtSubject').val('');
    	$('.writeTxtContent').val('');
    });
    
    $('.mainBtnLogout').click(function(){
    	if(window.confirm('로그아웃 하시겠습니까?')){
    		location.reload();
    	}
    });
    
    var isPost = false; //게시글 작성 중인지 체크하는 변수
    $('.writeBtnWrite').click(function(){
    	if(isPost) return false;
    	var subject = $('.writeTxtSubject').val();
    	var content = $('.writeTxtContent').val();
    	if(!subject){
    		window.alert('글 제목을 입력해주세요!');
    		return false;
    	}
    	else if(!content){
    		window.alert('글 내용을 입력해주세요!');
    		return false;
    	}
    	
    	if(window.confirm('글을 작성하시겠습니까?')){
    		isPost = true;
    		$.ajax({
    			url : 'http://localhost:8080/test/js/post.jsp',
    			data : {
    				subject : subject,
    				content : content,
    				writer : currentUser,
    			},
    			dataType : 'jsonp',
    			success : function(data){
    				if(data.result == "success"){
    					$('.Write').hide();
    					$('.Main').show();
    					loadPosts();
    				}
    				else{
    					window.alert("오류가 발생했습니다.");
    				}
    				isPost = false;
    			},
    			error : function(){
    				window.alert('에러왕!!');
    				isPost = false;
    			}
    		});
    	}
    });
    $('.writeBtnCancel').click(function(){
    	if(window.confirm('작성을 취소하시겠습니까?')){
    		$('.Write').hide();
    		$('.Main').show();
    		loadPosts();
    	}
    });
});


var loadPosts = function(){
	$('.Items').empty();
	//데이터를 ajax로 불러옵니다.
	
	$.ajax({
		url : 'http://localhost:8080/test/js/load.jsp',
		data : {},
		dataType : 'jsonp',
		success : function(data){
			if(data.result == "success"){
				var cnt = data.data.length;
				for(var i = 0; i<cnt; i++){
					var id = data.data[i].id;
					var subject = data.data[i].subject;
					var content = data.data[i].content;
					var writer = data.data[i].writer;
					var writedate = data.data[i].writedate;
					var item = $('<div></div>').attr('data-id',id).addClass('Item');
					var itemText = $('<div></div>').addClass('ItemText').appendTo(item);
					$('<h4></h4>').text(subject).appendTo(itemText);
					$('<h6></h6>').text('작성시간:'+writedate).appendTo(itemText);
					$('<p></p>').text(content).appendTo(itemText);
					
					if(writer == currentUser){
						var itemButtons = $('<div></div>').addClass('ItemButtons').appendTo(itemText);
						$('<button></button>').addClass('mainBtnDel AppBtnDel').text('삭제하기').appendTo(itemButtons);
					}
					//댓글
					var comment = $('<div></div>').addClass('Comment').appendTo(item);
					$('<input/>').attr({type:"text",placeholder : '댓글입력..'}).addClass('itemTxtComment').appendTo(comment);
					$('<button></button>').addClass('commentBtnWrite AppBtnBlue').text('댓글달기').appendTo(comment);
					//댓글 목록이 출력되는 곳
					$('<div></div>').addClass('Comments').appendTo(comment);
					item.appendTo($('.Items'));
					//댓글 불러오기
					loadComment(id);
				}
			}
			else{
				window.alert('오류가 발생했습니다.');
				$('.Main').hide();
				$('.Login').show();
			}
		},
		error : function(){
			window.alert('에러왕!');
			$('.Main').hide();
			$('.Login').show();
		}
	});
};


var isComment = false;//댓글을 달고 있는지 확인하는 변수
$(document.body).on('click','.commentBtnWrite',function(){
	if(isComment) return false;
	var parentId = $(this).parent().parent().attr('data-id');
	var content = $(this).prev().val();
	var comments = $(this).next();//나중에 댓글을 추가할 Comments DOM을 불러옵니다.
	if(!content){
		window.alert('댓글을 입력하세요!');
		return false;
	}
	isComment = true;
	$.ajax({
		url : 'http://localhost:8080/test/js/commentPost.jsp',
		data : {
			parentId : parentId,
			content : content,
			writer : currentUser,
		},
		dataType : 'jsonp',
		success : function(data){
			if(data.result == "success"){
				var lid = data.lastId;
				var commentItem = $('<div></div>').addClass('commentItem').attr('data-id',lid);//나중에 삭제할 때 필요한 댓글 번호
				$('<h4></h4>').text(currentUser).appendTo(commentItem);//댓글 작성자(현재 작성자)
				$('<p></p>').text(content).appendTo(commentItem);//댓글 내용
				$('<button></button>').addClass('AppBtnRed commentBtnDel').text('삭제').appendTo(commentItem);//삭제 버튼
				commentItem.appendTo(comments);
			}
			else{
				window.alert('오류가 발생했습니다.');
			}
			isComment = false;
		},
		error : function(){
			window.alert('오류가 발생했습니다.');
			isComment = false;
		}
	});
});


var loadComment = function(postId){
	if(!postId) return false;
	var target = $('div.Item[data-id='+postId+'] .comments');
	//데이터를 AJAX로 불러옵니다.
	
	$.ajax({
		url : 'http://localhost:8080/test/js/commentLoad.jsp',
		data : {postId : postId},
		dataType : 'jsonp',
		success : function(data){
			if(data.result == "success"){
				var cnt = data.data.length;
				for(var i = 0; i<cnt; i++){
					var id = data.data[i].id;
					var content = data.data[i].content;
					var writer = data.data[i].writer;
					var commentItem = $('<div></div>').addClass('CommentItem').attr('data-id',id);
					$('<h4></h4>').text(writer).appendTo(commentItem);
					$('<p></p>').text(content).appendTo(commentItem);
					$('<button></button>').addClass('AppBtnRed commentBtnDel').text('삭제').appendTo(commentItem);
					commentItem.appendTo(target);
				}
			}
			else{
				window.alert('오류가 발생했습니다.');
			}
		},
		error : function(){
			window.alert('에러왕');
		}
	});
};


$(document.body).on('click','commentBtnDel',function(){
	if(window.confirm('댓글을 삭제하시겠습니까?')){
		var id = $(this).parent().attr('data-id');
		var removeTarget = $(this).parent();
		$.ajax({
			url : 'http://localhost:8080/test/js/commentDel.jsp',
			data :{postId : id },
			dataType : 'jsonp',
			success : function(data){
				if(data.result == "success"){
					removeTarget.remove();
				}
				else{
					window.alert('오류가 발생하였습니다.');
				}
			},
			error : function(){
				window.alert('에러왕!');
			}
		});
	}
});

//작성한 글 삭제
$(document.body).on("click",".mainBtnDel",function(){
	if(window.confirm("삭제하시겠습니까?")){
		var id = $(this).parent().parent().parent().attr('data-id');
		var removeTarget = $(this).parent().parent().parent();
		$.ajax({
			url : 'http://localhost:8080/test/js/del.jsp',
			data : {postId : id},
			dataType : 'jsonp',
			success : function(){
				if(data.result == "success"){
					removeTarget.remove();
				}
				else{
					window.alert('오류가 발생하였습니다.');
				}
			},
			error : function(){
				window.alert('에러왕!');
			}
		});
	}
});
