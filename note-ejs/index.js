// ejs --> light weight template engine for nodejs
// ejs --> you can write dynamic html with help of ejs

const { error } = require('console');
const express = require('express');
const app = express();
const fs = require("fs")


// if you want to read frontend data  then you have to must add below two lines:

app.use(express.json()); // 1) it reads data from body(read all json type data)

app.use(express.urlencoded({extended: true})); // 2) read form data only


//setup ejs
app.set('view engine', 'ejs')
//if you want to use ejs engine that create view folder

//--------------------------Task file generater----------------------------------


app.get('/', (req, res) =>{
    fs.readdir('./tasks', (e, files) => {
        if(e) throw error;
        res.render("index", {data: files});    
    });
});



//if method is post will get data in res.body
//if method is get will get data in res.param

//create file (use post)
app.post('/create', (req, res)=>{
    // console.log(req);
    // res.send(req.body);

    let data =`Title: ${req.body.title}\nDetails: ${req.body.details}`;

    //create a file 
    fs.writeFile(`./tasks/${req.body.title.split(" ").join("-")}.txt`, data,(e)=>{
        if(e) throw error;
    })
    res.redirect("/")
})


//open file
app.get("/open/:filename", (req, res)=>{
    fs.readFile(`./tasks/${req.params.filename}`, (e, data)=>{
        if(e) throw error;
        res.render('file', { data: data })
    });
    
})

//edit file
app.get("/edit/:filename", (req, res)=>{
    let oldname = req.params.filename;
    res.render("edit", {oldname})
})

app.post("/rename", (req, res)=>{
    fs.rename(`./tasks/${req.body.old}`, `./tasks/${req.body.new}.txt`, (e) =>{
        if(e) throw error;
    })
    res.redirect("/")
})


app.listen(3000,()=>{
    console.log("server is running on port 3000")
})