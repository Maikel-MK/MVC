//los modelos los defino en plural
const mongoose = require('mongoose')

//conexion a la bd

//definir el esquema para USUARIOS
const usuarioSchema = new mongoose.Schema({
    nombre: String
})

//configurar la respuesta del usuario en el schema

usuarioSchema.set('toJSON',{
    transform: (document,returnObject)=>{
        returnObject.id = returnObject._id.toString()
        delete returnObject._id
    }
})

//seleccionar un nombre para registrar el modelo 
const User = mongoose.model('User',usuarioSchema)

//se exporta como modulo
module.exports = User