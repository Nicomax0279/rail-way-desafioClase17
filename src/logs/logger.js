import log4js from "log4js";


//configuracion de log4js
log4js.configure({
    appenders:{
        //definir las salidas de datos
        consola:{type:"console"},
        archivoErrores: {type:"file", filename:"./src/logs/error.log"},
        archivoWarning: {type:"file", filename:"./src/logs/warn.log"},
        //salidas con niveles definidos
        loggerConsola: {type:"logLevelFilter", appender:'consola', level:'info'},
        loggerErrores: {type:"logLevelFilter", appender:'archivoErrores', level:'error'},
        loggerWarning: {type:"logLevelFilter", appender:'archivoWarning', level:'warn'},
    },
    categories:{
        default:{appenders:['loggerConsola','loggerErrores','loggerWarning'], level:'all'},
        //produccion:{appenders:['loggerErrores','loggerDebug'], level:'all'}
    }
});




   const  logger = log4js.getLogger()


export {logger};