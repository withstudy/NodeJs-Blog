/**
 * Created by 14843 on 2019/11/19.
 */
var mongoose = require("mongoose");
//表结构
module.exports = new mongoose.Schema({
    username:String,
    password:String
})
var mysql=require("mysql");