const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("./models/user.model");
const postModel = require("./models/post.model");
const path1 = require("path");
const upload = require("./Config/multer");
const morgan = require("morgan");





const app = express();

app.use(express.json());
app.use(express.urlencoded({ express: true }));

app.use(cookieParser());
app.use(morgan("dev"));

app.use(express.static(path1.join(__dirname, "public")))


app.set("view engine", "ejs");



// front-end logic
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.get("/profile", auth, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email }).populate("posts");
    

    //  let name = crypto.randomBytes(6).toString('hex');
    //  console.log(name)



    res.render("profile", { user });
});

app.get("/post", (req, res) => {
    res.render("post");
});

app.get("/editprofile", auth, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    res.render("editprofile", { user });
});

// back-end logic + database
// signup user => create a new user
app.post("/create", (req, res) => {
    let { fullname, username, email, phone, image, password } = req.body;

    bcrypt.hash(password, 10, async (err, hash) => {
        try {
            await userModel.create({
                fullname,
                username,
                email,
                phone,
                password: hash,
                image
            });
        } catch (err) {
            console.log(err);
        }
    });
    res.redirect("/");
});

// login user => check email and password, redirect to profile page
app.post("/login", async (req, res) => {
    let user = await userModel.findOne({ email: req.body.email });

    if (!user) {
        res.send("Something Went Wrong - Email");
    } else {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (result) {
                let token = jwt.sign({ email: user.email }, "ritika");
                res.cookie("token", token);
                res.redirect("/profile");
            } else {
                res.send("Something Went Wrong");
            }
        });
    }
});

// logout user => remove token from cookie
app.get("/logout", (req, res) => {
    res.clearCookie();
    res.redirect("/");
});

// create post
app.post("/post", auth, upload.single("imgurl"),  async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    let { title, description } = req.body;

    console.log(req.file)

    let createdPost = await postModel.create({
        userId: user._id,
        title,
        description,
        imgurl: req.file.filename,
    });

    // add (push) posts into user data
    user.posts.push(createdPost);
    await user.save();
    res.redirect("/profile");

});

// edit profile
app.post("/edit" , auth , async (req , res)=>{
    let {fullname , username , email , phone , image} = req.body;

    await userModel.findOneAndUpdate(
        {email : req.user.email},
        {   fullname , 
            username ,
            email , 
            phone , 
            image, 

        },
        {new:true});

        res.redirect("/profile");
});

app.get("/delete/:id" , auth , async (req , res)=>{
    const user = await userModel.findOne({email : req.user.email});

    await postModel.findOneAndDelete({_id : req.params.id});

    let postNumber = user.posts.indexOf(req.params.id);

    user.posts.splice(postNumber , 1);

    await user.save();

    res.redirect("/profile");
})


//middleware functions
function auth (req, res, next){
    //console.log(req.cookies);
    let token = req.cookies.token;

    if(!token){
        res.send("Access Denied !!");
    }
    try {
        let verified = jwt.verify(token, "ritika");
         req.user = verified; // that sent into route(check)
        next();
    } catch (e) {
        console.log("Invalid Token")
    }

}



app.listen(3000, () => {
    console.log("Server is on localhost : 3000");
});