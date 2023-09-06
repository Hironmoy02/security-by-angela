//jshint esversion:6
import dotenv from 'dotenv';
dotenv.config();

import express from "express"
import ejs from "ejs";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";




const app=express();



app.use(express.static("public"));
app.set ("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb+srv://hironmoychowdhury69:Hironmoy123@cluster0.xcwjm9t.mongodb.net/",{useNewUrlParser:true});

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});


userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

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
    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    });
    try {
        await newUser.save();
        res.render("secrets");
      } catch (error) {
        console.error("An error occurred while saving the user: " + error.message);
        res.status(500).send("Error occurred while saving the user.");
      }
});

app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try{
        const foundUser=await User.findOne({email:username});
        if (foundUser) {
            console.log("User found in the database.");
        if(foundUser&&foundUser.password===password){
            console.log("success");
            res.render("secrets");
        }else{
            console.log("failed");
            res.send("invalid username or password");
        } 
            res.send("Invalid username or password.");
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