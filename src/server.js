import express from "express";
import session from "express-session";
import handlebars from "express-handlebars";
import { dirname } from "path";
import {fileURLToPath} from "url";
import passport from "./passport/passport.js";

import mongoose from "mongoose";
import MongoStore from "connect-mongo";

import * as dotenv from 'dotenv';
import  parsedArgs  from "minimist";
//routes
import infoRouter from "./routes/info.js";
import randomRouter from "./routes/randoms.js";
import lsRouter from "./routes/loginSys.js";
import chatRouter from "./routes/chat.js";
import { productsRouter } from "./routes/products.js";

import cluster from "cluster";
import os from 'os';

import  {logger}  from "./logs/logger.js";

dotenv.config({
    path : ".env"
})
const options = { 
    default : {p: 8080 , m: "FORK"},
    alias : { p : "port" , m : "mode"}
}
const argvs = parsedArgs(process.argv.slice(2),options)
//const PORT = argvs.port
const PORT = env.PORT
const MODE = argvs.mode



const mongoUrl = process.env.BASE_DE_DATOS;
const __dirname = dirname(fileURLToPath(import.meta.url)); 
//const mongoUrl = "mongodb+srv://sena:O03MJX1izzXMRkCk@backend.xun4hgo.mongodb.net/sessionsDB?retryWrites=true&w=majority"
mongoose.set("strictQuery", false);
mongoose.connect(mongoUrl,{
    useNewUrlParser: true,
    useUnifiedTopology:true
},(error)=>{
    if(error) return console.log(`Hubo un error conectandose a la base ${error}`);
    //console.log("conexion a la base de datos de manera exitosa")
});

const app = express();




if(MODE === "CLUSTER" && cluster.isPrimary ){
    const cpus = os.cpus().length - 6
    for (let index = 0; index < cpus; index++) {
        cluster.fork()       
    }

    cluster.on('exit',(worker)=>{
        console.log(`El proceso ${worker.id} FALLO`)
        cluster.fork()
    })
}else{
    app.listen(PORT, ()=>console.log(`Server listening on port ${PORT} processID: ${process.pid}`));
}


app.use(express.static(__dirname+"/public"));
app.engine(".hbs",handlebars.engine({extname: '.hbs'}));
app.set("views", __dirname+"/views");
app.set("view engine", ".hbs");
app.use(express.json()); 
app.use(express.urlencoded({extended:true})); 

app.use(session({
    secret:"clave", 
    store : MongoStore.create({
        mongoUrl : mongoUrl
    }),
    cookie:{
        maxAge : 600000
    },
    resave:false,
    saveUninitialized:false,
    
}));



app.use(passport.initialize());
app.use(passport.session());

const infologger = (req,res,next)=>{
    logger.info(`ruta : ${req.path}, peticion : ${req.method}`)
        next();
    
}


app.get("/",(req,res)=>{
    res.redirect("/profile")
})

app.get("/products",(req,res)=>{
        logger.info(`ruta : ${req.path}, peticion : ${req.method}`)

    res.render("products")
})
app.use(infologger)
app.use("/",lsRouter)
app.use("/info",infoRouter)
app.use("/api/randoms",randomRouter)
app.use("/chat",chatRouter)
app.use("/api/products",productsRouter);

 app.get("*",(req,res)=>{
    logger.warn(`RUTA inexistentes  ruta : ${req.path}, peticion : ${req.method}`)
 })


 // node --prof-process ss.log > result_prof_nobloq.txt