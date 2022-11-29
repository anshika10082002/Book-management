const userModel = require('../models/userModel')
const validations= require("../validations/validation")
const jwt= require("jsonwebtoken")

let {isEmpty,isValidName,isValidEmail,isValidMobileNo,isValidPassword} = validations

//=================================================== REGISTER USERS =========================================//

const createUsers = async (req,res)=>{
 try{  
    let data= req.body
    let {title,phone,name,email,password} = data

    if(Object.keys(data).length == 0){
        return  res.status(400).send({status: false,message:"request body can not be empty"})
    }

    if(!title){
       return res.status(400).send({status:false,message:"title is required"})
    }
    let titles = userModel.schema.obj.title.enum
    if(!titles.includes(title)){return  res.status(400).send({status: false,message:"Enter valid title 'Mr'/'Mrs'/ 'Miss'  "})}
    
    if(!name){
        return res.status(400).send({status:false,message:"name is required"})
    }
    if(!isEmpty){
        return res.status(400).send({status:false,message:"name can not be empty "})
    }
    if(!isValidName(name))
    {return  res.status(400).send({status: false,message:"Please Enter valid name"})}

    if(!phone){
        return res.status(400).send({status:false,message:"phone  is required"})
    }
    
    if(!isValidMobileNo(phone)){
        return  res.status(400).send({status: false,message:"Enter valid Phone number "})}

    let uniquePhone = await userModel.findOne({phone:phone})
    if(uniquePhone)
    {return  res.status(400).send({status: false,message:"Phone number is already exists "})}

    if(!email){
        return res.status(400).send({status:false,message:"email is required"})
    }
    if(!isValidEmail(email)){return  res.status(400).send({status: false,message:"please enter valid email"})}
   let emailUnique = await userModel.findOne({email:email})
   if(emailUnique){
        return res.status(400).send({status:false,message:"email already exists"})
   }

   if(!password){
    return res.status(400).send({status:false,message:"password is required"})
   }
    if(!isValidPassword(password)){
        return  res.status(400).send({status: false,message:"Password should be minLen 8, maxLen 15 long and must contain one of 0-9,A-Z,a-z & special char"})
    }

    let createUserData =  await userModel.create(data)
    return res.status(201).send({status: true, message: 'Success',data:createUserData})
}
catch(err){
   return res.status(500).send({status: false,message:err.message})
}
}

//============================================ USER LOGIN ==================================================///

const userLogin = async function(req, res) {
    try {
      const { email, password } = req.body;
      if (Object.keys(req.body).length == 0)
        return res.status(400).send({ status: false, message: "Enter Login Credentials." });
  
      if (!email) return res.status(400).send({ status: false, msg: "Email Required." });
  
      if (!password) return res.status(400).send({ status: false, msg: "Password Required." });
  
      if (!isValidEmail(email))
        return res.status(400).send({ status: false, msg: " Email-Id is invalid"});
      if (!isValidPassword(password))
        return res.status(400).send({ status: false, essage: "Password should be minLen 8, maxLen 15 long and must contain one of 0-9,A-Z,a-z & special char", });
      let user = await userModel.findOne({ email: email, password: password }).select({ _id: 1 });
      if (!user)
        return res.status(400).send({ status: false, message: " Incorrect Email or Password !!!" });
       // const payload = { userId: user._id, iat: Math.floor(Date.now() / 1000) };

        let token = jwt.sign({userId: user._id, iat: Math.floor(Date.now() / 1000)}, "group21",{ expiresIn:"10h"});
        res.setHeader("x-api-token", token);
        return res.status(200).send({ status: true, message: "Success", token: token});//, exp: payload.exp, 
      }
       catch (err) {   
        return res.status(500).send({ status: false, message:err.message });
      }
    }

module.exports = {createUsers,userLogin}




