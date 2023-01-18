import { Router } from "express";


import passport from "../passport/passport.js";

const checkSession = (req,res,next)=>{
    if(req.session.user){
        res.redirect("/profile");
    } else{
        next();
    }
}

const lsRouter = Router()

lsRouter.get("/login",checkSession,(req,res)=>{
 
    const errorMessage = req.session.messages ? req.session.messages[0]: ''
    res.render("login",{error:errorMessage})
    req.session.messages = []

})

lsRouter.post("/login",passport.authenticate("loginStrategy",{
                      
    failureRedirect : "/login",
    failureMessage : true,

}),(req,res)=>{
    
    req.session.user = {email : req.body.email};      
    res.redirect("/profile")
});
lsRouter.get("/signup",checkSession,(req,res)=>{  
   
const errorMessage = req.session.messages ? req.session.messages[0]: ''    
res.render("signup",{error:errorMessage})
req.session.messages = []

})
lsRouter.post("/signup",passport.authenticate("signupStrategy",{
    failureRedirect : "/signup",
    failureMessage : true,

}),(req,res)=>{
 
    req.session.user = {email : req.body.email};   
    res.redirect("/profile")
});

lsRouter.get("/profile",(req,res)=>{
 
    if(req.session.user){
            console.log(req.session)
             res.render("profile",{user:req.session.user.email});
             console.log(req.session.user)
         } else{
           res.redirect("/login")
         }
})
lsRouter.get("/logout",(req,res)=>{
    
    req.session.destroy();
    res.redirect("/login")
});






export default lsRouter;

