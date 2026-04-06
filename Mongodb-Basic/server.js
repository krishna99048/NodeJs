const express = require("express");
const app = express();
const userModel = require("./model/user.model");

app.use(express.json())
app.use(express.urlencoded({extended: true}));


app.set("view engine", 'ejs')


app.get("/",(req, res)=>{

     res.send("Server HomePage")

})

// CRUD
// Create
app.get("/create", async(req, res) => {
   let createdUser = await userModel.create({
        username: 'test3',
        name: 'test3 user',
        email: "test3@gmail.com"

   });
res.send(createdUser);
});

// Read
app.get('/all' , async (req , res)=>{
    // All user
    let allUsers = await userModel.find();
    res.send(allUsers);
});
 //specific user - first only
app.get('/read' , async (req , res)=>{
    let user = await userModel.findOne({username : "test1"});
    res.send(user);
});

//all user based on query
app.get('/users' , async (req , res)=>{
    let userData = await userModel.find({username : "test1"});
    res.send(userData);
});

// Update
app.get('/update' , async (req , res)=>{
    let updatedUser = await userModel.findOneAndUpdate(
        {username:'test1'} , //find query
        {username : 'Coder' , email:'coder@devloper.com'} , //update query
        { new : true}
    );
        res.send(updatedUser);
})

// Delete
app.get("/delete" , async (req ,res)=>{
    await userModel.findOneAndDelete({username:"Coder"});
    res.redirect('/all');
});



app.listen(3000,()=>{
    console.log("Server is running on port: 3000")
})

