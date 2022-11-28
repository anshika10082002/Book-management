const bookModel =  require("../models/bookModel");
const userModel = require('../models/userModel')
const validations=require('../validations/validation')

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

   if(!isDateValid(releasedAt)){return res.status(400).send({status: false,message: "releasedAt date should be in  format YYYY-MM-DD ,2000-03-04"})}

  if(req.decodeToken.userId!==userId){
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



module.exports.getBooksData = getBooksData
module.exports.createBookData = createBookData