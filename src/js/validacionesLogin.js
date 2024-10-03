const correo = document.getElementById('email');
const contraseña = document.getElementById('contraseña');

const btnEnviar = document.getElementById('btn');

btnEnviar.disabled = true;

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

    // Validación para la contraseña
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
    }else {
        // field.classList.remove('falla')
        field.nextElementSibling.classList.remove('mensajeError');
        field.nextElementSibling.innerText = '';
        btnEnviar.disabled = false;
      }
  
}








correo.addEventListener('blur', validateEmptyField);
contraseña.addEventListener('blur', validateEmptyField);

correo.addEventListener('input', validateEmailFormat);