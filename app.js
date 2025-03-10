require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
//const port = process.env.PORT || 3000 es para crear el puerto pero lo haremos de otra forma
const userRouter = require('./controllers/usuario')
const TaskRouter = require('./controllers/tarea')
const mongoose = require('mongoose')
//conexion mongoDB
try{
   mongoose.connect(process.env.MONGO_URI)
   console.log('ya estas conectado a la BD')
}catch(error){
    console.log(error)
}

//crear rutas de forntEnd Localhost
app.use('/',express.static(path.resolve('views','home')))
app.use('/tareas',express.static(path.resolve('views','tareas')))

//por cada ventana que se crea se debe actualizar el servidor y todas las carpetas deben tener su index por defecto


//IMPORTANTE
app.use(express.json())

//crear rutas de backend
app.use('/api/users',userRouter)
app.use('/api/tasks',TaskRouter)


module.exports = app