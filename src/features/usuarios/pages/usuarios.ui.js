import { usuariosService } from "../services/usuarios.service.js";
import { FormValidator } from '../../../js/validations/formValidator.js';
import { showMessage, setLoading } from "../../../shared/utils/helpers.js";

/**
 * Controlador de UI para Usuarios
 */
export const usuariosUI = {
  validator: null, 

  /**
   * Inicializar formulario de registro
   */
  initCreateForm() {
    const form = document.getElementById('formulario');
    if (!form) {
      console.warn('Formulario de registro no encontrado');
      return;
    }
    
    // Inicializar validador
    this.validator = new FormValidator('formulario');
    this.validator.setSubmitButton('btn');
    this.validator.init();

    // Listener del submit
    form.addEventListener('submit', (e) => this._handleSubmit(e));
  },

  /**
   * Handler del submit
   * @private
   */
  async _handleSubmit(event) {
    event.preventDefault();

    // Validar todo el formulario antes de enviar
    if (!this.validator.validateAll()) {
      console.warn('⚠️ Validación falló');
      showMessage('Por favor, corrige los errores antes de continuar', 'error');
      return;
    }
    
    const formData = this._getFormData();
    const submitBtn = document.getElementById('btn');

    try {
      setLoading(submitBtn, true);
      
      // Llamada al servicio (que tiene validación adicional)
      const result = await usuariosService.register(formData);

      if (result.success) {
        showMessage(result.message, 'success');
        
        // Limpiar formulario
        this.clearForm();
        
        // Redirigir después de 1.5 segundos
        setTimeout(() => {
          usuariosService.navigateToList();
        }, 1500);
      } else {
        showMessage(result.error, 'error');
      }

    } catch (error) {
      console.error('💥 Error en _handleSubmit:', error);
      showMessage('Error inesperado al crear usuario', 'error');
      console.error('Error en formulario:', error);
      
    } finally {
      setLoading(submitBtn, false);
    }
  },

  /**
   * Obtener datos del formulario
   * @private
   */
  _getFormData() {
    return {
      nombre: document.getElementById('nombre').value.trim(),
      apellido: document.getElementById('apellido').value.trim(),
      email: document.getElementById('email').value.trim(),
      rol: document.getElementById('rol').value,
      password: document.getElementById('password').value,
    };
  },
  /**
   * Limpiar formulario
   */
  clearForm() {
    const form = document.getElementById('formulario');
    if (form) {
      form.reset();
      
      // ✅ Limpiar también los errores del validador
      if (this.validator) {
        this.validator.errors = {};
        this.validator.updateSubmitButton();
      }
    }
  },
};

// Auto-inicialización
document.addEventListener('DOMContentLoaded', () => {
  usuariosUI.initCreateForm();
});