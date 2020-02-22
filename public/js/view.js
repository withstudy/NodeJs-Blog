/**
 * Created by 14843 on 2019/11/26.
 */

var prepage=5;
var page=1;
var pages=0;
var comments=[];
var html="";
$("#messageBtn").bind("click",function () {
    $.ajax({
        type:"post",
        url:"/api/comment/post",
        data:{
            contentid:$("#contentid").val() ,
            content:$("#messageContent").val()
        },
        success:function (result) {
            $("#messageContent").val("");
            comments="";
            if(result.data.length != 0 ){
                comments=result.data.reverse();
                rederComment();

            }else {
               html=' <p id="nologin" style="line-height: 50px;width: 100%;text-align: center;background: lightcoral'+
                   ';border-radius: 5px;color: white;margin-top: 20px;">还没有评论，快去评论吧~</p>';
                $("#messageList").html(html);
            }
            // comments=result.data.reverse();
            // rederComment();
        }
    })
})


$.ajax({
    url:"/api/comment",
    data:{
        contentid:$("#contentid").val() ,
    },
    success:function (result) {
        comments="";
        if(result.data.length != 0 ){
            comments=result.data.reverse();
            console.log(comments)
            rederComment();
        }else {
            html=' <p id="nologin" style="line-height: 50px;width: 100%;text-align: center;background: lightcoral'+
                ';border-radius: 5px;color: white;margin-top: 20px;">还没有评论，快去评论吧~</p>';
            $("#messageList").html(html);
        }

    }
})



function rederComment() {


    var html="";
    pages=Math.ceil(comments.length / prepage);
    var start=Math.max(0,(page-1)*prepage);
    var end=Math.min(start + prepage,comments.length);
    var $lis = $(".pager li");
    $lis.eq(1).html(page + "/" + pages)

    $(".messageCount").html(comments.length);

    if(page <= 1){
        page=1;
        $lis.eq(0).html("<span>没有上一页</span>");
    }else{
        $lis.eq(0).html("<a href='javascript:;'>上一页</a>");
    }
    if(page >= pages){
        page = pages;
        $lis.eq(2).html("<span>没有下一页</span>");
    }else{
        $lis.eq(2).html("<a href='javascript:;'>下一页</a>");
    }

    for(var i=start;i<end;i++){
        console.log(i)
        html += '<div id="messagebox">'+
           ' <p> <span >'+comments[i].username+'</span>'+
            '<span style="float: right;">'+formatDate(comments[i].addTime)+'</span>'+
            '</p>'+
           ' <p>'+comments[i].comments+'</p>'+
           ' </div><hr>';

    }
    $("#messageList").html(html);
}

$(".pager").delegate("a","click",function () {
    if($(this).parent().hasClass("previous")){
        page--;
    }else{
        page++
    }
    rederComment();
})

function formatDate(d) {
    var date=new Date(d)
    return date.getFullYear()+"年"+date.getMonth()+"月"+date.getDate()+"日 "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
}