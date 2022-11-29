const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const reviewsSchema = new mongoose.Schema({
    bookId:{type:ObjectId,ref:"BookDetails"},
    reviewedBy:{type:String},
    reviewedAt:{type:String},
    rating:{type:Number},
    review:{type:String}
})
module.exports = mongoose.model("Allreviews",reviewsSchema)