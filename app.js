//jshint esversion:6
import dotenv from 'dotenv';
dotenv.config();

import express from "express"
import ejs from "ejs";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";






const app=express();



app.use(express.static("public"));
app.set ("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
    secret:"little secret",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://hironmoychowdhury69:Hironmoy123@cluster0.xcwjm9t.mongodb.net/",{useNewUrlParser:true});

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});

userSchema.plugin(passportLocalMongoose);


const User=new mongoose.model("User",userSchema)
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/",(req,res)=>{
    res.render("home");
})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.get("/register",(req,res)=>{
    res.render("register");
});

app.get("/secrets",function(req,res){
if(req.isAuthenticated()){
    res.render("secrets");
}else{
    res.redirect("/login");
}
});

app.post("/register", async (req, res) => {
    User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            console.error(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            });
        }
    });
});

app.post("/login", async (req, res) => {
    const user=new User({
        username:req.body.username,
        password:req.body.password
    });
req.login(user,function(err){
    if(err){
        console.log(err);
    }else{
        passport.authenticate("local")(req,res,function(){
            res.redirect("/secrets");
        })
    }
})
});

app.get("/logout", function (req, res) {
    req.logout(function (err) {
        if (err) {
            console.error(err);
        }
        res.redirect("/");
    });
});



app.listen(3000,()=>{
console.log("server started on port 3000")
});