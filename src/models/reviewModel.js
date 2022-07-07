const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId
const reviewSchema = new mongoose.Schema({

    bookId: { type:objectId, required:true, ref:"books"},

    reviewedBy: {type:String, required:"This field is required", default: "Guest" },    
    
    reviewedAt: { type:Date, required:"This field is required"},

    rating: { type:Number, minlength:1, maxlength:5, required:"This field is required",  },  //     rating: {number, min 1, max 5, mandatory},
    
    review: { type:String },

    isDeleted:{ type:Boolean, default:false,}

},{timestamps:true})

module.exports = mongoose.model("review", reviewSchema)


