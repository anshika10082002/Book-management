const express = require('express')
const route = express.Router()
const userController = require('../controllers/userController')
const bookController= require("../controllers/bookController")
const middleware= require("../middleware/auth")

//==============================user api=================================================//
route.post('/register', userController.createUsers)

route.post("/login",userController.userLogin)

//===============================book api===============================================//

route.post("/books",middleware.authenticate,bookController.createBookData)

route.get('/books',middleware.authenticate,bookController.getBooksData)

route.get("/books/:bookId",middleware.authenticate,bookController.fetchBookById)

route.put("/books/:bookId",middleware.authenticate,bookController.updateBooks)

route.delete("/books/:bookId",middleware.authenticate,bookController.deleteBookById)



module.exports = route