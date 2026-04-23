const mongoose = require("mongoose");
// const dbgr = require("debug");
// const config = require("config");

// console log method :

function connectToDB() {
    mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("MongoDB Connected!!");
    })
    .catch((err) => {
        console.log(err);
    })
}


// debugger method :

// function connectToDB() {
//     mongoose.connect(`${config.get("MongoDB_URL")}/ecommerce`)
//     .then(() => {
//         dbgr("MongoDB Connected!!");
//     })
//     .catch((err) => {
//         dbgr(err);
//     });
// }


module.exports = connectToDB;