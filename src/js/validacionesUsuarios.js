const formulario = document.getElementById('formulario');
const correo = document.getElementById('email');
const select = document.querySelector('.select')
const inputText = document.querySelectorAll('.inputText');
const contraseña = document.getElementById('contraseña');
const repeatPass = document.getElementById('repeatPass');
const btnEnviar = document.getElementById('btn');

btnEnviar.disabled = true;


const validateEmptyField = (e) => {
    const field = e.target;
    const fieldValue = e.target.value;
  
    if (field.tagName === 'INPUT' && fieldValue.trim().length === 0) {
      // field.classList.add('falla');
      field.nextElementSibling.classList.add('mensajeError');
      field.nextElementSibling.innerText = `${field.name} requerido`;
      field.nextElementSibling.style.color = 'red';
      //field.nextElementSibling.style.fontSize = 'semiSmall'

      btnEnviar.disabled = true;
    
      //validación para la contraseña
    } else if (field.name === 'password') {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/; // Al menos 8 caracteres, al menos una mayúscula y un número
        if (!passwordRegex.test(fieldValue)) {
            field.nextElementSibling.classList.add('mensajeError');
            field.nextElementSibling.innerText = 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número';
            field.nextElementSibling.style.color = 'red';
            field.nextElementSibling.style.fontSize = 'small'
            btnEnviar.disabled = true; // Desactivar botón de enviar
        } else {
            field.nextElementSibling.classList.remove('mensajeError');
            field.nextElementSibling.innerText = '';
            btnEnviar.disabled = false; // Activar botón de enviar
        }
          
    //validación para que las contraseñas sean iguales 
    }else if (field.name === 'repetirContraseña') {
        const password = document.getElementById('contraseña').value;
        if (fieldValue !== password) {
            field.nextElementSibling.classList.add('mensajeError');
            field.nextElementSibling.innerText = 'Las contraseñas deben ser iguales';
            field.nextElementSibling.style.color = 'red';
            //field.nextElementSibling.style.fontSize = 'small'
            btnEnviar.disabled = true;

        }else {
            field.nextElementSibling.classList.remove('mensajeError');
            field.nextElementSibling.innerText = '';
            btnEnviar.disabled = false;

        }
    
         //validación para los select
    }else if(field.tagName === 'SELECT' && fieldValue === ''){
      field.nextElementSibling.classList.add('mensajeError');
      field.nextElementSibling.innerText = 'Seleccione una opción';
      field.nextElementSibling.style.color = 'red';
      btnEnviar.disabled = true;

    }else if (field.name === 'sedes' && isNaN(fieldValue)) {
      field.nextElementSibling.classList.add('mensajeError');
      field.nextElementSibling.innerText = 'debe ingresar un numero válido';
      field.nextElementSibling.style.color = 'red';
      btnEnviar.disabled = true;
      
    }
    else {
        // field.classList.remove('falla')
        field.nextElementSibling.classList.remove('mensajeError');
        field.nextElementSibling.innerText = '';
        btnEnviar.disabled = false;
      }
}

const validateEmailFormat = (e) => {
    const field = e.target;
    const fieldValue = field.value.trim();
    const regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    if (!regex.test(fieldValue)) {
      
      //field.classList.add('falla')
      field.nextElementSibling.classList.add('mensajeError');
      field.nextElementSibling.innerText = `por favor,ingresa un correo válido`;
      btnEnviar.disabled = true;
    }else {
      //field.classList.remove('falla');
      field.nextElementSibling.classList.remove('mensajeError');
      field.nextElementSibling.innerText = '';
      //btnEnviar.disabled = false;
    }
    
  
  }

correo.addEventListener('blur', validateEmptyField);
contraseña.addEventListener('blur', validateEmptyField);
repeatPass.addEventListener('blur', validateEmptyField);
select.addEventListener('blur', validateEmptyField);

inputText.forEach((input) => input.addEventListener('blur', validateEmptyField));

correo.addEventListener('input', validateEmailFormat);