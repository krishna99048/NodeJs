
// const fs = require ("node:fs");

// fs - file system
//create file
//fs.append file (path,data,callback fnc)
// fs.appendFile('hello.txt' , "Hello World !! ", (e)=>{
//     if(e) throw error;
//         console.log("create a hello.txt");
// });

// issue : every time you run the file that put new data with existing data so that print same data every time you run the file

//fs.writeFile(path , data , callback fnc)
//  fs.writeFile('hello.txt' , "Hello World !! ", (e)=>{
//     if(e) throw error;
//         console.log("create a hello.txt");
// });

//issue:when you change hello.txt file and after that you run the file that cmd will be replace whole file with above giveen data

//=======================================================================

//create a folder
//fs.mkdir(path,callback fnc)
// fs.mkdir('Pages',(e)=>{
//     if(e) throw error;
//     console.log("Create a new folder --  Pages");
// });

//create a nested folder
//fs.mkdir(path , {option} , callback fnc)
// fs.mkdir("CSS/Home/Style" ,{recursive:true} , (e)=>{
//     if(e) throw error;
//     console.log("create a nested folder of CSS");
// });

//=====================================================================================
//read file : used to read content of the file
//fs.readFile(path, fnc(e, data){})
// fs.readFile('hello.txt','utf-8',(e,data)=>{
//     if(e) throw error;
//     console.log(data);
// })


//read folder
//fs.readdir(path, fnc(e, files){})
// fs.readdir("CSS/Home", (e, files) => {
//     if(e) throw error;
//     console.log(files);
// });
// //as a response you get a araay of folder

//================================================================================

//copy file

//fs.copyFile("path with file name" , "path with new file name" , callback fnc)
// fs.copyFile("hello.txt" ,"CSS/Home/Style/copy.txt", (e) => {
//     if(e) throw error;
//     console.log("File copy successfully");
// });



// rename file
// fs.rename('old(exiting) file name with path','new file name with path',cb fnc)


// fs.rename('hello.txt','name.txt',(e)=>{
//     if (e) throw error;
//     console.log("rename File Succesfully");
// });

// // nest file rename and move

// fs.rename(oldPath, newPath, callback function(error))    
// fs.rename("CSS/Home/Style/copy.txt", "CSS/Home/Components/copy_rename.txt", (err) => {     
//     if (err) throw err;      
//     console.log("Nested file renamed successfully.")
// });


//rename folder
// fs.rename("CSS/Home/Style", "CSS/Home/Components", (e) => {
//     if (e) throw error;
//     console.log("rename successfully");
// });

//delete file
//fs.rm(filename with path, cb fnc)
// fs.rm('name.txt', (e) => {
//      if (e) throw error;
//      console.log("deleted file");
// });


//delete folder
// fs.rmdir("CSS" , {recursive:true , force:true}, (e)=>{
//     if (e) throw error;
//     console.log("Deleted folder");
// });

// fs.rmdir("index.js", (e)=>{
//     if (e) throw error;
//     console.log("Deleted folder");
// })

import chalk from "chalk";

console.log(chalk.blue("Write with chalk"));
console.log(chalk.bgWhite.redBright("Write with chalk"));
console.log(chalk.bgYellow.green.bold("Write with chalk"));
