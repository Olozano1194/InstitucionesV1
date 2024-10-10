const API = axios.create({
    baseURL: 'https://api-instituciones.vercel.app/api/instituciones',
    headers: {
        'Content-Type': 'application/json',
      },

});

//aca es para que pueda crear una entidad
const formularioCrear = document.getElementById('formularios');
if (formularioCrear) {
     //Metodo crear entidades
    formularioCrear.addEventListener('submit', async (e) => {
        e.preventDefault();

        //capturamos los valores de los input y selects
        const datos = {
            nombre: document.getElementById('nombre').value,
            direccion: document.getElementById('direccion').value,
            telefono: document.getElementById('telefono').value,
            email: document.getElementById('email').value,
            director: document.getElementById('director').value,
            departamento: document.getElementById('departamento').value,
            capitales: document.getElementById('capitales').value,
            estado: document.getElementById('estado').value,
            secretaria: document.getElementById('secretaria').value,
            nosedes: document.getElementById('sedes').value

        }
        // console.log('Datos a enviar:', datos);
        // console.log('URL de la API:', API);

        try {
            // Crear entidad
            const resultado = await crearInstitucion(datos);
            console.log('Resultado de la creación', resultado);
                
            mostrarMensaje('Institución creada con exito', 'text-green-500');

            window.location.href = 'src/pages/admin/home.html';
            
        } catch (err) {
            console.error('Error al procesar la solicitud:', err);
            mostrarMensaje('Error al procesar la solicitud', 'text-red-500');
            
        }
    });
    
}

//Crear instituciones
const crearInstitucion = async (datos) => {
    try {
        //Hacer la solicitud POST a la API
        const respuesta = await API.post('/', datos);
        console.log('Institución creada', respuesta.data);
        mostrarMensaje('Institución creada exitosamente', 'text-green-500');
    
        //limpiar el formulario
        formulario.reset(); 
     
    } catch (err) {
        console.error('Error al guardar los datos', err);
    
        //Mostrar mensaje de error
        console.error('Error al crear la institución:', err.response ? err.response.data : err.message);
        mostrarMensaje('Error al crear la institución. Por favor, intente de nuevo.', 'text-red-500');
        } 

}

