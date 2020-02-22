/**
 * Created by 14843 on 2019/11/20.
 */
// $(function () {
$(document).ready(function(){
    var $rigister=$("#register");
    var $login=$("#login");
    var $loginIn=$("#loginIn")
    $login.find("a").bind("click",function () {
        $rigister.show();
        $login.hide();
    })
    $rigister.find("a").bind("click",function () {
        $rigister.hide();
        $login.show();
    })

    $rigister.find("button").bind("click",function () {
        $.ajax({
            type:"post",
            url:"/api/user/register",
            data:{
                username:$rigister.find("[name=username]").val(),
                password:$rigister.find("[name=password]").val(),
                repassword:$rigister.find("[name=repassword]").val(),
            },
            dataType:"json",
            success:function (result) {
                $rigister.find(".message").html(result.message);
                if(!result.code){
                    setTimeout(function () {
                        $rigister.hide();
                        $login.show();
                    },1000)
                }
            }
        })
    })

    $login.find("button").bind("click",function () {
        $.ajax({
            type:"post",
            url:"/api/user/login",
            data:{
                username:$login.find("[name=username]").val(),
                password:$login.find("[name=password]").val(),
            },
            dataType:"json",
            success:function (result) {
                $login.find(".message").html(result.message);
                if(!result.code){
                    setTimeout(function () {

                    },1000)
                   window.location.reload();
                }
            }

        })
    })

    $("#logout").bind("click",function () {
      $.ajax({
        url:"/api/user/logout",
          success:function (result) {
              if(!result.code){
                  window.location.reload();
              }
          }
      })
    })


})

