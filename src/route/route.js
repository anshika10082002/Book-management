const express = require('express')
const route = express.Router()
const userController = require('../controllers/userController')

route.get('/test', (req,res)=> {return res.send('ok')})
route.post('/register', userController.creatUser)

module.exports = route