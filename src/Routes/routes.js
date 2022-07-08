const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController")
const bookcontroller = require("../controllers/bookController")
// const middleware = require("../middleware/middleware")

router.post("/register",userController.createUser)

router.post("/login",userController.loginUser)

router.post("/books", bookcontroller.createbook)  // all books api should be authenticated 

router.get("/books", bookcontroller.getbooks)   // authorization in create update and delete

router.get("/books/:booksId",bookcontroller.getbooksbyId)

module.exports = router