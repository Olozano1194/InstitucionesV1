const formularioId = document.getElementById('formularios');
const correo = document.getElementById('email');
const telefono = document.getElementById('telefono');
const selects = document.querySelectorAll('.select')
const inputText = document.querySelectorAll('.inputText')
const sedes = document.getElementById('sedes');
const btnEnviar = document.getElementById('btn');

btnEnviar.disabled = true;

//validaciones para los inputs y textarea
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
      //validación para el telefono
    }else if(field.name === 'telefono'){
      if (isNaN(fieldValue) || fieldValue.trim().length !== 10) {
        field.nextElementSibling.classList.add('mensajeError');
        field.nextElementSibling.innerText = 'debe ingresar un numero válido';
        field.nextElementSibling.style.color = 'red';
        btnEnviar.disabled = true;        
      }else {
        // field.classList.remove('falla')
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

//validacion para el correo
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

//Agregamos el evento a cada input text
correo.addEventListener('blur', validateEmptyField);
telefono.addEventListener('blur', validateEmptyField);
sedes.addEventListener('blur', validateEmptyField);

//Agregamos el evento a cada input de tipo text
selects.forEach((select) => {
  select.addEventListener('blur', validateEmptyField);
  
});

//Agregamos el evento a cada select
inputText.forEach((input) => {
  input.addEventListener('blur', validateEmptyField);
});


correo.addEventListener('input', validateEmailFormat);





