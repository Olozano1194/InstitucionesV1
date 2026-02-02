import { usuariosService } from "../services/usuarios.service.js";
import { FormValidator } from '../../../js/validations/formValidator.js';

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
    form.addEventListener('submit', (e) => {console.log('🔥 Submit event disparado');this._handleSubmit(e)});
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
      this._showMessage('Por favor, corrige los errores antes de continuar', 'error');
      return;
    }
    
    const formData = this._getFormData();
    const submitBtn = document.getElementById('btn');

    try {
      this._setLoading(submitBtn, true);
      
      // Llamada al servicio (que tiene validación adicional)
      const result = await usuariosService.register(formData);

      if (result.success) {
        this._showMessage(result.message, 'success');
        
        // Limpiar formulario
        this.clearForm();
        
        // Redirigir después de 1.5 segundos
        setTimeout(() => {
          usuariosService.navigateToList();
        }, 1500);
      } else {
        this._showMessage(result.error, 'error');
      }

    } catch (error) {
      console.error('💥 Error en _handleSubmit:', error);
      this._showMessage('Error inesperado al crear usuario', 'error');
      console.error('Error en formulario:', error);
      
    } finally {
      this._setLoading(submitBtn, false);
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
   * Mostrar mensaje de feedback
   * @private
   */
  _showMessage(message, type = 'success') {
    let messageContainer = document.getElementById('message-container');
    
    if (!messageContainer) {
      messageContainer = document.createElement('div');
      messageContainer.id = 'message-container';
      messageContainer.className = 'fixed top-4 right-4 z-50';
      document.body.appendChild(messageContainer);
    }

    const messageEl = document.createElement('div');
    messageEl.className = `
      p-4 rounded-lg shadow-lg mb-2 
      ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} 
      text-white font-medium
      animate-fade-in
    `;
    messageEl.textContent = message;

    messageContainer.appendChild(messageEl);

    setTimeout(() => {
      messageEl.classList.add('animate-fade-out');
      setTimeout(() => messageEl.remove(), 300);
    }, 3000);
  },

  /**
   * Cambiar estado de carga del botón
   * @private
   */
  _setLoading(button, isLoading) {
    if (!button) return;

    if (isLoading) {
      button.disabled = true;
      button.innerHTML = `
        <i class="bi bi-arrow-repeat animate-spin"></i>
        Procesando...
      `;
      button.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
      button.disabled = false;
      button.innerHTML = `
        <i class="bi bi-box-arrow-in-right text-purple-800 font-black text-2xl"></i>
        Registrarse
      `;
      button.classList.remove('opacity-50', 'cursor-not-allowed');
    }
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