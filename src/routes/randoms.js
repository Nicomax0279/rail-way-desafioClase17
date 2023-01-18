import  {  Router } from "express";
import {fork} from "child_process"
import {fileURLToPath} from "url";
import path, { dirname } from "path";
import { logger } from "../logs/logger.js";

const child = true

const randomRouter = Router();

const __dirname = dirname(fileURLToPath(import.meta.url)); 
let ready = false
 let childFile = path.join(__dirname,"../child/child.js")
randomRouter.get("/",(req,res)=>{

    let cant = req.query.cant
    //let numeros = generarNumeros(cant)
   if(child){
    let child = fork(childFile);
    logger.info("/api/randoms en modo child")
    child.on("message",(childMessage)=>{
        if(childMessage == "listo"){
            child.send(["generarNumeros",cant])
            ready = true;
        }else{
            res.send(childMessage)
           // const num = childMessage
        }
       // console.log(childMessage)

    })
}else{
    logger.info("/api/randoms en modo noChild")
    const num = generarNumeros(cant)
    res.send(num)

}
    
    //res.send(numeros)
})
function generarNumeros(cant){
    const numeros = [];
    const resultado = {};

    for (let index = 0; index <cant; index++) {
        const numeroAleatorio = parseInt(Math.random()*1000+1);
        //numeros.push(numeroAleatorio);
        if(resultado[numeroAleatorio]){
            resultado[numeroAleatorio]++;
        }else{
            resultado[numeroAleatorio]=1;
        }
    }
    
    
    
    return resultado;
    
    }
export default randomRouter