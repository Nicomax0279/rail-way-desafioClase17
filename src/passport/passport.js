import passport from "passport";
import {Strategy as LocalStrategy} from 'passport-local'
import {UserModel} from '../model/userModel.js'
import bcrypt from 'bcrypt'

passport.use("signupStrategy", new LocalStrategy(
    {
        passReqToCallback:true,
        usernameField: "email"
    },
    (req,email,password,done)=>{
        
        UserModel.findOne({email:email},async(error,userFound)=>{
            if(error) return done(error,null,{message:"Hubo un error"});
            if(userFound) return done(null,null,{message:"El usuario ya existe"});       
            const newUser={               
                email:email,
                password: await bcrypt.hash(password,5)
            };
            UserModel.create(newUser,(error,userCreated)=>{
                if(error) return done(error,null, {message:"Hubo un error al registrar el usuario"})
                return done(null,userCreated);
            })
        })
    }
));
passport.use("loginStrategy", new LocalStrategy(
    {
        passReqToCallback:true,
        usernameField: "email"
    },
    (req,email,password,done)=>{
        
      
        UserModel.findOne({email:email},async(error,userFound)=>{
            if(error) return done(error,null,{message:"Hubo un error"});
            if(userFound){ //return done(null,null,{message:"El usuario ya existe"});       
            //if(userFound.password === password){                   
            if(await bcrypt.compare(password,userFound.password)){                    return done(null,userFound);
                            } else{
                                return done(null,null,{message:"La contraseña es incorrecta"})
                            }
            }else{
                return done(null,null,{message:"el usuario es incorrecto"})
                
            }
        })
    }
));





passport.serializeUser((user,done)=>{
    done(null,user.id)
})
passport.deserializeUser((id,done)=>{

    UserModel.findById(id,(err,userFound)=>{
        if(err) return done(err)
        return done(null,userFound)
    })
})




export  default passport