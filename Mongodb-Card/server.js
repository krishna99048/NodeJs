const express = require("express");
const app = express();
const userModel = require("./models/user.model")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");
});


// Create Card
app.post("/create", async (req, res) => {
    let {fname, uname, email, img}= req.body; 
        await userModel.create({
        fullname: fname,
        username: uname,
        email: email,
        image: img
    });
    res.redirect("/card");
});


// read
app.get("/card", async (req, res) => {
    let allUsers = await userModel.find();
    res.render("card", { data: allUsers });
});


// delete
app.get("/delete/:id", async (req, res) => {
   await userModel.findOneAndDelete({ _id: req.params.id });
    res.redirect("/card");
});


// edit card
// 1) show old data -> show filled form
app.get("/show/:id", async (req, res) => {
    let user = await userModel.findOne({ _id: req.params.id });
    res.render("edit", { user })
});


// 2) set new data -> edit form and submit
app.post("/edit/:id", async (req, res) => {
    let { fname, uname, email, img } = req.body;
    await userModel.findOneAndUpdate(
        { _id: req.params.id }, 
        {   
            fullname: fname,
            username: uname,
            email,
            image: img
         }, 
        { new: true }
    );
    res.redirect("/card");
});


app.listen(3000, () => {
    console.log("Server is running 🏃‍♀️ on localhost:3000");
});