//por cada modelo se hace un controlador & se coloca el nobre en singular
//1. hacer el router
//router: POST, GET, DELETE, UPDATE --- http

const userRouter = require('express').Router();
const User = require('../models/usuarios');

// Registrar un nuevo usuario
userRouter.post('/', async (request, response) => {
    const { nombre } = request.body;

    if (!nombre) {
        return response.status(400).json({ error: 'Todos los campos son OBLIGATORIOS' });
    }

    try {
        const usuario = new User({ nombre });
        await usuario.save();
        const listUsuarios = await User.find();
        console.log(listUsuarios);
        return response.status(200).json({ msg: 'Se ha creado el nuevo Usuario', data: usuario });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Error al guardar el usuario en la base de datos' });
    }
});


// Obtener lista de usuarios
userRouter.get('/lista-users', async (req, res) => {
    try {
        const listado = await User.find();
        return res.status(200).json({ success: true, data: listado });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Ha ocurrido un error al obtener la lista de usuarios' });
    }
});


module.exports = userRouter;