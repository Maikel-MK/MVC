const formC = document.querySelector('#form-create')
const formL = document.querySelector('#form-login')
const createInput = document.querySelector('#create-input')
const notificacion = document.querySelector('.notification')
const loginInput = document.querySelector('#login-input')

// Función para mostrar notificaciones
function showNotification(message = false) {
    notificacion.innerHTML = message
    notificacion.classList.add('show-notification')

    setTimeout(() => {
        notificacion.classList.remove('show-notification')
    }, 2000)
}

// Registrar un nuevo usuario
formC.addEventListener('submit', async (e) => {
    e.preventDefault()

    console.log("Formulario de creación enviado") 

    try {
        // Validar si el campo está vacío
        if (!createInput.value) {
            console.log("Campo vacío detectado") 
            showNotification("El Campo no Puede Estar Vacio", true)
            return
        }

        console.log("Obteniendo lista de usuarios desde el backend...") 

        // Obtener la lista de usuarios
        const usersResponse = await axios.get('/api/users/lista-users')
        console.log("Respuesta del backend recibida:", usersResponse) 

        const users = usersResponse.data.data // Accede a la propiedad "data" del objeto
        console.log("Lista de usuarios:", users) 

        // Validar si el usuario ya existe
        const userExists = users.some(user => user.nombre === createInput.value)
        console.log("¿El usuario ya existe?", userExists) 

        if (userExists) {
            console.log("Usuario ya existe en la base de datos") 
            showNotification("El usuario ya existe", true)
            return
        }

        console.log("Creando nuevo usuario...") 

        // Crear un nuevo usuario
        const newUser = { nombre: createInput.value }
        const response = await axios.post('/api/users', newUser)
        console.log("Respuesta del backend al crear usuario:", response) 

        // Mostrar notificación de éxito
        showNotification(`El usuario ${createInput.value} se ha creado satisfactoriamente`)

        // Limpiar el campo de entrada
        createInput.value = ""
        console.log("Campo de entrada limpiado") 
    } catch (error) {
        console.error('Error en el bloque catch:', error) 
        showNotification("Ha ocurrido un error al crear el usuario", true)
    }
})

// Iniciar sesión
formL.addEventListener('submit', async (e) => {
    e.preventDefault()

    console.log("Formulario de inicio de sesión enviado") 

    try {
        console.log("Obteniendo lista de usuarios desde el backend...") 

        // Obtener la lista de usuarios
        const usersResponse = await axios.get('/api/users/lista-users')
        console.log("Respuesta del backend recibida:", usersResponse) 

        // Accede al array de usuarios dentro de la propiedad "data"
        const users = usersResponse.data.data // Asegúrate de que esto sea un array
        console.log("Lista de usuarios:", users) 

        // Validar si el usuario existe
        const user = users.find(user => user.nombre === loginInput.value)
        console.log("Usuario encontrado:", user) 

        if (!user) {
            console.log("El usuario no existe en la base de datos") 
            showNotification("El usuario no existe", true)
            return
        }

        console.log("Usuario encontrado, redirigiendo ") 

        // Guardar el usuario en localStorage y redirigir
        localStorage.setItem('usuario', JSON.stringify(user))
        window.location.href = '/tareas'
    } catch (error) {
        console.error('Error en el bloque catch:', error) 
        showNotification("Ha ocurrido un error al iniciar sesión", true)
    }
})