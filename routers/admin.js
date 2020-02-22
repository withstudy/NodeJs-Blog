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
        console.log("admin连接成功");
    }
})

router.use(function (req,res,next) {
    if(!req.userInfo.isAdmin){
        res.send("对不起，只有管理员才可以进入后台管理");
        return;
    }
    next();
})
router.get("/",function (req,res,next) {
    res.render("admin",{
        userInfo:req.userInfo
    });
});

router.get("/user",function (req,res) {
    var page=Number(req.query.page || 1);
    var limit=5;
    var count=0;
    var pages=0;
    connection.query("select * from user ",[],function (err,rows,fileds) {
        if(err){
            console.log("admin查询失败");
        }else{
            pages=Math.ceil(rows.length / limit);
            page=Math.min(page,pages);
            page=Math.max(page,1);
            count=rows.length;
            var skip = (page-1)*limit;
            connection.query("select * from user limit ?,?",[skip,limit],function (err,rows,fileds) {
                if(err){
                    console.log("admin查询失败");
                }else{

                    res.render("admin/user_index",{
                        userInfo:req.userInfo,
                        users:rows,
                        url:"user",

                        page:page,
                        pages:pages,
                        limit:limit,
                        count:count
                    });
                }
            })//分页

        }
    })//总页数


})

router.get("/category",function (req,res) {
    var page=Number(req.query.page || 1);
    var limit=5;
    var count=0;
    var pages=0;
    connection.query("select * from category",[],function (err,rows,fileds) {
        if(err){
            console.log("查询所有分类失败");
        }else{
            pages=Math.ceil(rows.length / limit);
            page=Math.min(page,pages);
            page=Math.max(page,1);
            count=rows.length;
            var skip = (page-1)*limit;
            connection.query("select * from category limit ?,?",[skip,limit],function (err,rows,fileds) {
                if(err){
                    console.log("查询分类分页失败");
                }else{
                    res.render("admin/category_index",{
                        userInfo:req.userInfo,
                        categorys:rows,
                        url:"category",

                        page:page,
                        pages:pages,
                        limit:limit,
                        count:count
                    })

                }
            })//分页

        }
    })

})
router.get("/category/add",function (req,res) {
    res.render("admin/category_add",{
        userInfo:req.userInfo
    })
})
router.post("/category/add",function (req,res) {
   var cname=req.body.cname || "";
   if(cname == ""){
       res.render("admin/error",{
           userInfo:req.userInfo,
           message:"分类名称不能为空"
       });
       return;
   }
   connection.query("select * from category where name=?",[cname],function (err,rows,fileds) {
           if(err){
               console.log(err)
               console.log("分类名查询失败");
           }else {
               if(rows.length != 0){
                   res.render("admin/error",{
                       userInfo:req.userInfo,
                       message:"该分类已存在"
                   });

               }else{
                   connection.query("insert into category(name) values(?)",[cname],function (err,rows,fileds) {
                       if(err){
                           console.log("分类插入失败");
                       }else {
                           res.render("admin/success",{
                               userInfo:req.userInfo,
                               message:"分类添加成功",
                               url:"/admin/category"
                           });
                       }
                   })
               }

           }
       })//查询

})
//修改
router.get("/category/edit",function (req,res) {
    var id=req.query.id || "";
    connection.query("select * from category where id=?",[id],function (err,rows,fileds) {
        if(err){
            console.log("通过ID查询分类失败");
        }else{
            if(!rows.length){
                res.render("admin/error",{
                    userInfo:req.userInfo,
                    message:"分类信息不存在"
                })
            }else{
                res.render("admin/category_edit",{
                    userInfo:req.userInfo,
                    category:rows[0]
                })
            }
        }
    })//查询
});

router.post("/category/edit",function (req,res) {
    var id=req.body.id ;
    var name = req.body.name;

    connection.query("select * from category where id=?",[id],function (err,rows,fileds) {
        if(err){
            console.log("通过ID查询分类失败");
        }else{

            if(!rows.length){
                res.render("admin/error",{
                    userInfo:req.userInfo,
                    message:"分类信息不存在"
                })
            }else{
                if(name == rows[0].name ){
                    res.render("admin/success",{
                        userInfo:req.userInfo,
                        message:"修改成功",
                        url:"/admin/category"
                    })
                }else{
                    connection.query("select * from category where name=?",[name],function (err,rows,fileds) {
                        if(err){
                            console.log("通过NAME查询分类失败");
                        }else{
                            var flag= false;
                            for(var i=0;i<rows.length;i++){
                                if(rows[i].name == name && rows[i].id != id){
                                   flag=true;
                                }
                            }
                            if(flag){
                                res.render("admin/error",{
                                    userInfo:req.userInfo,
                                    message:"已经存在同名分类"
                                })
                            }else{
                                connection.query("update category set name=? where id=?",[name,id],function (err,rows,fileds) {
                                    if(err){
                                        console.log("修改分类失败");
                                    }else {
                                        res.render("admin/success",{
                                            userInfo:req.userInfo,
                                            message:"修改成功",
                                            url:"/admin/category"
                                        })
                                    }
                                })//修改分类
                            }

                        }
                    })//通过NAME查询分类

                }
            }
        }
    })//查询
})


