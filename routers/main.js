/**
 * Created by 14843 on 2019/11/19.
 */
var express = require("express");
var router = express.Router();
var mysql = require("mysql");

var pool=require("../models/mysql");
var connection = mysql.createConnection(pool);
connection.connect(function (err) {
    if(err){
        console.log("连接失败");
    }else{
        console.log("main连接成功");
    }
})
var data;
router.use(function (req,res,next) {
    data={
        userInfo:req.userInfo,
        categorys:[]
    }
    connection.query("select * from category order by id desc",[],function (err,rows,filesds) {
        if(err){
            console.log("获取所有分类信息失败");
        }else {
            data.categorys = rows;
            next();
        }
        })
})
router.get("/",function (req,res,next) {

    data.category=Number(req.query.category || -1);
    data.contents=[];
    data.page=Number(req.query.page || 1);
    data.limit=5;
    data.count=0;
    data.pages=0;
var where={};
    if(data.category){
        where.category=data.category;
    }

            var sql="";
            var options1=[];
            if(where.category == -1 ){
                sql="select * from content";
                options1=[];
            }else{
                sql="select * from content where c_id=?";
                options1=[where.category];
            }
            connection.query(sql,options1,function (err,rows,fileds) {
                if(err){
                    console.log("main获取所有内容失败");
                }else {
                    data.contents=rows;
                    data.count = rows.length;

                    data.pages = Math.ceil(data.count / data.limit);
                    data.page = Math.min(data.page, data.pages);
                    data.page = Math.max(data.page, 1);
                    var skip = (data.page - 1) * data.limit;
                    var sql="";
                    var options=[];
                    if(where.category == -1 ){
                        sql="select * from content order by addTime desc limit ?,?";
                        options=[skip,data.limit];
                    }else{
                        sql="select * from content where c_id=? order by addTime desc limit ?,?";
                        options=[where.category,skip,data.limit];
                    }

                    connection.query(sql,options,function (err,rows,fileds) {
                        if(err){
                            console.log("main查询内容分页失败");
                        }else{
                            data.contents=rows;

                            res.render("main/index",data);
                        }
                    })
                }
            })


    //})

});

router.get("/view",function (req,res) {
    var contentId=req.query.contentid || "";


    connection.query("select * from content where id=?",[contentId],function (err,rows,fileds) {
        if(err){
            console.log("main查询内容失败");
        }else{
            var views=rows[0].views;
            views++;
            connection.query("update content set views=? where id=?",[views,contentId],function (err,rows,fileds) {
                if(err){
                    console.log("修改阅读量失败");
                }else{
                    connection.query("select * from content where id=?",[contentId],function (err,rows,fileds) {
                        if(err){
                            console.log("main查询内容失败");
                        }else{
                            data.content=rows[0];

                            res.render("main/view",data);
                        }

                    })
                }
            })
        }
    })


})

module.exports=router;