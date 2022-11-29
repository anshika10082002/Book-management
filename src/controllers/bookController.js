const bookModel =  require("../models/bookModel");
const userModel = require('../models/userModel')
const validations=require('../validations/validation')
const reviewModel=require("../models/reviewModel")
const moment = require('moment')

const  {isDateValid,isValidObjectId} = validations

//==================================== create book data ============================================================//

const createBookData = async (req,res)=>{
    try{
     let data = req.body
     let {title , excerpt , userId , ISBN , category , subcategory , releasedAt} = data

    if(Object.keys(req.body).length == 0){
        return res.status(400).send({status: false,message: "data is madatory in request body"})
    }
    if(!title){
        return res.status(400).send({status: false,message: "title is  madatory "})
    }
    let titleInModel = await bookModel.findOne({title:title})
    if(titleInModel){return res.status(400).send({status: false,message: "title should be Unique "})}

    if(!excerpt){
        return res.status(400).send({status: false,message: "excerpt is  madatory "})
    }
    
    if(!userId){
        return res.status(400).send({status: false,message: "userId is  madatory "})
    }
    if(!isValidObjectId(userId)){
        return res.status(400).send({status:false,message:"invalid userId"})
    }

    let userIdInModel = await userModel.findById(req.body.userId)
    if(!userIdInModel){
        return res.status(400).send({status: false,message: "userId not exist "})
    }

    if(!ISBN){
        return res.status(400).send({status: false,message: "ISBN is  madatory "})
    }
    let ISBNInModel = await bookModel.findOne({ISBN:ISBN})

    if(ISBNInModel){return res.status(400).send({status: false,message: "ISBN should be Unique "})}

    if(!category){
        return res.status(400).send({status: false,message: "category is madatory "})
    }

    if(!subcategory){return res.status(400).send({status: false,message: "subcategory is madatory "})}


    if(!releasedAt){return res.status(400).send({status: false,message: "releasedAt is madatory"})}
    // if(req.body.releasedAt){

    //     data["releasedAt"]=moment().format("YYYY-MM-DD")
    // }
   if(!isDateValid(releasedAt)){return res.status(400).send({status: false,message:"releasedAt date should be in  format YYYY-MM-DD ,2000-03-04"})}

  
  if(req.token.userId!==userId){
    return res.status(403).send({status:false, message:"not authorized"})
  }

    if(req.body.isDeleted){
    data["deletedAt"]=moment().format()
   }

    let bookdata = await bookModel.create(data)
    return res.status(201).send({status: true,message: 'Success',data:bookdata })

    }catch(err){
        res.status(500).send({status:false,message:err.message})
    }
}



//===================================== get books data ==============================================//

const getBooksData = async function (req, res) {
    try {
        let data = req.query;
        let {userId,category,subcategory}=data
        let bookData = {isDeleted:false};

        if (Object.keys(data).length ==0) {
          let  getBooks = await bookModel.find({data, isDeleted: false }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1, }).sort({ title: 1 })
            return res.status(200).send({ status: true, message: 'Books list', data: getBooks })
        }

        if (data.userId) {
            if (!isValidObjectId(data.userId)) {
                return res.status(400).send({ status: false, message: "UserId Invalid " })
            }
        }
        if (userId) {
            bookData.userId = userId
        }
        if (category) {
            bookData.category = category
        }
        if (subcategory) {
            bookData.subcategory = subcategory
        }
        
        let books = await bookModel.find(bookData).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, subcategory: 1, reviews: 1, releasedAt: 1, }).sort({ title: 1 })
    
        if (books.length ==0) {
            return res.status(404).send({ status: false, message: "No data found" })
    }
        else 
           {return res.status(200).send({ status: true, message: 'Books list', data: books })}
          
    }
    catch (err) {
        res.status(500).send({ message: err.message })
    }
}
//============================================== Get books with reviews data =======================================//

