const TaskRouter = require('express').Router();
const Task = require('../models/tareas');

// Crear una nueva tarea
TaskRouter.post('/', async (request, response) => {
    const { texto, nombre } = request.body;

    if (!texto) {
        return response.status(400).json({ error: 'El campo de texto está vacío' });
    }

    try {
        const nuevaTarea = new Task({ texto, nombre });
        await nuevaTarea.save();
        return response.status(201).json({ msg: 'Se ha creado una nueva tarea', tarea: nuevaTarea });
    } catch (error) {
        console.error('Error al guardar la tarea:', error);
        return response.status(500).json({ error: 'Error al guardar la tarea en la base de datos' });
    }
});

// Obtener la lista de tareas
TaskRouter.get('/lista-Tasks', async (req, res) => {
    try {
        const listado = await Task.find();
        return res.status(200).json(listado);
    } catch (error) {
        console.error('Error al obtener la lista de tareas:', error);
        return res.status(500).json({ error: 'Ha ocurrido un error al obtener la lista de tareas' });
    }
});

// Eliminar una tarea por ID
TaskRouter.delete('/eliminar/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const resultado = await Task.findByIdAndDelete(id);

        if (resultado) {
            return res.status(200).json({ msg: `Se eliminó la tarea con id ${id}` });
        } else {
            return res.status(404).json({ error: 'No se encontró la tarea' });
        }
    } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        return res.status(500).json({ error: 'Ha ocurrido un error al eliminar la tarea' });
    }
});

// Ruta para actualizar el estado de una tarea
TaskRouter.patch('/:id', async (req, res) => {
   try {
       const { id } = req.params;
       const { checked } = req.body;

       const tareaActualizada = await Task.findByIdAndUpdate(
           id,
           { checked },
           { new: true } // Devuelve el documento actualizado
       );

       if (!tareaActualizada) {
           return res.status(404).json({ error: 'Tarea no encontrada' });
       }

       return res.status(200).json(tareaActualizada);
   } catch (error) {
       console.error('Error al actualizar la tarea:', error);
       return res.status(500).json({ error: 'Error al actualizar la tarea' });
   }
});


module.exports = TaskRouter;