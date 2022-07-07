const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController")
const bookController = require("../controllers/bookController")
const reviewController = require("../controllers/reviewController")
 router.post("/user", userController.createUser)
 