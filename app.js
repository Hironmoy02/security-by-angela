//jshint esversion:6
import dotenv from 'dotenv';
dotenv.config();

import express from "express"
import ejs from "ejs";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
const saltRounds=8;





const app=express();



app.use(express.static("public"));
app.set ("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb+srv://hironmoychowdhury69:Hironmoy123@cluster0.xcwjm9t.mongodb.net/",{useNewUrlParser:true});

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});




const User=new mongoose.model("User",userSchema)


app.get("/",(req,res)=>{
    res.render("home");
})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.get("/register",(req,res)=>{
    res.render("register");
})

app.post("/register",async(req,res)=>{
    bcrypt.hash(req.body.password, saltRounds,async function(err, hash) {
   const newUser=new User({
        email:req.body.username,
        password:hash
    });
    try {
        await newUser.save();
        res.render("secrets");
      } catch (error) {
        console.error("An error occurred while saving the user: " + error.message);
        res.status(500).send("Error occurred while saving the user.");
      }
});
    
});

app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try{
        const foundUser=await User.findOne({email:username});
        if (foundUser) {
       bcrypt.compare(password, foundUser.password, function(err, result) {
    if(result===true){
        res.render("secrets");
    }
});
          }else {
            console.log("User not found.");
            res.send("Invalid username or password.");
    }
    
      }catch(error){
        console.error("an error occurred"+error.message);
        res.status(500).send("Error occurred while saving the user.");
    }

});


app.listen(3000,()=>{
console.log("server started on port 3000")
});