//create a express server 

//package.json ==> type => module ==>import
//package.json ==> type =commonjs ==> const , require

const expess = require("express");
const path = require("path");
const app = expess();


//Middleware ===> Middleware runs before route, call before function
//usecase : Authorization, Aunthentication, Validation  , Error

//user req ----> server
//server route ---> user
// with Middleware :
//user req --> middleware(server) --> server route
app.use(function(req , res , next){
    console.log("Middleware is running");
    next();
});

//login req --> middleware (check user into database) -->server route (profile)

// create a route
app.get("/" , function(req , res){
    res.send("Welcome To Express JS 😎")
})

app.get('/profile' , function(req , res){
    res.send("Show Profile 🧾");
})

app.get("/login", function(req, res){
    const dirPath = path.resolve();
    const filePath = path.join(dirPath, 'Pages', 'login.html');
res.sendFile(filePath);
});

//error handling
//last listed route 
// always write after all routes because it will catch all the errors that are not handled by the previous routes

app.use(function(req , res){
    res.status(404).send("Page Not Found 🚫");
    res.status(500).send("Something Wrong 😑");
})

app.get('/signup' , function(req , res){
    res.send("Sing Up Page ");
})

app.listen(3008 , ()=>{
    console.log("✅ Server is running");
})