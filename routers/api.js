/**
 * Created by 14843 on 2019/11/19.
 */
var express = require("express");
var router = express.Router();
var mysql=require("mysql");

var Cookies=require("cookies");

//同意返回格式
var pool=require("../models/mysql");
var connection=mysql.createConnection(pool);
connection.connect(function(err) {
    if(err){
        console.log("连接失败");
    }else{
        console.log("api连接成功");

    }
});


var resData;
router.use(function (req,res,next) {
    resData={
        code:0,
        message:"",
        userInfo:{
            _id:0,
            username:""
        }
    }
    next();
});

//用户注册
router.post("/user/register",function (req,res,next) {

    var username=req.body.username;
    var password=req.body.password;
    var repassword=req.body.repassword;

    if(username==""){

        resData.code=1;
        resData.message="用户名不能为空";
        res.json(resData);
        return;
    }
    if(password==""){
        resData.code=2;
        resData.message="密码不能为空";
        res.json(resData);
        return;
    }
    if(password != repassword){
        console.log(repassword);
        resData.code=3;
        resData.message="两次输入的密码不一致";
        res.json(resData);
        return;
    }

    connection.query("select * from user where username=?",[username],function (err, rows, fields) {
        if(err){
            console.log(err);
        }else{
            if(rows.length != 0){

                resData.code=4;
                resData.message="该用户已存在";

                res.json(resData);
            }else{
                connection.query("insert into user (username,password) values(?,?)",[username,password],function (err,rows,fields) {

                    if(err){
                        console.log("添加失败");
                    }else{
                        resData.message="注册成功";
                        res.json(resData);
                    }
                });
            }
        }
    });


});

router.post("/user/login",function (req,res,next) {


    var username=req.body.username;
    var password=req.body.password;
    if(username==""){
        resData.code=1;
        resData.message="用户名不能为空";
        res.json(resData);
        return;
    }
    if(password==""){
        resData.code=2;
        resData.message="密码不能为空";
        res.json(resData);
        return;
    }

    connection.query("select * from user where username=? and password=?",[username,password],function (err,rows,fields) {
        if(err){
            console.log("查询失败");
        }else{
            if(rows.length !=0 ){

                resData.message="登录成功";
                resData.userInfo={
                    _id:rows[0].id,
                    username:rows[0].username

                }



                req.cookies.set("userInfo",JSON.stringify(resData.userInfo));


                res.json(resData);
                return;
            }else{
                resData.code=5;
                resData.message="用户名或密码错误";

                res.json(resData);
                return;
            }

        }
    })
})

router.get("/user/logout",function (req,res) {
    req.cookies.set("userInfo",null);
    res.json(resData);
})


router.post("/comment/post",function (req,res) {
    var postData={
        username:req.userInfo.username,
        content:req.body.content,
        contentId:Number(req.body.contentid || -1)
    }
    connection.query("insert into comments(con_id,username,comments) values(?,?,?)",[postData.contentId,postData.username,postData.content],
                function (err,rows,fileds) {
                    if(err){
                        console.log(err)
                        console.log("插入评论失败");
                    }else{
                        connection.query("update content set comments = comments + 1 where id= ?",[postData.contentId],function (err,rows,fileds) {
                            if(err){
                                console.log("修改评论数失败")
                            }else{
                                resData.message="评论成功";
                                connection.query("select * from comments where con_id = ?",[postData.contentId],function (err,rows,fileds) {
                                    if(err){
                                        console.log(err)
                                        console.log("查询评论失败");
                                    }else{
                                        resData.data=rows
                                        res.json(resData);
                                    }
                                })
                            }
                        })


                    }
                })
})

router.get("/comment",function (req,res) {
    var contentId=req.query.contentid || "";
    connection.query("select * from comments where con_id = ?",[contentId],function (err,rows,fileds) {
        if(err){
            console.log(err)
            console.log("查询评论失败");
        }else{

            resData.data=rows
            res.json(resData);
        }
    })
})
module.exports=router;

