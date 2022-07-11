const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId;

const reviewSchema = new mongoose.Schema({
    bookId: {
        type: ObjectId,
        ref: 'Book',
        required: "bookId is required"
    },
    reviewedBy: {
        type: String,
        required: "reviewedby is required",
        default: "Guest",
        trim: true
    },
    reviewedAt: {
        type: Date,
        default:Date.now(),
        required: true
    },
    rating: {
        type: Number,
        required: "rating is required"
    },
    review: {
        type: String,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Review', reviewSchema)  //reviews