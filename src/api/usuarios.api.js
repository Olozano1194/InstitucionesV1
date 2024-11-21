const APIUSUARIO = axios.create({
    baseURL: 'https://api-instituciones.vercel.app/api/usuarios',
    //baseURL: 'http://localhost:5000/api/usuarios',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
});


const baseURLUser = window.location.origin;

//aca es para que pueda crear una usuario
const formularioCrearUsuario = document.getElementById('formularios');
if (formularioCrearUsuario) {
     //Metodo crear usuarios
    formularioCrearUsuario.addEventListener('submit', async (e) => {
        e.preventDefault();

        //capturamos los valores de los input y selects
        const datos = {
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            email: document.getElementById('email').value,
            rol: document.getElementById('rol').value,
            password: document.getElementById('contraseña').value           

        }
        
        try {
            // Crear usuario
            const resultado = await crearUsuario(datos);
            console.log('Resultado de la creación', resultado);
                
            mostrarMensaje('Usuario creado con exito', 'text-green-500');

            const url = `${baseURLUser}/src/pages/admin/listarUsuarios.html`;
            window.location.href = url;
            
        } catch (err) {
            console.error('Error al procesar la solicitud:', err);
            mostrarMensaje('Error al procesar la solicitud', 'text-red-500');
            
        }
    });
    
}

//Crear Usuarios
const crearUsuario = async (datos) => {
    try {
        //Hacer la solicitud POST a la API
        const respuesta = await APIUSUARIO.post('/', datos);
        console.log('Usuario creado', respuesta.data);
        mostrarMensaje('Usuario creado exitosamente', 'text-green-500');
    
        //limpiar el formulario
        formulario.reset();
        
        await obtenerCantidadUsuarios();
     
    } catch (err) {
        //console.error('Error al guardar los datos', err);
    
        //Mostrar mensaje de error
        //console.error('Error al crear el usuario:', err.response ? err.response.data : err.message);
        mostrarMensaje('Error al crear el usuario. Por favor, intente de nuevo.', 'text-red-500');
        } 

}

