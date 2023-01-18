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






process.send("listo");

process.on("message",(mes)=>{
    //console.log(mes)
    if(mes[0]=== "generarNumeros"){
        const numeros = generarNumeros(parseInt(mes[1]))
        process.send(numeros)
    }
})