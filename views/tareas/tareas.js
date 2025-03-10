const usuario = JSON.parse(localStorage.getItem('usuario'));
const formulario = document.querySelector('#form-todos');
const lista = document.querySelector('#todos-list');
const inputF = document.querySelector('#form-input');
const cerrarBTN = document.querySelector('#cerrar-btn');
const notificacion = document.querySelector('.notification');

// Redirigir si el usuario no ha iniciado sesión
if (!usuario) {
    window.location.href = '/';
}

// Función para mostrar notificaciones
function showNotification(message, isError = false) {
    notificacion.innerHTML = message;
    notificacion.classList.add('show-notification');
    notificacion.style.backgroundColor = isError ? '#ff4444' : '#00C851'; // Rojo para errores, verde para éxito
    setTimeout(() => {
        notificacion.classList.remove('show-notification');
    }, 2000);
}

// Obtener la lista de tareas del usuario
const obtenerLista = async () => {
    try {
        const response = await axios.get('/api/tasks/lista-Tasks');
        const list = response.data;
        const userlist = list.filter(task => task.nombre === usuario.nombre);

        // Limpiar la lista antes de agregar las tareas
        Limpiar();

        userlist.forEach(task => {
            const listado = document.createElement('li');
            listado.id = task.id;
            listado.className = 'todo-item';
            listado.innerHTML = `
                <button class="delete-btn">&#10006;</button>
                <p class="${task.checked ? 'check-todo' : ''}">${task.texto}</p>
                <button class="check-btn">&#10003;</button>
            `;
            lista.appendChild(listado);
        });
    } catch (error) {
        console.error('Error al obtener la lista de tareas:', error);
        showNotification('Error al obtener la lista de tareas', true);
    }
};

// Cargar la lista de tareas al iniciar
obtenerLista();

// Agregar una nueva tarea
formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const newTask = {
            texto: inputF.value,
            nombre: usuario.nombre
        };

        const response = await axios.post('/api/tasks', newTask);
        console.log(response.data);

        showNotification('La Tarea se ha Creado Satisfactoriamente');
        inputF.value = '';
        obtenerLista(); // Actualizar la lista después de agregar una tarea
    } catch (error) {
        console.error('Error al crear la tarea:', error);
        showNotification('Error al crear la tarea', true);
    }
});

// Manejar eventos en la lista de tareas
lista.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
        // Lógica para eliminar una tarea
        const id = e.target.parentElement.id;

        try {
            await axios.delete(`/api/tasks/eliminar/${id}`);
            e.target.parentElement.remove();
        } catch (error) {
            console.error('Error al eliminar la tarea:', error);
            showNotification('Error al eliminar la tarea', true);
        }
    } else if (e.target.classList.contains('check-btn')) {
        // Lógica para marcar/desmarcar una tarea
        const id = e.target.parentElement.id;
        const isChecked = e.target.previousElementSibling.classList.contains('check-todo');

        try {
            // Enviar solicitud al backend para actualizar el estado de "checked"
            const response = await axios.patch(`/api/tasks/${id}`, { checked: !isChecked });
            console.log(response)
            // Actualizar la UI
            e.target.previousElementSibling.classList.toggle('check-todo');
            console.log('Tarea actualizada:', response.data);
        } catch (error) {
            console.error('Error al actualizar la tarea:', error);
            showNotification('Error al actualizar la tarea', true);
        }
    }
});

// Cerrar sesión
cerrarBTN.addEventListener('click', () => {
    localStorage.removeItem('usuario');
    window.location.href = '/';
});

// Limpiar la lista de tareas
function Limpiar() {
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }
}