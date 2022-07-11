const mongoose = require("mongoose")
const moment = require("moment")
const ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: "title is required",
        unique: true,
        trim: true
    },
    excerpt: {
        type: String,
        required: "excerpt is required",
        trim: true
    },
    userId: {
        type: ObjectId,
        ref: 'User',
        required: "userId is required",
        trim: true
    },
    ISBN: {
        type: String,
        required: "ISBN is required",
        unique: true,
        trim: true
    },
    category: {
        type: String,
        required: "category is required",
        trim: true
    },
    subcategory: {
        type: [String],
        required: "subcategory is required",
        trim: true
    },
    reviews: {
        type: Number,
        default: 0,
        // Comment:, 
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
    },
    releasedAt: {
        type: Date,
        default: moment(new Date()).format("YYYY-MM-DD")
    }
}, { timestamps: true })

module.exports = mongoose.model('Book', bookSchema)//books