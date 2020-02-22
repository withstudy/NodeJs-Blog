/**
 * Created by 14843 on 2019/11/19.
 */
var mongoose = require("mongoose");
var usersSchema = require("../schemas/users")
module.exports=mongoose.model("User",usersSchema)
var mysql=require("mysql");

var user={
    id: int,
    username:String,
    password:String
};