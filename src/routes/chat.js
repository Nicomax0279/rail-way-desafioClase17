import { Router } from "express";
import { Contenedor } from "../class/contenedor.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


const chatRouter = Router()
const menssages = new Contenedor(path.join(__dirname,"../jsons/menssages.json"))



chatRouter.get("/",async(req,res)=>{
 
    if(req.session.user){
        const chat = await menssages.getAll()
       // console.log(chat)
    res.render("chat",{chat:chat,
    name : 'dsad'})
     } else{
       res.redirect("/login")
     }
   
})

chatRouter.post("/",async(req,res)=>{
    const menssage = req.body;

    const date = new Date()

    menssage.date = date.toLocaleString();
    menssage.username = req.session.user.email
        await menssages.save(menssage);
       // console.log(menssage)
       
     res.redirect("/chat")
})







export default chatRouter