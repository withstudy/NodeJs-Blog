/**
 * Created by 14843 on 2019/11/19.
 * 启动入口页
 */
//加载express模块
var  express =require("express");

//创建app应用
var app=express();

//加载mysql
var mysql = require("mysql");
var Cookies=require("cookies");
//静态文件
app.use("/public",express.static(__dirname+"/public"));

//加载模板 html
var swig = require("swig");
//定义当前应用使用的模板引擎
app.engine("html",swig.renderFile);
//设置模板引擎存放的目录
app.set("views","./views");
//注册使用的模板引擎
app.set("view engine","html");
//取消模板缓存
swig.setDefaults({cache:false});

//加载bodyParser 处理传过来的Ajax数据
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

var pool=require("./models/mysql");
var connection = mysql.createConnection(pool);
connection.connect(function (err) {
    if(err){
        console.log("连接失败");
    }else{
        console.log("app连接成功");
    }
})


app.use(function (req,res,next) {

   req.cookies=new Cookies(req,res);
   req.userInfo={};
   //解析登录用户cookies信息
    if(req.cookies.get("userInfo")){
            try{
                req.userInfo = JSON.parse(req.cookies.get("userInfo"));
                connection.query("select * from user where id=?",[req.userInfo._id],function (err,rows,fields) {
                    if(err){
                        console.log("查询失败");
                    }else{
                        req.userInfo.isAdmin = rows[0].isAdmin;
                        next();
                    }
                })
            }catch(e) {

            }
    }else{
        next();
    }


});

//划分模块
app.use("/admin",require("./routers/admin"));
app.use("/api",require("./routers/api"));
app.use("/",require("./routers/main"));

//
// var cookieParser = require('cookie-parser')
// app.use(cookieParser())




//




// var CookIePar = require('cookie-parser');
// app.use(cooki());




app.listen(8081);

