
import { Router  } from "express";
import { Contenedor } from "../class/contenedor.js";
const productsRouter = Router();
import * as url from 'url'
import path from "path";
import { logger } from "../logs/logger.js";


const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const contenedor = new Contenedor(path.join(__dirname,"../jsons/productos.json"));

productsRouter.get("/",async(req,res)=>{
    let products = await contenedor.getAll();
    res.send(products);

})
productsRouter.get("/:id",async(req,res)=>{
    
    
    //const products =  await contenedor.getAll();
    
    const  id = parseInt(req.params.id);
    
//     const index = products.findIndex(e=>e.id==id);
//    if(index==-1){
//     res.send({ error : 'producto no encontrado' })
//    }else{
    
    const product = await contenedor.getById(id)
    if(product.error){
        logger.error(product.error)
        res.send(product);
    }else{
    res.send(product);
    }
})
productsRouter.post("/",async(req,res)=>{
   
    const newProduct = req.body;
    
    let newProductParse = parseProduct(newProduct);

    if(isComplete(newProductParse) && typesValidation(newProductParse)){
    
    //console.log(newProductParse);
    newProductParse.price = parseFloat( newProductParse.price)
    const id = await contenedor.save(newProductParse);
    //console.log(product);
    //res.send(product);
    res.redirect('/products')
  
}else{res.redirect('/products')
    logger.error(`error en api Products ruta : ${req.path}, peticion : ${req.method}`)
}

})
productsRouter.put("/:id",async(req,res)=>{
   
    const putProduct = req.body;
    const  id = parseInt(req.params.id);
    let putProductParse = parseProduct(putProduct);
    const product = await contenedor.getById(id);
    if(product[0] == undefined){res.send({ error : 'producto no encontrado' })
    logger.error(`error en api Products ruta : ${req.path}, peticion : ${req.method}`)    
}else{
        
        //let CompletePutProduct = CompleteProduct(putProductParse,product);
        contenedor.putById(id,putProductParse);
        res.send("producto actualizado");


    }})
productsRouter.delete("/:id",async(req,res)=>{
   

    const  id = parseInt(req.params.id);
    const product = await contenedor.getById(id);
    console.log(product);
    if(product[0] == undefined){res.send({ error : 'producto no encontrado' })  
    logger.error(`error en api Products ruta : ${req.path}, peticion : ${req.method}`)    
}else{
        contenedor.deleteById(id);
        res.send("producto eliminado");
    }

    
    



})
function parseProduct(newProduct){
    let parseProduct = {};
    parseProduct.title = newProduct.title;
    parseProduct.price = newProduct.price;
    parseProduct.thumbnail = newProduct.thumbnail;
    
    return parseProduct;
}
 function isComplete(product){
    if(product.title == undefined){return false}
    if(product.price == undefined){return false}
    if(product.thumbnail == undefined){return false}
    return true;

}
function CompleteProduct(putProduct,Product){
    if(putProduct.title == undefined){putProduct.title = Product.title}
    if(putProduct.price == undefined){putProduct.price = Product.price}
    if(putProduct.thumbnail == undefined){putProduct.thumbnail = Product.thumbnail}
    return putProduct;

}

function typesValidation(product){
    if(product.title == ""){logger.error("El campo title esta vacio ") ;return false;  }
   let price =   Number.parseFloat(product.price)
    if(isNaN(price)){return false}else{product.price = price.toFixed(2)} 
    if(product.thumbnail == ""){logger.error("El campo thumbnail esta vacio ");return false}
    return true;


}


export { productsRouter }