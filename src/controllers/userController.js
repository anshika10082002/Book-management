const userModel = require('../models/userModel')

const { valid,
    regForName,
    regForPassword,
    regForFullName,
    regForLink,
    regForExtension,
    regForEmail,
    regForMobileNo,} = require('../validations/validation')
// console.log(userModel.schema.obj.title.enum)

const creatUser = async (req,res)=>{
 try{  
    let {title,phone,name,email,password,address,pincode} = req.body

    if(Object.keys(req.body).length == 0){return  res.status(400).send({status: false,message:"All feild is madatory"})}

    let titles = userModel.schema.obj.title.enum
    if(!titles.includes(title)){return  res.status(400).send({status: false,message:"Enter valid title 'Mr'/'Mrs'/ 'Miss'  "})}


    if(!regForMobileNo(phone)){return  res.status(400).send({status: false,message:"Enter valid Phone number "})}
    let PhonuniqueORnot = await userModel.findOne({phone:phone})
    if(PhonuniqueORnot){return  res.status(400).send({status: false,message:"Phone number is already exist "})}

    if(!regForName(name)){return  res.status(400).send({status: false,message:"Please Enter valid name"})}

    let EmailuniqueORnot = await userModel.findOne({phone:phone})
    if(!regForEmail(email)){return  res.status(400).send({status: false,message:"Please Enter valid Email"})}

    if(!regForPassword(password)){return  res.status(400).send({status: false,message:"Please Enter valid Password"})}




    // let creatUserData = userModel.create()
    console.log('creatUserData')
    res.status(201).send({status: true,message: 'Success',data:'creatUserData'})
}catch(err){
    res.status(500).send({status: false,message:err.message})
}
}

module.exports = {creatUser}