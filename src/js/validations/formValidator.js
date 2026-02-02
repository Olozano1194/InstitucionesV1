import {
  isNotEmpty,
  isValidEmail,
  isValidPassword,
  arePasswordsMatching,
  isValidSelection,
  isNumeric,
} from './validaciones.js';

/**
 * Clase para gestionar validación de formularios
 */
export class FormValidator {
  constructor(formId, mode = 'register') {
    this.form = document.getElementById(formId);
    this.mode = mode;
    
    if (!this.form) {
      console.error(`FormValidator: no existe un formulario con id "${formId}"`);
      return;
    }

    this.errors = {}; // Guardamos errores de cada campo
    this.submitButton = null;
  }

  /**
   * Muestra un mensaje de error debajo de un campo
   */
  showError(field, message) {
    const errorElement = field.nextElementSibling;
    
    if (errorElement && errorElement.classList.contains('error-message')) {
      errorElement.textContent = message;
      errorElement.classList.remove('hidden');
      errorElement.classList.add('text-red-500', 'text-sm', 'mt-1');
    }
    
    // Registrar error
    this.errors[field.name] = message;
    this.updateSubmitButton();
  }

  /**
   * Oculta el mensaje de error de un campo
   */
  hideError(field) {
    const errorElement = field.nextElementSibling;
    
    if (errorElement && errorElement.classList.contains('error-message')) {
      errorElement.textContent = '';
      errorElement.classList.add('hidden');
    }
    
    // Quitar error del registro
    delete this.errors[field.name];
    this.updateSubmitButton();
  }

  /**
   * Valida un campo según su tipo
   */
  validateField(field) {
    const value = field.value;
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    switch (fieldName) {
      case 'email':
        if (!isNotEmpty(value)) {
          isValid = false;
          errorMessage = 'El email es requerido';
        } else if (!isValidEmail(value)) {
          isValid = false;
          errorMessage = 'El formato del email no es válido';
        }
        break;

      case 'password':
        if (!isNotEmpty(value)) {
          isValid = false;
          errorMessage = 'La contraseña es requerida';
        } else if (this.mode === 'register' && !isValidPassword(value)) {
          isValid = false;
          errorMessage = 'La contraseña debe tener al menos 6 caracteres, una mayúscula y un número';
        }
        break;

      case 'repetirContraseña':
        const passwordField = this.form.querySelector('[name="password"]');
        if (!arePasswordsMatching(passwordField.value, value)) {
          isValid = false;
          errorMessage = 'Las contraseñas no coinciden';
        }
        break;

      case 'nombre':
        if (!isNotEmpty(value)) {
          isValid = false;
          errorMessage = 'El nombre es requerido';
        } else if (value.length < 2) {
          isValid = false;
          errorMessage = 'El nombre debe tener al menos 2 caracteres';
        }
        break;

      case 'apellido':
        if (!isNotEmpty(value)) {
          isValid = false;
          errorMessage = 'El apellido es requerido';
        } else if (value.length < 2) {
          isValid = false;
          errorMessage = 'El apellido debe tener al menos 2 caracteres';
        }
        break;

      case 'rol':
      case 'departamento':
      case 'municipio':
        if (!isValidSelection(value)) {
          isValid = false;
          errorMessage = 'Selecciona una opción';
        }
        break;

      case 'sedes':
        if (!isNumeric(value)) {
          isValid = false;
          errorMessage = 'Debe ingresar un número válido';
        }
        break;

      default:
        // Validación genérica
        if (!isNotEmpty(value)) {
          isValid = false;
          errorMessage = `${fieldName} es requerido`;
        }
    }

    // Mostrar u ocultar error
    if (!isValid) {
      this.showError(field, errorMessage);
    } else {
      this.hideError(field);
    }

    return isValid;
}

  /**
   * Habilita/deshabilita el botón según el estado del formulario
   */
  updateSubmitButton() {
    if (!this.submitButton) return;

    // ✅ El botón se habilita solo si NO hay errores
    const hasErrors = Object.keys(this.errors).length > 0;
    this.submitButton.disabled = hasErrors;
  }

  /**
   * Configura el botón de envío
   */
  setSubmitButton(buttonId) {
    this.submitButton = document.getElementById(buttonId);
    if (this.submitButton) {
      this.submitButton.disabled = true; // Deshabilitado por defecto
    }
  }

  /**
   * Valida todos los campos del formulario
   */
  validateAll() {
    const fields = this.form.querySelectorAll('input, select, textarea');
    let allValid = true;

    fields.forEach(field => {
      if (!this.validateField(field)) {
        allValid = false;
      }
    });

    return allValid;
  }

  /**
   * Inicializa los event listeners
   */
  init() {
    const fields = this.form.querySelectorAll('input, select, textarea');

    fields.forEach(field => {
      // Validar al salir del campo
      field.addEventListener('blur', () => {
        this.validateField(field);
      });

      // Validar mientras escribe (solo para email)
      if (field.name === 'email') {
        field.addEventListener('input', () => {
          this.validateField(field);
        });
      }

      // Validar confirmar contraseña cuando cambia la contraseña principal
      if (field.name === 'password') {
        field.addEventListener('input', () => {
          const confirmField = this.form.querySelector('[name="repetirContraseña"]');
          if (confirmField && confirmField.value) {
            this.validateField(confirmField);
          }
        });
      }
    });
  }
}