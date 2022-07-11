const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController")
const bookcontroller = require("../controllers/bookController")
const reviewcontroller = require("../controllers/reviewController")
const middleware = require("../middleware/auth")

router.post("/register",userController.createUser)

router.post("/login",userController.loginUser)

router.post("/books", middleware.authentication,bookcontroller.createbook)  // all books api should be authenticated 

router.get("/books", middleware.authentication,bookcontroller.getbooks)   // authorization in create update and delete

router.get("/books/:bookId",middleware.authentication,bookcontroller.getbooksbyId)

router.put("/books/:bookId",middleware.authentication,bookcontroller.updateBooks)

router.delete("/books/:bookId",middleware.authentication,bookcontroller.deleteBookById)

router.post("/books/:bookId/review",middleware.authentication,reviewcontroller.createreveiw)

router.put("/books/:bookId/review/:reviewId",middleware.authentication,reviewcontroller.updatereview)

router.delete("/books/:bookId/review/:reviewId",middleware.authentication,reviewcontroller.deletereview)

router.all('/*', async function(req, res){
    res.status(404).send({status: false, msg: "Page Not Found!!!"})
})


module.exports = router