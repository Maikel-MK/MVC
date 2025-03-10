const mongoose = require('mongoose')

//conexion a la bd

//definir el esquema para tareas
const tareaSchema = new mongoose.Schema({
    nombre: String,
    texto: String,
    checked: Boolean
})

//configurar la respuesta de la tarea en el schema

tareaSchema.set('toJSON',{
    transform: (document,returnObject)=>{
        returnObject.id = returnObject._id.toString()
        delete returnObject._id
    }
})

//seleccionar un nombre para registrar el modelo 
const Task = mongoose.model('Task',tareaSchema)

//se exporta como modulo
module.exports = Task