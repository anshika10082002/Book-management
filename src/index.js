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

app.listen(process.env.PORT || 3000 ,function(){
    console.log("express app is running on this port "+ (process.env.PORT || 3000))
})