//删除
router.get("/category/delete",function (req,res) {
    var id= req.query.id || "";
    connection.query("delete from category where id=?",[id],function (err,rows,fileds) {
        if(err){
            res.render("admin/error",{
                userInfo:req.userInfo,
                message:"删除失败"
            })
        }else{
            res.render("admin/success",{
                userInfo:req.userInfo,
                message:"删除成功",
                url:"/admin/category"
            })
        }
    })
})


//内容首页
router.get("/content",function(req,res){
    var page=Number(req.query.page || 1);
    var limit=5;
    var count=0;
    var pages=0;
    connection.query("select * from content",[],function (err,rows,fileds) {
        if(err){
            console.log("查询所有内容失败");
        }else{
            pages=Math.ceil(rows.length / limit);
            page=Math.min(page,pages);
            page=Math.max(page,1);
            count=rows.length;
            var skip = (page-1)*limit;
            connection.query("select * from content limit ?,?",[skip,limit],function (err,rows,fileds) {
                if(err){
                    console.log("查询内容分页失败");
                }else{
                    console.log(rows[0].addTime)
                    res.render("admin/content_index",{
                        userInfo:req.userInfo,
                        contents:rows,
                        url:"content",

                        page:page,
                        pages:pages,
                        limit:limit,
                        count:count
                    })

                }
            })//分页

        }
    })

})

//内容添加
router.get("/content/add",function(req,res){
    connection.query("select * from category",[],function (err,rows,fileds) {
        if(err){
            console.log("/content/add 查询所有分类失败");
        }else{
            res.render("admin/content_add",{
                userInfo:req.userInfo,
                categorys:rows
            })
        }
    })

})
router.post("/content/add",function (req,res) {
    if(req.body.category == "" ){
        res.render("admin/error",{
            userInfo:req.userInfo,
            message:"内容分类不能为空"
        })
        return;
    }
    if( req.body.title == ""){
        res.render("admin/error",{
            userInfo:req.userInfo,
            message:"内容标题不能为空"
        })
        return;
    }
    var category=req.body.category;
    var user_id=req.userInfo._id;
    var user_name=req.userInfo.username;
    var title=req.body.title;
    var description=req.body.description;
    var content=req.body.content;
    connection.query("insert into content(c_id,u_id,u_name,title,description,content) values(?,?,?,?,?,?)",[category,user_id,user_name,title,description,content],
        function (err,rows,fileds) {
        if(err){
            console.log(err)
            res.render("admin/error",{
                userInfo:req.userInfo,
                message:"内容添加失败"
            })
        }else{
            res.render("admin/success",{
                userInfo:req.userInfo,
                message:"内容添加成功",
                url:"/admin/content"
            })
        }
    })

})

router.get("/content/edit",function (req,res) {
    var id=req.query.id || "";
    var categorys=[];
    connection.query("select * from category",[],function (err,rows,fileds) {
        if(err){
            console.log("/content/add 查询所有分类失败");
        }else{
            categorys=rows;
            connection.query("select * from content where id=?",[id],function (err,rows,fileds) {
                if(err){
                    console.log("通过ID查询内容失败");
                }else{
                    if(!rows.length){
                        res.render("admin/error",{
                            userInfo:req.userInfo,
                            message:"内容不存在"
                        })
                    }else{
                        res.render("admin/content_edit",{
                            userInfo:req.userInfo,
                            content:rows[0],
                            categorys:categorys
                        })
                    }
                }
            })//查询
        }
    })

});

router.post("/content/edit",function (req,res) {
    if(req.query.category == "" ){
        res.render("admin/error",{
            userInfo:req.userInfo,
            message:"内容分类不能为空"
        })
        return;
    }
    if( req.query.title == ""){
        res.render("admin/error",{
            userInfo:req.userInfo,
            message:"内容标题不能为空"
        })
        return;
    }
    var id=req.body.id || "";
    console.log(id)
    var category=req.body.category;
    var title=req.body.title;
    var description=req.body.description;
    var content=req.body.content;

    connection.query("select * from content where id=?",[id],function (err,rows,fileds) {
        if(err){
            console.log("通过ID查询内容失败");
        }else{
            if(!rows.length){
                res.render("admin/error",{
                    userInfo:req.userInfo,
                    message:"内容不存在"
                })
            }else{
                connection.query("update content set c_id=?,title=?,description=?,content=? where id=?",[category,title,description,content,id],
                    function (err,rows,fileds) {
                        if(err){
                            console.log("修改内容失败");
                        }else {
                            res.render("admin/success",{
                                userInfo:req.userInfo,
                                message:"修改成功",
                                url:"/admin/content"
                            })
                        }
                    })//修改分类
                }

        }
    })//查询
})
router.get("/content/delete",function (req,res) {
    var id= req.query.id || "";

    connection.query("delete from content where id=?",[id],function (err,rows,fileds) {
        if(err){
            console.log(err)
            res.render("admin/error",{
                userInfo:req.userInfo,
                message:"删除失败"
            })
        }else{
            res.render("admin/success",{
                userInfo:req.userInfo,
                message:"删除成功",
                url:"/admin/content"
            })
        }
    })
})

//返回app.js
module.exports=router;