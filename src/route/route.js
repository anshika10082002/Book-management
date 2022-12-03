const express = require('express')
const route = express.Router()
const userController = require('../controllers/userController')
const bookController= require("../controllers/bookController")
const reviewController= require("../controllers/reviewController")
const middleware= require("../middleware/auth")

//==============================user apis=================================================//
route.post('/register', userController.createUsers)

route.post("/login",userController.userLogin)

//===============================book apis===============================================//

route.post("/books",middleware.authenticate,bookController.createBookData)

route.get('/books',bookController.getBooksData)//middleware.authenticate,

route.get("/books/:bookId",middleware.authenticate,bookController.fetchBookById)

route.put("/books/:bookId",middleware.authenticate,bookController.updateBooks)
 
route.delete("/books/:bookId",middleware.authenticate,bookController.deleteBookById)

//================================== review api================================================//

route.post("/books/:bookId/review",reviewController.createReviews)

route.put("/books/:bookId/review/:reviewId",reviewController.updateReviwews)

route.delete("/books/:bookId/review/:reviewId",reviewController.deleteReviews)



module.exports = route