const fetchBookById = async (req, res) => {
    try {
        let bookId = req.params.bookId

        if(!bookId){return res.status(400).send("id not present")}

        if (!isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: " invalid bookId plese Enter again ...!" }) }

        let books = await bookModel.findOne({$and:[{ _id:bookId, isDeleted: false }]})
        if (books.length == 0) { return res.status(404).send({ status: false, message: "book not found" }) }

        let {_id,title,excerpt,userId,category,subcategory,isDeleted,reviews,releasedAt,createdAt,updatedAt} = books
        let obj = {_id,title,excerpt,userId,category,subcategory,isDeleted,reviews,releasedAt,createdAt,updatedAt}
        let allReviews = await reviewModel.find({bookId:bookId})
        let reviewsArray = allReviews
        obj.reviewsData = reviewsArray
        obj.reviews = reviewsArray.length
        res.status(200).send({ status: true, message: 'Books list', data:obj })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


    //     const createReviews = async (req,res)=>{
    //      let data = req.body 
    // let Allreviews = await reviewsModel.create(data)
    // res.status(201).send({ status: true, data:Allreviews })
//} 




//============================================= Update books by bookId=============================================///

const updateBooks = async function (req, res) {
    try {
        let data = req.body
        const bookId = req.params.bookId
        let { title, excerpt, releasedAt, ISBN } = data
        
        if(!bookId){ return res.status(400).send({ status: false, message: "bookId should be present" }) }

        if(!isValidObjectId(bookId)){ return res.status(400).send({status:false,message:"invalid bookId"})}
        
        let findBook = await bookModel.findById(bookId)
        
        if(!findBook) { return res.status(404).send({ status: false, message: "book not found" }) }
        if(findBook.isDeleted == true) { return res.status(400).send({ status: false, message: "book is already deleted" }) }

        if(Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "data should be present in request body" })
        }

        if(findBook.title == title){ return res.status(400).send({ status: false, message: "title should be uniqe" })}
        if(findBook.excerpt == excerpt){ return res.status(400).send({ status: false, message: "excerpt should be uniqe" })}
        if(findBook.ISBN == ISBN){ return res.status(400).send({ status: false, message: "ISBN should be uniqe" })}
        if(findBook.releasedAt == releasedAt){ return res.status(400).send({ status: false, message: "releasedAt should be uniqe" })}


        
        let userId=findBook.userId.toString()

       if(req.token.userId!==userId){
        return res.status(403).send({status:false,message:"not authorised"})
       }

        let updateBooks = await bookModel.findOneAndUpdate(
            {_id:bookId},//book
            {$set:{title:title,excerpt:excerpt,releasedAt:releasedAt,ISBN:ISBN}},
           { new : true}
        )
        return res.status(200).send({ status: true, message: "Success" ,data :updateBooks })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}


//====================================================== Delete book by BookId=======================================//

const deleteBookById = async function (req,res) {
    try{
        let bookId =req.params.bookId;

        if (!bookId){ return res.status(400).send({status:false,message:"BookId is required"})}

        if(!isValidObjectId(bookId)){
            return res.status(400).send({status:false,message:"enter valid bookId"})
        }
        let book =await bookModel.findById(bookId)
        if (!book){
            return res.status(404).send({status:false, message:"this book is not present"});
        };
            if(book.isDeleted) {return res.status(404).send({status :false,message:" book is already deleted"})}
         
            let userId=book.userId.toString()

            if(req.token.userId!==userId){
                return res.status(403).send({status:false, message:"not authorized"})
              }

           let deleteBook= await bookModel.findOneAndUpdate(
            {_id:bookId},
            {$set:{isDeleted:true,deletedAt:moment().format("YYYY-MM-DD")}}, 
            {new: true})
          
            return res.status(200).send({status:true,message:"success",data:deleteBook})
        }
        catch(err){
            res.status(500).send({status:false,error:err.message})  
      }
    };




module.exports.getBooksData = getBooksData
module.exports.createBookData = createBookData
module.exports.updateBooks=updateBooks
module.exports.deleteBookById=deleteBookById
module.exports.fetchBookById = fetchBookById //,createReviews



