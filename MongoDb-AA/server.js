const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const userModel = require("./Model/user.model");
const bcrypt = require("bcrypt");
//server memory temporary --> server
// user ni req server pase jai tyare server ne user kon che a kbr hoti nathi mate direct req sathe user ne authorize karvo pade che 

// user req --> server (check image into folder)
//cookie parser ==> save token into browser storage


const cookieParser = require("cookie-parser")



app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use(cookieParser())

app.get("/",(req, res)=>{
    res.cookie("username", "test@user");
     res.send("Server HomePage");
})

//data --> convert jwt --> save cookie
app.get("/jwt",(req,res)=>{
    let data = {username: "test", email: "test@gmail.com", role: "admin"}

     let token = jwt.sign(data,"Ritika");
     console.log(token);
     
     res.cookie("token",token);
     res.send("Go to application and check your cookie section")

})

//Signup
app.get("/sign" , async (req , res)=>{
    let createuser = await userModel.create({
        username : "test_user",
        email : "test@user.com",
        password : "test123"
    });
    res.send(createuser);
});

//for encrypt your password use --> bcrypt package 
//use case:when your data leack your password is safe if you encrypt all user all user password
// encrypt password stages:
// your password + salt (default 10 char) => create a hash
// in database we save hash not password
app.get("/hash" , (req , res)=>{
    let password = "test@123"

    // bcrypt.hash("password" , "number" , (error,hash)=>{})
        bcrypt.hash(password , 8 ,(err , hash)=>{
            console.log(hash);
            res.send(hash);
        });
});

//Login -- password compare



app.listen(3000,()=>{
console.log("Server is running on port: 3000");

})