const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const reviewModel = require("../models/reviewModel")
const vaidator = require("validator")
const moment = require("moment")
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId

//============================================================= validation ==================================================================//

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidISBN = function (value) {
    if (!value.match(/^[0-9]*$/)) return false
    return true
}

const isValidDate = function (value) {
    if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) return false
    return true;
}


//======================================================= create book ======================================================================//

let createbook = async function (req, res) {
    try {
        let data = req.body
        let { title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt } = data

        if (Object.keys(data).length <= 0) {
            return res.status(400).send({ status: false, message: "please provide data" })
        }
        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: "title field should not be empty" })
        }
        let uniquetitle = await bookModel.findOne({ title: title })
        if (uniquetitle) {
            return res.status(400).send({ status: false, message: "Please use different title because its already used" })
        }
        if (!isValid(excerpt)) {
            return res.status(400).send({ status: false, message: "excerpt field is required" })
        }
        if (!ObjectId.isValid(userId)) {
            return res.status(400).send({ status: false, message: "userId should be present and must be 24 characters" })
        }
        let userIdcheck = await userModel.findById(userId)
        if (!userIdcheck) {
            return res.status(404).send({ status: false, mesaage: "userId not found" })
        }
        if (!isValid(ISBN)) {
            return res.status(400).send({ status: false, message: "please provide ISBN" })
        }
        if (!isValidISBN(ISBN)) {
            return res.status(400).send({ status: false, message: "please provide 10 digits ISBN" })
        }
        let uniqueISBN = await bookModel.findOne({ ISBN: ISBN })
        if (uniqueISBN) {
            return res.status(400).send({ status: false, mesaage: "Please use different ISBN because its already used" })
        }
        if (!isValid(category)) {
            return res.status(400).send({ status: false, message: "please provide category" })
        }

        if (!isValid(subcategory)) {
            return res.status(400).send({ status: false, mesaage: "please provide subcategory" })
        }
        if (!isValid(releasedAt)) {
            return res.status(400).send({ status: false, message: "please provide releasedAt" })
        }
        if (!isValidDate(releasedAt)) {
            return res.status(400).send({ status: false, message: "Invalid date format, Please provide date as 'YYYY-MM-DD' " })
        }
        let savedata = await bookModel.create(data)
        res.status(201).send({ status: true, message: "Success", data: savedata })
    } catch (err) {
        res.status(500).send({ message: "Error", error: err.message })
    }
}

//============================================================== Get books ============================================================== //

let getbooks = async function (req, res) {
    try {
        let query = Object.keys(req.query);
        if (query.length) {
            let filter = req.query;
            filter.isDeleted = false;
            // filter.toLowerCase()
            if (!ObjectId(filter.userId)) {                                                // isValid function is not used due to contradiction 
                return res.status(400).send({ status: false, message: "userId must be 24 characters" })
            }
            let allbooks = await bookModel.find(filter).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, subcategory: 1, reviews: 1, releasedAt: 1 }).sort({ title: 1 })
            if (!allbooks.length) {
                return res.status(404).send({ status: false, mesaage: "No books found with requested query" })
            }
            return res.status(200).send({ status: true, message: "Success", data: allbooks })
        }
        let getbooks = await bookModel.find({ isDeleted: false }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 }).sort({ title: 1 })
        if (!getbooks.length)
            return res.status(404).send({ status: false, mesaage: "Book does not exist" })
        res.status(200).send({ status: true, message: "Success", data: getbooks })
    }
    catch (error) {
        res.status(500).send({ msg: "Error", error: error.message })
    }
}

//============================================================== Get books by bookId ============================================================== //

let getbooksbyId = async function (req, res) {
    try {
        let bookid = req.params.booksId
        if(!isValid(bookid)){
            return res.status(400).send({ status: false, message: "Please provide bookId" })
        }
        if (!ObjectId.isValid(bookid)) {
            return res.status(400).send({ status: false, message: "bookId must be 24 characters" })
        }
        let getDetails = await bookModel.findOne({ _id: bookid, isDeleted: false })
        if (!getDetails) return res.status(404).send({ status: false, message: "No such book found" })

        let reviewDetails = await reviewModel.find({ bookId: getDetails._id }).select({ createdAt: 0, updatedAt: 0 })

        let booksData = {
            _id:getDetails._id,
            title: getDetails.title,
            excerpt: getDetails.excerpt,
            userId: getDetails.userId,
            category: getDetails.category,
            subcategory: getDetails.subcategory,
            isDeleted: getDetails.isDeleted,
            reviews: getDetails.reviews,
            releasedAt: getDetails.releasedAt,
            createdAt: getDetails.createdAt,
            updatedAt: getDetails.updatedAt,
            reviewsData: reviewDetails
        }
        res.status(200).send({ status: true, mesaage: "Success", data: booksData })
    }
    catch (error) {
        res.status(500).send({ msg: "Error", error: error.message })
    }
}


module.exports = {
    createbook,
    getbooks,
    getbooksbyId
}