const express= require("express")
const mongoose= require("mongoose")
const bodyParser= require("body-Parser")
const route= require("./route/route.js")

const app= express()
app.use(bodyParser.json())

mongoose.connect("mongodb+srv://vishal0102:vishal0102@cluster0.9uryho2.mongodb.net/Bookmanagement",{
    useNewUrlParser:true
})
.then(()=>console.log("mongodb is connected"))
.catch(err => console.log(err))

app.use("/",route)

app.use(function (req, res) {
    var err = new Error("Not Found.");
    err.status = 404;
    return res.status(404).send({ status:false, message: "Path not Found"});
  });

app.listen(process.env.PORT || 3000 ,function(){
    console.log("express app is running on this port "+ (process.env.PORT || 3000))
})