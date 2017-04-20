$(function(){
    $('.Login').show();
    $('.Main').hide();

    $('.loginBtnJoin').on("click",function(){
        $('.Login').hide();
        $('.Join').show();


    });

        var currentUser = null;
        var isLogin = false;

    $('.loginBtnLogin').on("click",function(){
        if(isLogin) return false;
        var id = $('.loginTxtID').val();
        var pw = $('.loginTxtPw').val();
        alert(id);
        if(!id){
            window.alert('아이디 입력좀');
            return false;
        }else if(!pw){
            window.alert('비밀번호 입력좀')
            return false;
        }
        isLogin=true;
        $.ajax({
            url:'http://localhost:8080/test/js/login.jsp',
            data:{id:id, pw:pw},
            dataType:'jsonp',
            success:function(data){
                if(data.result== 'success')
                {
                    $('.Login').hide();
                    $('.Main').show();
                    $('.user').text(id);
                    loadPosts();
                }
                else{
                    alert("뭔가가 잘못됫다");
                    isLogin = false;
                }
            },
            error:function(){
                window.alert('실패다')
                isLogin = false;
            }
        });
    });

    $('.joinBtnCancel').click(function(){
        if(window.confirm("가입을 취소 하시겠습니까?")){
            $('.Join').hide();
            $('.Login').show();
        }

    });
    var isJoin=false;
    $('.joinBtnJoin').click(function(){
        if(isJoin) return false;
        var cid=$('.joinTxtID').val();
        var cpw=$('.joinTxtPw').val();
        var cpwc=$('.joinTxtPwc').val();
        
        if(!cid)
        {
            window.alert('아이디를 입력하세요');
            return false;
        }
        else if(!cpw){
            window.alert('패스워드를 입력하세요!');
            return false;
        }
         else if(!cpwc){
            window.alert('패스워드 확인를 입력하세요!');
            return false;
        }
         else if(cpw != cpwc){
            window.alert('패스워드가  일치하지 않습니다!');
            return false;
        }
        isJoin = true;


        $.ajax({
            url:'http://localhost:8080/test/js/register.jsp',
            data:{id:cid,pw:cpw},
            dataType:'jsonp',
            success:function(data){
                //console.log(data);
                if(data.result== 'success')
                {
                    alert("회원가입완료");
                    $('.Join').hide();
                    $('.Login').show();
                }
                else{
                    alert("회원가입시 서버와 통신에서 문제 발생!!!");
                    isJoin = false;
                }
            },
            error:function(){
               alert("회원가입시 오류발생!!!"); 
               isJoin = false;
            }
        });
    });

 // $('.Write').show();
    /* 메인화면 */
    // 메인화면을 표시
    // $('.Main').show();
    $('.mainBtnWrite').click(function(){
        $('.Main').hide();
        $('.Write').show();
        $('.writeTxtSubject').val('');
        $('.writeTxtContent').val('');
    });
    $('.mainBtnLogout').click(function(){
        if (window.confirm('로그아웃?')) {
            location.reload();  
        }
    });
    var isPost = false;
    $('.writeBtnWrite').click(function(){
        if(isPost) return false;
        var subject = $('.writeTxtSubject').val();
        var content = $('.writeTxtContent').val();
        if(!subject){
            window.alert("제목을 입력하세요");
            return false;
        }else if(!content){
            window.alert("글 내용을 입력하세요");
            return false;
        }

        if(window.confirm("글을 작성하시겠습니까?")){
            isPost = true;
            $.ajax({
                url:'http://localhost:8080/test/js/post.jsp',
                data:{subject:subject, //server변수:client변수, key:value
                    content:content,
                    writer: currentUser
                },
                dataType:'jsonp',
                success:function(data){
                    if(data.result =='success'){
                        $('.Write').hide();
                        $('.Main').show();
                        loadPosts();
                    }else{
                        window.alert("서버를 싼거 쓰지말고 비싼것 좀 쓰자 인간적으로");
                        
                    }
                    isPost=false;
                },//성공 콜백함수
                error:function(){
                    window.alert("인터넷 좀 비싼거 쓰자 발생");
                    isPost=false;
                }//실패 콜백함수
            });
        }
    });
    $('.writeBtnCancel').click(function(){
        if(window.confirm("작성을 취소합니까?")){
            $('.Write').hide();
            $('.Main').show();
        }
    });

    var loadPosts = function(){
        $('.Items').empty();

        $.ajax({
            url:'http://localhost:8080/test/js/load.jsp',
                data:{},
                dataType:'jsonp',
            success:function(data){
                if(data.result=="success"){
                    var cnt = data.data.length; //서버로부터 오는 data.  제이슨 데이터 data.length
                    for(var i = 0; i<cnt; i++){
                        var id = data.data[i].id;
                        var subject = data.data[i].subject;
                        var content = data.data[i].content;
                        var writer = data.data[i].writer;
                        var writedate = data.data[i].writedate;

                        var item = $('<div></div>').attr('data-id', id).addClass('Item'); // <div class='Item' data-id = '1'></div>
                        var itemText = $('<div></div>').addClass('ItemText').appendTo(item); // <div class='Item' data-id = '1'><div class='ItemText'></div></div>

                        $('<h4></h4>').text(subject).appendTo(itemText);
                        $('<h6></h6>').text('작성시간 :' + writedate).appendTo(itemText);
                        $('<p></p>').text(content).appendTo(itemText);

                        if(writer == currentUser){
                            var itemButtons = $('<div></div>').addClass('ItemButtons').appendTo(itemText);
                            $('<button></button>').addClass('mainBtnDel AppBtnRed').text('삭제하기').appendTo(itemButtons);
                        }

                        var comment = $('<div></div>').addClass('Commment').appendTo(item);

                        $('<input />').attr({type:'text', placeholder:'댓글입력'}).addClass('itemTxtComment').appendTo(comment);
                        $('<button></button>').addClass('commentBtnWrite AppBtnBlue').text('댓글달기').appendTo(comment); 

                        $('<div></div>').addClass('Comments').appendTo(comment);

                        item.appendTo($('.Items'));

                        loadComment(id);
                    }
                }
                    else{
                    window.alert('서버 오류가 발생햇다고요');
                    $('.Main').hide();
                    $('.Login').show();
                    }
            },
            error:function(){
                window.alert('오류다 또 오류라고!!');
                    $('.Main').hide();
                    $('.Login').show();
            }
   
        });  
    };
    var loadComment = function(PostId){
        if(!PostId) return false;
        var target = $('div.Item[data-id='+PostId+'] .Comments');

        $.ajax({
            url:'http://localhost:8080/test/js/commentLoad.jsp',
            data:{
                postId : PostId
            },
            dataType:'jsonp',
            success:function(data){
                if(data.result == "success"){
                    var cnt = data.data.length;

                    for(i=0; i<cnt; i++){
                        var id = data.data[i].id;
                        var content = data.data[i].content;
                        var writer = data.data[i].writer;

                        var commentItem = $('<div></div>').addClass('CommentItem').attr('data-id', id);
                        $('<h4></h4>').text(writer).appendTo(commentItem);
                        $('<p></p>').text(content).appendTo(commentItem);
                        $('<button></button>').addClass('AppBtnRed commentBtnDel').text('삭제').appendTo(commentItem);

                        commentItem.appendTo(target);
                    }
                }else{
                    window.alert('오류발생')
                }
            },
            error:function(){
                window.alert('오류발생')

            }
        });
    };

    var isComment = false;
    $(document.body).on('click', '.commentBtnWrite', function(){
        if(isComment) return false;

        var parentId = $(this).parent().parent().attr('data-id');
        var content = $(this).prev().val();
        var comments = $(this).next();

        if(!content){
            window.alert('댓글입력');
            return false;
        }
        isComment = true;
    
    $.ajax({
        url:'http://localhost:8080/test/js/commentPost.jsp',
        data:{
            parentId : parentId,
            content :content,
            writer : currentUser
        },
        dataType:'jsonp',
        success:function(data){
            if(data.result == "success"){
                var lid = data.lastId;
                var commentItem = $('<div></div>').addClass('CommentItem').attr('data-id', lid);
                $('<h4></h4>').text(currentUser).appendTo(commentItem);
                $('<p></p>').text(content).appendTo(commentItem);
                $('<button></button>').addClass('AppBtnRed commentBtnDel').text('삭제').appendTo(commentItem);

                commentItem.appendTo(comments);
            }else{
                window.alert('오류가 발생하였습니다.')
            }
            isComment= false;
        },
        error:function(){
            window.alert('오류가 발생하였습니다.')
            isComment = false;

         }
        });
    });

    $(document).on('click', '.commentBtnDel', function(){
        if(window.confirm('댓글을 삭제하시겠습니까?')){
            var id = $(this).parent().attr('data-id');
            var removeTarget = $(this).parent();

            $.ajax({
                url:'http://localhost:8080/test/js/commentDel.jsp',
                data:{
                    postId : id
                },
                dataType:'jsonp',
                success:function(data){
                    if(data.result=="success"){
                        removeTarget.remove();
                    }else{
                        window.alert('오류가 발생하였습니다');
                    }
                },
                error:function(){
                    window.alert('오류가 발생하였습니다.');

                }
                
            });
        }
    });
});