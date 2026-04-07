const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/user-card");

let userSchema = mongoose.Schema({

    fullname: String,
    username: String,
    email: String,
    image: String,
},
    {timestamp : true},
);

module.exports = mongoose.model("Usercard" , userSchema);