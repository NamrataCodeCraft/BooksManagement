const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({

    title: { type:String, required:true, unique:true},

    excerpt: { type:String, required:"Excerpt is required",},

    userId: {type:mongoose.Schema.Types.ObjectId, required:"UserId is required", ref:"user"},

    ISBN: { type:String, required:"ISBN is required", unique:true},

    category: { type:String, required:"Category is required"},

    subCategory: {type:[String], required:"SubCategory is required",},

    reviews: {type:Number, default:0, comment:" Holds number of reviews of this book"},  

    isDeleted: { type:Boolean, default:false},

    deletedAt: { type:Date,},

    releasedAt: { type:Date, required:"REleased date is required", format:("YYYY-MM-DD") }, //  releasedAt: {Date, mandatory, format("YYYY-MM-DD")},

},{timestamps:true})

module.exports = mongoose.model("book", bookSchema);


