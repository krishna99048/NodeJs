const autocannon = require("autocannon");
const url = "http://localhost:3000/";
const duration = "10";


const instance = autocannon({
    url,
    duration
    },

    (err , result)=>{
        if (err) {
            console.log("Server Test Failed", err);
        } else {
            console.log("Server Test Result ")
           console.log(result);
     }
    }
);

autocannon.track(instance);