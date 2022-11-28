const jwt= require("jsonwebtoken")

const authenticate= async function(req,res,next){
    try{
    let token= req.headers["x-api-token"]
    if(!token){
        return res.status(400).send({status:false, message:"token must be present"})
    }
    let decodeToken= jwt.verify(token,"group21")
    if(!decodeToken){
        return res.status(401).send({status:false,message:"invalid token"})
    }
    req.decodeToken= decodeToken
}
catch(error){
    return res.status(500).send({status:false, message:error.message})
}
next()
}


module.exports.authenticate=authenticate