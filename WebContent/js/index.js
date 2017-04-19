$(function() {
    //로그인 화면을 표시
    $('.Login').show();

    //회원 가입 버튼
    $('.loginBtnJoin').click(function(){
        $('.Login').hide();
        $('.Join').show();
    });

    var currentUser = null;
    var isLogin = false;

    $('.loginBtnLogin').click(function(){
        if(isLogin) return false;
        var id = $('.loginTxtID').val();
        var pw = $('.loginTxtPw').val();
        if(!id){
            window.alert("아이디 입력해야 함");
            return false;
        }
        else if(!pw){
            window.alert("패스워드 입력해야 함");
            return false;
        }
        isLogin = true;
        $.ajax({
            url:"http://localhost:8080/test/js/login.jsp",
            data:{id:id,pw:pw},
            dataType:'jsonp',
            success: function(data){
                if(data.result == "success"){
                     window.alert("로그인 성공");
                     $(".Login").hide();
                     $(".Main").show();
                     $(".NaviPadding > p").html('안녕하세요,<b>'+id+'</b>님.');
                     currentUser = id;
                    loadPosts();
                }
                else if(data.result == "wrong"){
                    alert("잘못된 아이디나 비밀번호를 입력하셨습니다.");
                }
                else{
                    alert("오류왕");
                }
                isLogin = false;
            },
            error: function(){
                window.alert('에러왕!');
                isLogin = false;
            }
        });
    });
    var isJoin = false;
    $('.joinBtnCancel').click(function(){
        if(window.confirm("정말로 가입취소하시겠습니까?")){
            $('.Join').hide();
            $('.Login').show();
        }
    });

    $(".joinBtnJoin").click(function(){
        if(isJoin) return false;
        var cid = $('.joinTxtID').val();
        var cpw = $('.joinTxtPw').val();
        var cpwc = $('.joinTxtPwc').val();

        if(!cid){
            window.alert("아이디를 입력하세요");
            return false;
        }
        else if(!cpw){
            window.alert("패스워드를 입력하세요");
            return false;
        }
        else if(!cpwc){
            window.alert("패스워드를 확인하세요");
            return false;
        }
        else if(cpw != cpwc){
            window.alert("패스워드가 일치하지 않습니다.");
            return false;
        }
        isJoin = true;
        $.ajax({
            url:'http://localhost:8080/test/js/register.jsp',
            data:{id:cid, pw:cpw},
            dataType : 'jsonp',
            success : function(data){
                console.log(data);
                if(data.result == "success"){
                    window.alert("회원가입 성공!메인화면으로 이동합니다.");
                    $('.Join').hide();
                    $('.Login').show();
                }
                else{
                    window.alert("회원가입시 서버와의 통신결과에서 문제 발생");
                    isJoin = false;
                }
            },
            error : function(){
                window.alert('회원가입 에러왕!');
                isJoin = false;
            }
        });
    });

    $(".mainBtnWrite").click(function(){
        $('.Main').hide();
        $('.Write').show();
        $('.writeTxtSubject').val('');
        $('.writeTxtContent').val('');
    });
    $(".mainBtnLogout").click(function(){
        if(window.confirm("정말 로그아웃하시겠습니까?")){
            location.reload();
        }
    });

    var isPost = false;
    $('.writeBtnWrite').click(function(){
        if(isPost) return false;
        var subject = $('.writeTxtSubject').val();
        var content = $('.writeTxtContent').val();
        if(!subject){
            window.alert("제목 입력하기");
            return false;
        }
        else if(!content){
            window.alert("내용 입력하기");
            return false;
        }
        if(window.confirm("글을 작성하시겠습니까?")){
            isPost = true;
            $.ajax({
                url : 'http://localhost:8080/test/js/post.jsp',
                data : {
                    subject : subject, //server 변수 : client 변수, key:value
                    content : content,
                    writer : currentUser
                },
                dataType :'jsonp',
                success : function(data){ //성공 콜백 함수
                    if(data.result == "success"){
                        $('.Write').hide();
                        $('.Main').show();
                        loadPosts();
                    }
                    else{
                        window.alert("서버의 처리 오류가 있음");
                    }
                    isPost = false;
                },
                error : function(){//실패 콜백 함수
                    window.alert("에러왕!");
                    isPost = false;
                }
            });
        }
    });

    $('.writeBtnCancel').click(function(){
        if(window.confirm("작성을 진짜로 취소함?")){
            $('.Write').hide();
            $('.Main').show();
            //loadPosts();
        }
    });

    var loadPosts = function(){
        $('.Items').empty();
        $.ajax({
            url:'http://localhost:8080/test/js/load.jsp',
            data:{},
            dataType : 'jsonp',
            success : function(data){
                //{result:"success", data:[{id:'',subject:'',content:'',writer:'',writedate:''},{},{}]}
                if(data.result=="success"){
                    var cnt = data.data.length;
                    for(var i = 0; i<cnt;i++){
                        var id = data.data[i].id;
                        var subject = data.data[i].subject;
                        var content = data.data[i].content;
                        var writer = data.data[i].writer;
                        var writedate = data.data[i].writedate;

                        var item = $("<div></div>").attr('data-id',id).addClass('Item');
                        // <div class = "Item" data-id = '1'></div>
                        var itemText = $("<div></div>").addClass('itemText').appendTo(item);
                        //<div class = 'Item' data-id = '1'><div class = 'itemText'></div></div>
                        $('<h4></h4>').text(subject).appendTo(itemText);
                        $('<h6></h6>').text("작성시간 : "+writedate).appendTo(itemText);
                        $('<p></p>').text(content).appendTo(itemText);
                        if(writer == currentUser){
                            var itemButtons = $("<div></div>").addClass('ItemButtons').appendTo(itemText);
                            $('<button></button>').addClass('.mainBtnDel AppBtnRed').text('삭제하자').appendTo(itemButtons);
                        }

                        var comment = $('<div></div>').addClass('Comment').appendTo(item);
                        // <div class = "Item" data-id = '1'><div class = 'Comment'></div></div>
                        $('<input/>').attr({type:'text', placeholder : '댓글입력..'}).addClass('itemTxtComment').appendTo(comment);
                        $('<button></button>').addClass('commentBtnWrite AppBtnBlue').text("댓글달기").appendTo(comment);
                        $('<div></div>').addClass('Comments').appendTo(comment);
                        item.appendTo($('.Items'));

                        //loadComment(id);
                    }
                }
            },
            error: function(){

            }
        });
    };
    //$('.Main').show();
    //$('.Write').show();
});