const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const reviewModel = require("../models/reviewModel")
const vaidator = require("validator")
const moment = require("moment")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const ObjectId = mongoose.Types.ObjectId

//============================================================= validation ==================================================================//

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidDate = function (value) {
    if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) return false
    return true;
}

//============================================================== Create review =========================================================//

const createreveiw = async function (req, res) {
    try {
        let bookid = req.params.bookId
        if (!ObjectId.isValid(bookid)) {
            return res.status(400).send({ status: false, message: "bookId should be present in params and must be 24 characters" })
        }
        let paramsbookIdcheck = await bookModel.findOne({ _id: bookid, isDeleted: false })
        if (!paramsbookIdcheck) {
            return res.status(404).send({ status: false, message: "bookId not found or it is deleted" })
        }
        let data = req.body
        let { reviewedBy, rating, review } = data
        if (Object.keys(data).length <= 0) {
            return res.status(400).send({ status: false, message: "please provide review data" })
        }
        data.bookId = bookid
        // if (!isValid(reviewedBy)) {
        //     return res.status(400).send({ status: false, message: "reviewedBy field is required" })
        // }
        // if (!(/^[A-Za-z]+$/).test(reviewedBy.trim())) {
        //     return res.status(400).send({ status: false, message: "reviewedBy should only contain alphabet" })
        // }
        if (!isValid(rating)) {
            return res.status(400).send({ status: false, message: "rating field is required" })
        }
        let ratingvalidate = /^[0-5]{1}$/.test(rating)
        if (!ratingvalidate) {
            return res.status(400).send({ status: false, message: "please provide rating in single digit from 0 to 5 only " })
        }
        const reviewCreation = await reviewModel.create(data)
        let reviewDetails = await reviewModel.find({_id:reviewCreation._id}).select({isDeleted:0,__v:0})
        
        let getDetails = await bookModel.findOneAndUpdate({ _id: bookid }, { $inc: { reviews: 1 } }, { new: true }).select({__v: 0})
        let {...bookData} = getDetails
        // console.log(bookData) 
        bookData._doc.reviewsData = reviewDetails
        
        res.status(201).send({ status: true, message: "Success", data: bookData._doc })
    } catch (err) {
        res.status(500).send({ message: "Error", error: err.message })
    }
}
//=============================================================== update review ============================================================//
const updatereview = async function (req,res) {
    try {
        let id = req.params
        if (!ObjectId.isValid(req.params.bookId)) {
            return res.status(400).send({ status: false, message: "bookId should be present in params and must be 24 characters" })
        }
        let book = await bookModel.findOne({ _id: req.params.bookId, isDeleted: false }).select({__v:0})
        if (!book) {
            return res.status(404).send({ status: false, message: "bookId is not matching with any existing bookId or it is deleted " })
        }
        if (!ObjectId.isValid(req.params.reviewId)) {
            return res.status(400).send({ status: false, message: "reviewId should be present in params and must be 24 characters" })
        }
        let paramsreviewIdcheck = await reviewModel.findOne({ _id: req.params.reviewId, isDeleted: false }).select({isDeleted:0,__v:0})
        if (!paramsreviewIdcheck) {
            return res.status(404).send({ status: false, message: "reviewId not found or it is deleted" })
        }
        let data = req.body
        if (Object.keys(data).length <= 0) {
            return res.status(400).send({ status: false, message: "please provide data which you want to update" })
        }
        const { reviewedBy, rating, review } = data
        if (reviewedBy) {
            paramsreviewIdcheck.reviewedBy = reviewedBy
        };
        let ratingvalidate = /^[0-5]{1}$/.test(rating)
        if (!ratingvalidate) {
            return res.status(400).send({ status: false, message: "please provide rating in single digit from 0 to 5 only " })
        }
        if (rating) paramsreviewIdcheck.rating = rating;
        if (review) paramsreviewIdcheck.review = review;
        paramsreviewIdcheck.reviewedAt = Date.now()
        paramsreviewIdcheck.save();
        const {...updatedbook} = book
        updatedbook._doc.reviewsData = paramsreviewIdcheck
        return res.status(200).send({ status: true, message: "Book list", data:updatedbook._doc })
    } catch (err) {
        res.status(500).send({ message: "Error", error: err.message })
    }
}

//================================================================ Delete review by bookId and review Id =====================================//

const deletereview = async function (req, res) {
    try {
        let id = req.params
        if (!ObjectId.isValid(req.params.bookId)) {
            return res.status(400).send({ status: false, message: "bookId should be present in params and must be 24 characters" })
        }
        let paramsbookIdcheck = await bookModel.findOne({ _id: req.params.bookId, isDeleted: false })
        if (!paramsbookIdcheck) {
            return res.status(404).send({ status: false, message: "bookId not found or it is deleted" })
        }
        if (!ObjectId.isValid(req.params.reviewId)) {
            return res.status(400).send({ status: false, message: "reviewId should be present in params and must be 24 characters" })
        }
        let paramsreviewIdcheck = await reviewModel.findOne({ _id: req.params.reviewId, isDeleted: false })
        if (!paramsreviewIdcheck) {
            return res.status(404).send({ status: false, message: "reviewId not found or it is deleted" })
        }
        let deleted = await reviewModel.findOneAndUpdate({ _id: req.params.reviewId, isDeleted: false }, { $set: { isDeleted: true} }) 
        let getDetails = await bookModel.findOneAndUpdate({ _id: req.params.bookId }, { $inc: { reviews: -1 } })
        res.status(200).send({ Status: true, message: "Success" })
    } catch (err) {
        res.status(500).send({ message: "Error", error: err.message })
    }
}

//========================================================= module exported =============================================================//

module.exports = {
    createreveiw,
    updatereview,
    deletereview
}