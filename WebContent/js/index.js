$(function(){
    //변수
    var currentUser = null;

    // 로그인 화면을 표시
    $('.Login').show();

    /* 로그인 화면 */
    // 로그인 버튼
    var isLogin = false;
    $('.loginBtnLogin').click(function(){
        if(isLogin) return false;
        var id = $('.loginTxtID').val();
        var pw = $('.loginTxtPw').val();
        if(!id){
            alert('아이디를 입력하세요'); return false;
        }else if(!pw){
            alert('비밀번호를 입력하세요'); return false;
        }

        isLogin = true;

        $.ajax({
            url : "http://localhost:8080/test/js/login.jsp",
            data : {id:id, pw:pw},
            dataType : 'jsonp',
            success : function(data) {
                //로그인 성공
                if(data.result == 'success'){
                    alert('로그인 성공');
                    $('.Login').hide();
                    $('.Main').show();

                    $('.NaviPadding > p').html('안녕하세요, <b>' + id + "</b>님");
                    currentUser = id;
                    loadPosts();
                }else { alert('로그인 오류 발생'); } //로그인 실패 - 오류
                
                isLogin = false;
            },
            error : function(){
                alert('오류가 발생');
                isLogin = false;
            }
        });
    });

    // 회원가입 버튼
    $('.loginBtnJoin').click(function(){
        $('.Login').hide();
        $('.Join').show();
    });

    /* 회원가입 화면 */
    // 가입하기 버튼
    var isJoin = false; // 회원가입 중인지 여부를 파악하는 변수
    $('.joinBtnJoin').click(function(){
        if(isJoin) return false; // 이미 회원가입 중이라면 수행하지 않음
        var id = $('.joinTxtID').val();
        var pw = $('.joinTxtPw').val();
        var pwc = $('.joinTxtPwc').val();
        if(!id){
            window.alert('아이디를 입력하세요'); return false;
        } else if(!pw){
            window.alert('비밀번호를 입력하세요'); return false;
        } else if(!pwc){
            window.alert('비밀번호 확인을 입력하세요'); return false;
        } else if(pw != pwc){
            window.alert('비밀번호가 일치하지 않습니다'); return false;
        }

        isJoin = true; // 회원가입 시도
        $.ajax({
            url : "http://localhost:8080/test/js/join.jsp",
            data : {id:id, pw:pw},
            dataType : 'jsonp',
            success : function(data) {
                console.log(data);
               if(data.result == "success") {
                   alert('회원가입 완료! 메인화면으로 돌아갑니다.');
                   $('.Join').hide();
                   $('.Login').show();
               }
               else {
                   alert('오류가 발생하였습니다.');
               }
            },
            error : function () {
                alert('오류가 발생하였습니다.');
            }
        });
    });
    
    // 가입취소 버튼
    $('.joinBtnCancel').click(function(){
        if(window.confirm('가입을 취소하시겠습니까?')){
            $('.Join').hide();
            $('.Login').show();
        }
    });

    /* 메인 화면 */
    // 게시글과 댓글을 불러와 화면에 출력
    var loadPosts = function(){
        $('.Items').empty();

        // 데이터를 AJAX로 불러옵니다.
        $.ajax({
            url : "http://localhost:8080/test/js/load.jsp",
            data : {},
            dataType : 'jsonp',
            success : function(data){
                if(data.result == "success") {
                    var cnt = data.data.length;
                    for(var i = 0; i < cnt; i++) {
                        var id = data.data[i].id;
                        var subject = data.data[i].subject;
                        var content = data.data[i].content;
                        var writer = data.data[i].writer;
                        var writedate = data.data[i].writedate;
                        
                        var item = $('<div></div>').attr('data-id', id).addClass('Item');
                        var itemText = $('<div></div>').addClass('ItemText').appendTo(item);

                        $('<h4></h4>').text(subject).appendTo(itemText);
                        $('<h6></h6>').text('작성시간 : ' + writedate).appendTo(itemText);
                        $('<p></p>').text(content).appendTo(itemText);

                        if(writer == currentUser) {
                            var itemButtons = $('<div></div>').addClass('ItemButtons').appendTo(itemText);
                            $('<button></button>').addClass('mainBtnDel AppBtnRed').text('삭제하기').appendTo(itemButtons);
                        }

                        // 댓글
                        var comment = $('<div></div>').addClass('Comment').appendTo(item);
                        $('<input />').attr({ type : 'text', placeholder : '댓글입력...'}).addClass('itemTxtComment').appendTo(comment);
                        $('<button></button>').addClass('commentBtnWrite AppBtnBlue').text('댓글달기').appendTo(comment);

                        // 댓글 목록이 출력되는 곳
                        $('<div></div>').addClass('Comments').appendTo(comment);

                        item.appendTo($('.Items'));

                        // 댓글 불러오기
                        loadComment(id);
                    }
                }
                else {
                    alert('게시글 로드 오류 발생');
                    $('.Main').hide();
                    $('.Login').show();
                }
            },
            error : function(){
                alert('오류발생');
                $('.Main').hide();
                $('.Login').show();
            }
        });
    };

    // 댓글 불러오기
    var loadComment = function(postId){
        if(!postId) return false;
        var target = $('div.Item[data-id=' + postId + '] .Comments');

        // 데이터를 AJAX로 불러옵니다.
        $.ajax({
            url : "http://localhost:8080/test/js/commentLoad.jsp",
            data : {postId : postId},
            dataType : 'jsonp',
            success : function(data){
                if(data.result == "success"){
                    var cnt = data.data.length;
                    for(var i = 0; i < cnt; i++){
                        var id = data.data[i].id;
                        var content = data.data[i].content;
                        var writer = data.data[i].writer;

                        var commentItem = $('<div></div>').addClass('CommentItem').attr('data-id', id);
                        $('<h4></h4>').text(writer).appendTo(commentItem);
                        $('<p></p>').text(content).appendTo(commentItem);
                        $('<button></button>').addClass('AppBtnRed commentBtnDel').text('삭제').appendTo(commentItem);
                        commentItem.appendTo(target);
                    }
                }else {
                    alert('오류발생');
                }
            },
            error : function(){
                alert('오류발생');
            }
        });
    };
    
    // 작성한 글 삭제
    $(document.body).on('click', '.mainBtnDel', function(){
        if(confirm('삭제?')){
            var id = $(this).parent().parent().parent().attr('data-id');
            var removeTarget = $(this).parent().parent().parent();

            $.ajax({
                url : "http://localhost:8080/test/js/del.jsp",
                data : {postId : id},
                dataType : 'jsonp',
                success : function(data){
                    if(data.result == "success") {
                        removeTarget.remove();
                    }else alert('오류');
                },
                error : function(){
                    alert('오류');
                }
            });
        }
    });
    // 댓글달기
    var isComment = false; // 댓글을 달고 있는지 확인하는 변수
    $(document.body).on('click', '.commentBtnWrite', function(){
        if(isComment) return false;

        var parentId = $(this).parent().parent().attr('data-id');
        var content = $(this).prev().val();
        var comments = $(this).next(); // 나중에 댓글을 추가할 Comments DOM을 불러오기
        if(!content){
            alert('댓글을 입력하세요');
            return false;
        }
        isComment = true;

        $.ajax({
            url : "http://localhost:8080/test/js/commentPost.jsp",
            data : {parentId : parentId, content : content, writer : currentUser},
            dataType : 'jsonp',
            success : function(data){
                console.log(data);
                if(data.result == "success"){
                    var lid = data.lastId;
                    var commentItem = $('<div></div>').addClass('CommentItem').attr('data-id', lid);    // 삭제할 때 필요한 댓글 번호
                    $('<h4></h4>').text(currentUser).appendTo(commentItem); // 댓글 작성자(현재사용자)
                    $('<p></p>').text(content).appendTo(commentItem);   // 댓글 내용
                    $('<button></button>').addClass('AppBtnRed commentBtnDel').text('삭제').appendTo(commentItem);    //삭제버튼
                    commentItem.appendTo(comments);
                }else alert('댓글 달기 오류');
                isComment = false;
            },
            error : function(){
                alert('오류');
                isComment = false;
            }
        });
    });

    // 댓글 삭제
    $(document.body).on('click', '.commentBtnDel', function(){
        if(confirm('댓글 삭제?')){
            var id = $(this).parent().attr('data-id');
            var removeTarget = $(this).parent();
            $.ajax({
                url : "http://localhost:8080/test/js/commentDel.jsp",
                data:{postId:id},
                dataType:'jsonp',
                success:function(data){
                    if(data.result == "success")
                        removeTarget.remove();
                    else
                        window.alert('오류');
                }            
            });
        }
    });

    $('.mainBtnWrite').click(function(){
        $('.Main').hide();
        $('.Write').show();
        $('.writeTxtSubject').val('');
        $('.writeTxtContent').val('');
    });

    $('.mainBtnLogout').click(function(){
        if(confirm('로그아웃 하시겠습니까?'))
            location.reload();
    });


    /* 글쓰기 화면 */
    var isPost = false; // 게시글 작성 중인지 체크하는 변수
    $('.writeBtnWrite').click(function(){
        if(isPost) return false;
        var subject = $('.writeTxtSubject').val();
        var content = $('.writeTxtContent').val();

        if(!subject){
            alert('글제목입력'); return false;
        }
        else if (!content){
            alert('글내용입력'); return false;
        }

        if(window.confirm('글을 작성하시겠습니까?')){
            isPost = true;
            $.ajax({
                url : "http://localhost:8080/test/js/post.jsp",
                data : {
                    subject : subject,
                    content : content,
                    writer : currentUser
                },
                dataType : 'jsonp',
                success : function(data) {
                    if(data.result == "success"){
                        $('.Write').hide();
                        $('.Main').show();
                        loadPosts();
                    }else {
                        window.alert("오류 발생");
                    }
                    isPost = false;
                }, 
                error : function(){
                    window.alert("오류 발생");
                    isPost = false;
                }
            });
        }
    });

    $('.writeBtnCancel').click(function(){
        if(confirm('작성을 취소하시겠습니까?')){
            $('.Write').hide();
            $('.Main').show();
            loadPosts();
        }
    });
});
