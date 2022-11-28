const mongoose = require('mongoose')
const userModel = mongoose.Schema({
    title: { type:String, require:true, enum:['Mr', 'Mrs', 'Miss']},
    phone: {type:String, require:true, unique:true},
    name: {type:String, require:true,},
    email: {type:String, require:true, unique:true},
    password: {type:String, require:true, unique:true},//string, mandatory, minLen 8, maxLen 15
    address: {street: {type:String},city: {type:String},pincode: {type:String}},
},{ timestamps: true})

module.exports = mongoose.model('UserDetails',userModel)