//Listar Usuarios
const ListarUsuarios = async () => {
    const tbody = document.querySelector('#usuariosTable tbody');

    //Verificamos si existe el tbody antes de proceder
    if (!tbody) {
        console.error('No se encontró el elemento #usuariosTable');
        return; //si no existe, salimos de la función para evitar errores
        
    }
    
    //Limpiamos el contenido actual de la tabla
    tbody.innerHTML = '';

    //Hacemos la petición get
    APIUSUARIO.get('/').then(respuesta => {
        //Recorremos la respuesta y creamos filas para la tabla
        const usuarios = respuesta.data;

        usuarios.forEach((usuario, index) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td class='border-b-2 border-slate-700 px-4 py-2 text-center'>${index+1}</td>
                <td class='border-b-2 border-slate-700 px-4 py-2 text-center max-w-xs'>${usuario.nombre}</td>
                <td class='border-b-2 border-slate-700 px-4 py-2 text-center max-w-xs'>${usuario.apellido}</td>
                <td class='border-b-2 border-slate-700 px-4 py-2 text-center'>${usuario.email}</td>
                <td class='border-b-2 border-slate-700 px-4 py-1 text-center'>${usuario.rol}</td>
                
                <td class='border-b-2 border-slate-700 px-4 py-2 text-center'>
                <button class="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-md" onclick="editarUsuario('${usuario._id}')">Editar</button>
                </td>

                <td class='border-b-2 border-slate-700 px-4 py-2 text-center'>
                <button class="bg-red-500 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-md" onclick="eliminarUsuario('${usuario._id}')">Eliminar</button>
                </td>
                           
            `;
            
            tbody.appendChild(fila);

        });
    }).catch(err => {
        console.error('No se pudo listar los Usuarios', err);
    });
        
};
//Llamamos al metodo ListarInstituciones
ListarUsuarios();

//aca empieza la condición para que se pueda actualizar el formulario
const formularioActualizarUsuario = document.querySelector('.updateFormUser');
if (formularioActualizarUsuario) {
    formularioActualizarUsuario.addEventListener('submit', async (e) => {
    e.preventDefault();

    //capturamos los valores de los input y selects
    const datos = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        email: document.getElementById('email').value,
        rol: document.getElementById('rol').value,
        password: document.getElementById('contraseña').value       

        }

        const id = formularioActualizar.getAttribute('data-id');
        try {
            if (id) {
            console.log('Intentando actualizar usuario con ID:', id);
            // Actualizar usuario
            const resultadoActualizar = await actualizarUsuario(id, datos);
            console.log('Resultado de la actualizacion:', resultadoActualizar);
            mostrarMensaje('Usuario actualizado con exito', 'text-green-500');

            }else {
                console.error('No se encontro ID para el Usuario');
            }
            
            const url = `${baseURLUser}/src/pages/admin/listarUsuarios.html`
            window.location.href = url;
            
        } catch (err) {
            console.error('Error al procesar la solicitud:', err);
            mostrarMensaje('Error al procesar la solicitud', 'text-red-500');
            
        }
           
    });
    
}

//función para redirigir al archivo de actualización
const editarUsuario = (id) => {
    //redirigir a la pagina actualizacion
    const url = `${baseURLUser}/src/pages/auth/usuarios/actualizarUsuarios.html?id=${id}`;
    console.log('Redirigiendo:', url);
    
    window.location.href = url;
   
};

//Función para cargar los datos de la institución
const cargarDatosUsuario = async (id) => {
    try {
        //Hacemos la solicitud get para obtener los datos del usuario
        const response = await APIUSUARIO.get(`/${id}`);
        const usuario = response.data;
        
        

        //llenamos los campos
        document.getElementById('nombre').value = usuario.nombre;
        document.getElementById('apellido').value = usuario.apellido;
        document.getElementById('email').value = usuario.email;
        document.getElementById('rol').value = usuario.rol;
        document.getElementById('contraseña').value = usuario.password;
              
        //agregamos el id
        const formulario = document.querySelector('.updateFormUser');
        if (formulario) {
            formulario.setAttribute('data-id', id);
        }else {
            console.error('No se encontró el formulario');
        }
    }catch(err) {
        console.error('No se pudo cargar el usuario para editar', err);
        mostrarMensaje('Error al cargar los datos del usuario. Intente de nuevo.', 'text-red-500');
    }
};

//función para actualizar los datos de la institución
const actualizarUsuario = async (id, datos) => {
    
    try {
        //console.log('ID que se está enviando para actualización:', id);
        //console.log('Datos que se están enviando:', datos);
        //Hacemos la solicitud put para actualizar los datos de la institución
        const response = await APIUSUARIO.put(`/${id}`, datos);
        //console.log('Usuario actualizado', response.data);
        return response.data;
                   
    }catch(err) {
        //console.error('No se pudo actualizar el usuario', err);
        mostrarMensaje('Error al actualizar el usuario. Por favor, intente de nuevo.', 'text-red-500');
    }

};

//Eliminar Entidades
const eliminarUsuario = async (id) => {
    //Mostrar mensaje de confirmación
    const confirmación = confirm('¿Esta seguro de que deseas eliminar el usuario?');
    if (!confirmación) return; //Si el usuario cancela no se haría nada
    
    try {
        //Hacemos la petición delete
        const respuesta = APIUSUARIO.delete(`/${id}`);
            //Si la respuesta es exitosa, actualizamos la tabla
            await ListarUsuarios();     
            await obtenerCantidadUsuarios();      
        
    } catch(err) {
        //console.error('No se pudo eliminar el usuario', err);
        alert('No se pudo eliminar el usuario');
    };
    
   
}

//funcion para mostrar mensajes
function mostrarMensaje(mensaje, clase) {
    const formulario = document.querySelector('#formulario');
    if (!formulario) {
        console.error('No se encontró el formulario');
        return;
    }

    const mensajeExistente = formulario.querySelector('.mensaje-respuesta');
    if (mensajeExistente) {
        mensajeExistente.remove();        
    }
    const mensajeElemento = document.createElement('p');
    mensajeElemento.textContent = mensaje;
    mensajeElemento.className = `mensaje-respuesta ${clase} mt-4`;
    formulario.appendChild(mensajeElemento);
};

// ---------------------------------------- // ------------------------------------
//desde aca empieza lo de iniciar sesión
const login = async => {
    const loginForm = document.getElementById('login');

    if (!loginForm) {
        return;
    
    }else {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
        
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
        
            try {
                const respuesta = await APIUSUARIO.post('/login', { email, password });
        
                if (respuesta.data.token) {
                    //Si el login es exitoso almacenamos el token
                    localStorage.setItem('token', respuesta.data.token);
                    //console.log('Iniciaste sesión con éxito', respuesta.data);
        
                    window.location.href = `${baseURLUser}/src/pages/admin/home.html`;
                    
                }       
            } catch (err) {
                      
            }
        })
    }

}

// Ruta para obtener la cantidad de usuarios
const obtenerCantidadUsuarios = async () => {
    try {
        const respuesta = await APIUSUARIO.get('/');
        //console.log('Respuesta del backend:', respuesta.data);
        
        //Obtener la cantidad de instituciones
        const cantidadUsuario = respuesta.data.length;
        //console.log('Cantidad de entidades:', cantidadEntidades);

        //Actualizar el contenido del parrafo con el nuevo número de las intituciones
        const cantidadElementoUsuario = document.getElementById('numUsuarios');
        if (cantidadElementoUsuario) {
            cantidadElementoUsuario.textContent = cantidadUsuario;
            
        }
    }catch (error) {
        console.error('No se pudo obtener la cantidad de instituciones', error);
    }
};

document.addEventListener('DOMContentLoaded', obtenerCantidadUsuarios);