//Listar Entidades
const ListarInstituciones = async () => {
    const tbody = document.querySelector('#institucionesTable tbody');

    //Verificamos si existe el tbody antes de proceder
    if (!tbody) {
        console.error('No se encontró el elemento #institucionesTable');
        return; //si no existe, salimos de la función para evitar errores
        
    }
    
    //Limpiamos el contenido actual de la tabla
    tbody.innerHTML = '';

    //Hacemos la petición get
    API.get('/').then(respuesta => {
        //Recorremos la respuesta y creamos filas para la tabla
        const instituciones = respuesta.data;

        instituciones.forEach((institucion, index) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td class='border-b-2 border-slate-700 px-4 py-2 text-center'>${index+1}</td>
                <td class='border-b-2 border-slate-700 px-4 py-2 text-center max-w-xs'>${institucion.nombre}</td>
                <td class='border-b-2 border-slate-700 px-4 py-2 text-center max-w-xs'>${institucion.direccion}</td>
                <td class='border-b-2 border-slate-700 px-4 py-2 text-center'>${institucion.telefono}</td>
                <td class='border-b-2 border-slate-700 px-4 py-1 text-center'>${institucion.email}</td>
                <td class='border-b-2 border-slate-700 px-4 py-2 text-center'>${institucion.director}</td>
                <td class='border-b-2 border-slate-700 px-4 py-2 text-center'>${institucion.estado}</td>       
                <td class='border-b-2 border-slate-700 px-4 py-2 text-center'>${institucion.nosedes}</td>

                <td class='border-b-2 border-slate-700 px-4 py-2 text-center'>
                <button class="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-md" onclick="editarInstitucion('${institucion._id}')">Editar</button>
                </td>

                <td class='border-b-2 border-slate-700 px-4 py-2 text-center'>
                <button class="bg-red-500 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-md" onclick="eliminarInstitucion('${institucion._id}')">Eliminar</button>
                </td>
                           
            `;
            
            tbody.appendChild(fila);

        });
    }).catch(err => {
        console.error('No se pudo listar las instituciones', err);
    });
        
};
//Llamamos al metodo ListarInstituciones
ListarInstituciones();

//aca empieza la condición para que se pueda actualizar el formulario
const formularioActualizar = document.querySelector('.formActualizar');
if (formularioActualizar) {
    formularioActualizar.addEventListener('submit', async (e) => {
    e.preventDefault();

    //capturamos los valores de los input y selects
    const datos = {
        nombre: document.getElementById('nombre').value,
        direccion: document.getElementById('direccion').value,
        telefono: document.getElementById('telefono').value,
        email: document.getElementById('email').value,
        director: document.getElementById('director').value,
        // departamento: document.getElementById('departamento').value,
        // capitales: document.getElementById('capitales').value,
        estado: document.getElementById('estado').value,
        // secretaria: document.getElementById('secretaria').value,
        nosedes: document.getElementById('sedes').value

        }

        const id = formularioActualizar.getAttribute('data-id');
        try {
            if (id) {
            console.log('Intentando actualizar institución con ID:', id);
            // Actualizar entidad
            const resultadoActualizar = await actualizarInstitucion(id, datos);
            console.log('Resultado de la actualizacion:', resultadoActualizar);
            mostrarMensaje('Institución actualizada con exito', 'text-green-500');

            }else {
                console.error('No se encontro ID para atualización');
            }
            
            window.location.href = 'src/pages/admin/home.html';
            
        } catch (err) {
            console.error('Error al procesar la solicitud:', err);
            mostrarMensaje('Error al procesar la solicitud', 'text-red-500');
            
        }
       
        
        
    });
    
}

//función para redirigir al archivo de actualización
const editarInstitucion = (id) => {
    //redirigir a la pagina actualizacion
    const url = `src/pages/auth/entidades/actualizarEntidades.html?id=${id}`;
    console.log('Redirigiendo:', url);
    
    window.location.href = url;
   
};

//Función para cargar los datos de la institución
const cargarDatosInstitucion = async (id) => {
    try {
        //Hacemos la solicitud get para obtener los datos de la institucion
        const response = await API.get(`/${id}`);
        const institucion = response.data;

        //llenamos los campos
        document.getElementById('nombre').value = institucion.nombre;
        document.getElementById('direccion').value = institucion.direccion;
        document.getElementById('telefono').value = institucion.telefono;
        document.getElementById('email').value = institucion.email;
        document.getElementById('director').value = institucion.director;
        // document.getElementById('departamento').value = institucion.departamento;
        // document.getElementById('capitales').value = institucion.capitales;
        document.getElementById('estado').value = institucion.estado;
        // document.getElementById('secretaria').value = institucion.secretaria;
        document.getElementById('sedes').value = institucion.sedes;

        //agregamos el id
        const formulario = document.querySelector('.formActualizar');
        if (formulario) {
            formulario.setAttribute('data-id', id);
        }else {
            console.error('No se encontró el formulario');
        }
    }catch(err) {
        console.error('No se pudo cargar la institución para editar', err);
        mostrarMensaje('Error al cargar los datos de la institución. Intente de nuevo.', 'text-red-500');
    }
};

//función para actualizar los datos de la institución
const actualizarInstitucion = async (id, datos) => {
    
    try {
        console.log('ID que se está enviando para actualización:', id);
        console.log('Datos que se están enviando:', datos);
        //Hacemos la solicitud put para actualizar los datos de la institución
        const response = await API.put(`/${id}`, datos);
        console.log('Institucion actualizada', response.data);
        return response.data;
        // const formulario = document.querySelector('.formActualizar');
        // if (formulario) {
        //     //formulario.reset();
        //     formulario.removeAttribute('data-id');            
        // }
           
    }catch(err) {
        console.error('No se pudo actualizar la institución', err);
        mostrarMensaje('Error al actualizar la institución. Por favor, intente de nuevo.', 'text-red-500');
    }

};

//Eliminar Entidades
const eliminarInstitucion = async (id) => {
    //Mostrar mensaje de confirmación
    const confirmación = confirm('¿Esta seguro de que deseas eliminar esta institución?');
    if (!confirmación) return; //Si el usuario cancela no se haría nada
    
    try {
        //Hacemos la petición delete
        API.delete(`/${id}`).then(respuesta => {
            //Si la respuesta es exitosa, actualizamos la tabla
            console.log('Institución eliminada con éxito', respuesta.data);
            ListarInstituciones();
            
            })
            
        
    } catch(err) {

        console.error('No se pudo eliminar la institución', err);
        alert('No se pudo eliminar la institución');
    };
    
   
}

//funcion para mostrar mensajes
function mostrarMensaje(mensaje, clase) {
    const formulario = document.querySelector('.formulario');
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

