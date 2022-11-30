const reviewModel= require("../models/reviewModel")
const bookModel =  require("../models/bookModel");


//========================================= create review for books =========================================//

const createReviews= async function(req,res){
    try{
        let bookId= req.params.bookId

        if(!bookId){ return res.status(400).send({status:false,message:"bookId is required"})}
        console.log(bookId)
        let findBook = await bookModel.findById(bookId)
            if(!findBook){ return res.status(404).send({status:false,message:"book not found"})}
        if(findBook.isDeleted){ return res.status(400).send({status:false,message:"book is deleted"})}  

          let data = req.body
        let {reviewedBy,rating}= data
          data.bookId= bookId
        
        if(Object.keys(data).length==0){
            return res.status(400).send({status:false,message:"data should be present in request body"})
        }
          
        if(!reviewedBy){ return res.status(400).send({status:false,message:"reviewedBy is required"})}
        if(!rating){ return res.status(400).send({status:false,message:"rating is mandatory"})}
        
        if(data.rating > 5 || data.rating < 1) { return res.status(400).send({ status: false, message: 'Rating should be between 1 to 5', }) }

    
         await reviewModel.create(data)
         let reviewsData= await reviewModel.find({bookId:bookId})

       let updateData=await bookModel.findOneAndUpdate({_id:bookId,isDeleted:false},{$inc:{reviews:1}},{new:true}).lean()
       updateData.reviewsData=reviewsData
       return  res.status(201).send({ status: true, message: "success", data: updateData })
        
    }   
    catch(error){
        return res.status(400).send({status:false,message:error.message})
    }
}

//===============================================update review of book ========================================///


const updateReviwews = async (req, res) => {
    try {
        let reviewerId = req.params.reviewId
        let bookId = req.params.bookId
        if (!bookId) { return res.status(400).send({ status: false, message: "bookId should be present" }) }
        if (!reviewerId) { return res.status(400).send({ status: false, message: "reviewId should be present" }) }
        let books = await bookModel.findOne({ $and: [{ _id: bookId, isDeleted: false }] }).lean()
        if (books === null) { return res.status(404).send({ status: false, message: "book not found" }) }
        let reviewData = req.body
        let {review , rating , reviewedBy}=reviewData
        if (rating > 5 || rating < 1) { return res.status(400).send({ status: false, message: 'Rating should be between 1 to 5', }) }
       //review, rating, reviewer's name.
        let reviewsData = await reviewModel.findOneAndUpdate(
            { _id: reviewerId },
            { $set: {review:review ,rating:rating ,reviewedBy:reviewedBy } },
            { new: true }
        )
        books.reviewsData = reviewsData
        return res.status(200).send({ status: true, message: "Success", data: books })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}




///=========================================== delete reviws ================================================//

const deleteReviews = async function (req,res){
    try{
        let reviewId = req.params.reviewId;
        let bookId = req.params.bookId

        if (!isValidObjectId(bookId)){return res.status(400).send({status:false, message:"bookId is not valid"})}
        let book =await bookModel.findOne({_id:bookId, isDeleted:false})
        if(!book){

            return res.status(404).send({status:false,massage:'Book does not exist or deleted'})
        }


        if (!isValidObjectId(reviewId)){return res.status(400).send({status:false, message: "ReviewId is Invalid"}) }

        let review = await reviewModel.findOne({_id:reviewId,bookId:bookId,isDeleted:false})

        if (!review){
            return res.status(404).send({status:false, message:'Review does not exist or deleled for given Id'})

        }
     const deleteReview = await reviewModel.findOneAndUpdate({ _id: reviewId, bookId: bookId, isDeleted: false },
         { $set: { isDeleted: true } },
         {$inc:-1},
         {new:true})

        // if( deleteReview)
        //     return res.status(404).send({ status: true, message: 'Review Does Not Found.' })


            //await bookModel.findOneAndUpdate({ _id: bookId }, { reviews: review - 1 })

       return res.status(200).send({ status: true, message: 'success',data:deleteReview })    


    }
    catch(err){ 
        res.status(500).send({status:false,message:err.massage});
    }
}



//-------------------------------------------------------------------------------------------------------------
module.exports.createReviews=createReviews
module.exports.updateReviwews = updateReviwews
module.exports.deleteReviews=deleteReviews



//
// const updateReviwes = async (req, res) => {
//     try {
//         let reviewerId = req.params.reviewId
//         let bookId = req.params.bookId
//         if (!bookId) { return res.status(400).send({ status: false, message: "bookId should be present" }) }
//         if (!reviewerId) { return res.status(400).send({ status: false, message: "reviewId should be present" }) }

//         let books = await bookModel.findOne({ $and: [{ _id: bookId, isDeleted: false }] })
//         //console.log(books)
//         if (books === null) { return res.status(404).send({ status: false, message: "book not found" }) }

//         let reviewData = req.body
//         let {review , rating , reviewedBy}=reviewData

//         if (rating > 5 || rating < 1) { return res.status(400).send({ status: false, message: 'Rating should be between 1 to 5', }) }

//        //review, rating, reviewer's name.
//         let UpdateReviwerdata = await reviewModel.findOneAndUpdate(
//             { _id: reviewerId },
//             { $set: {review:review ,rating:rating ,reviewedBy:reviewedBy } },
//             { new: true }
//         )
//         return res.status(200).send({ status: true, message: "Success", data: UpdateReviwerdata })
//     }
//     catch (err) {
//         res.status(500).send({ status: false, message: err.message })
//     }
// }