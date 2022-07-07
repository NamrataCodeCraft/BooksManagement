const express = require("express");
const bodyParser= require("body-parser");
const route = require("./route/route.js")
const mongoose = require("mongoose");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
mongoose.connect("mongodb+srv://nishusweet:8052466943@cluster0.n9bf08l.mongodb.net/group41Database" ,{
newUrlParser:true})
.then(()=>console.log("mongoDB is connected"))
.catch((err)=> console.log(err.message))
app.use("/", route);
app.listen(process.env.PORT || 3000, function(){
    console.log("express app running on PORT" + (process.env.PORT || 3000))
})