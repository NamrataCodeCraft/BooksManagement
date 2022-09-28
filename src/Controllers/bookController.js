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

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
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
            return res.status(400).send({ status: false, message: "title field is required" })
        }
        let uniquetitle = await bookModel.findOne({ title: title })
        if (uniquetitle) {
            return res.status(400).send({ status: false, message: "Please use different title because its already used" })
        }
        if (!isValid(excerpt)) {
            return res.status(400).send({ status: false, message: "excerpt field is required" })
        }
        if (!isValid(userId)) {
            return res.status(400).send({ status: false, message: "userId should be present" })
        }
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: `${userId} is not a valid userId` })
        }
        let userIdcheck = await userModel.findById(userId)
        if (!userIdcheck) {
            return res.status(404).send({ status: false, message: "userId not found" })
        }
        let token = req.headers["x-api-key"];
        let decodedToken = jwt.verify(token, "Project_3_BooksManagement")
        if (decodedToken.userId != userId) {
            return res.status(403).send({ status: false, message: 'User logged is not allowed to create data please check userId' })
        }
        if (!isValid(ISBN)) {
            return res.status(400).send({ status: false, message: "please provide ISBN" })
        }
        let ISBNvalidate = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN.trim())
        if (!(ISBNvalidate)) {
            return res.status(400).send({ status: false, message: "please provide 10 or 13 digits ISBN" })
        }
        let uniqueISBN = await bookModel.findOne({ ISBN: ISBN })
        if (uniqueISBN) {
            return res.status(400).send({ status: false, message: "Please use different ISBN because its already used" })
        }
        if (!isValid(category)) {
            return res.status(400).send({ status: false, message: "please provide category" })
        }
        if (!isValid(subcategory)) {
            return res.status(400).send({ status: false, message: "please provide subcategory" })
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
            if (!isValidObjectId(filter.userId)) {                                                // isValid function is not used due to contradiction 
                return res.status(400).send({ status: false, message: `${filter.userId} must be 24 characters` }) //checkit once
            }
            let allbooks = await bookModel.find(filter).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, subcategory: 1, reviews: 1, releasedAt: 1 }).sort({ title: 1 })
            if (!allbooks.length) {
                return res.status(404).send({ status: false, message: "No books found with requested query" })
            }
            return res.status(200).send({ status: true, message: "Book list", data: allbooks })
        }
        let getbooks = await bookModel.find({ isDeleted: false }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 }).sort({ title: 1 })
        if (!getbooks.length)
            return res.status(404).send({ status: false, message: "Book does not exist" })
        res.status(200).send({ status: true, message: "Book list", data: getbooks })
    }
    catch (error) {
        res.status(500).send({ msg: "Error", error: error.message })
    }
}

//============================================================== Get books by bookId ============================================================== //

let getbooksbyId = async function (req, res) {
    try {
        let bookid = req.params.bookId
        if (!ObjectId.isValid(bookid)) {
            return res.status(400).send({ status: false, message: "bookId must be present and must be of 24 characters" })
        }
        let getDetails = await bookModel.findOne({ _id: bookid, isDeleted: false }).select({__v:0})
        if (!getDetails) return res.status(404).send({ status: false, message: "No such book found" })

        let reviewDetails = await reviewModel.find({ bookId: getDetails._id, isDeleted: false }).select({isDeleted:0,__v:0})

        let {...booksData} = getDetails
        booksData._doc.reviewsData = reviewDetails
    
        res.status(200).send({ status: true, message: "Book list", data: booksData._doc })
    }
    catch (error) {
        res.status(500).send({ msg: "Error", error: error.message })
    }
}

//============================================================= Update books ================================================================//

const updateBooks = async function (req, res) {
    try {
        let bookid = req.params.bookId;
        if (!ObjectId.isValid(bookid)) {
            return res.status(400).send({ status: false, message: "bookId must be present and must be of 24 characters" })
        }
        let book = await bookModel.findOne({ _id: bookid, isDeleted: false })
        if (!book) {
            return res.status(404).send({ status: false, message: "bookId is not matching with any existing bookId or it is deleted " })
        }
        let token = req.headers["x-api-key"];
        let decodedToken = jwt.verify(token, "Project_3_BooksManagement")
        if (decodedToken.userId != book.userId) {
            return res.status(403).send({ status: false, msg: 'User logged is not allowed to modify the requested users data' })
        }
        let data = req.body;
        if (Object.keys(data).length <= 0) {
            return res.status(400).send({ status: false, message: "please provide data which you want to update" })
        }
        const { title, excerpt, releasedAt, ISBN } = data;
        if (title) {
            let uniquetitle = await bookModel.findOne({ title: title, isDeleted: false })
            if (uniquetitle) {
                return res.status(400).send({ status: false, message: "title should be unique , it is already existed with any other book " })
            }
            book.title = title;
        }
        if (excerpt) book.excerpt = excerpt;
        if (releasedAt) book.releasedAt = releasedAt;
        if (!isValidDate(releasedAt)) {
            return res.status(400).send({ status: false, message: "Invalid date format, Please provide date as 'YYYY-MM-DD' " })
        }
        let ISBNvalidate = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN.trim())
        if (!ISBNvalidate) {
            return res.status(400).send({ status: false, message: "please provide 10 or 13 digits ISBN" })
        }
        if (ISBN) {
            let uniqueISBN = await bookModel.findOne({ ISBN: ISBN, isDeleted: false })
            if (uniqueISBN) {
                return res.status(400).send({ status: false, message: "ISBN should be unique , it is already existed with any other book " })
            }
            book.ISBN = ISBN;
        }
        book.save();
        return res.status(200).send({ status: true, message: "Success", data: book })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//============================================================== delete by Id =============================================================//
const deleteBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        if (bookId) {
            if (!ObjectId.isValid(bookId)) {
                return res.status(400).send({ status: false, message: "bookId must be present and must be of 24 characters" })
            }
        }
        let book = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) {
            return res.status(404).send({ status: false, message: "bookId is not matching with any existing bookId or it is deleted " })
        }
        let token = req.headers["x-api-key"];
        let decodedToken = jwt.verify(token, "Project_3_BooksManagement")
        if (decodedToken.userId != book.userId) {
            return res.status(403).send({ status: false, message: 'User logged is not allowed to delete book' })
        }
        let deleted = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })
        if (deleted) {
            return res.status(200).send({ status: true, message: "Success" })
        }
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}
//=============================================================== module exported ==========================================================//
module.exports = {
    createbook,
    getbooks,
    getbooksbyId,
    updateBooks,
    deleteBookById
}