import { entidadesService } from "../services/entidades.services.js";
import { FormValidator } from '../../../js/validations/formValidator.js';
import { entidadesAPI } from "../api/entidades.api.js";
import { showMessage, setLoading } from "../../../shared/utils/helpers.js";

/**
 * Controlador de UI para Entidades
 */
export const entidadesUI = {
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
    this._loadDepartamentos();

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
      console.log('Payload', formData);
      
      
      // Llamada al servicio (que tiene validación adicional)
      const result = await entidadesService.register(formData);
      console.log('Resultado register:', result);
      

      if (result.success) {
        showMessage(result.message, 'success');
        
        // Limpiar formulario
        this.clearForm();
        
        // Redirigir después de 1.5 segundos
        setTimeout(() => {
          entidadesService.navigateToList();
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
      direccion: document.getElementById('direccion').value.trim(),
      telefono: document.getElementById('telefono').value.trim(),
      email: document.getElementById('email').value.trim(),
      director: document.getElementById('director').value.trim(),
      iddepartamento: document.getElementById('departamento').value,
      idmunicipio: document.getElementById('municipio').value,
      estado: document.getElementById('estado').value,
      secretaria: document.getElementById('secretaria').value,
      sedes: document.getElementById('sedes').value,
    };
  },  

  async _loadDepartamentos() {
    const depSelect = document.getElementById('departamento');
    const munSelect = document.getElementById('municipio');

    // Guard clause: verificar que existan los elementos
    if (!depSelect || !munSelect) {
      console.warn('No se encontraron los selects de departamento/municipio');
      return;
    }

    try {
      const departamentos = await entidadesAPI.getDepartamentos();

      // Verificar que venga array
      if (!Array.isArray(departamentos)) {
        console.error('getDepartamentos no retornó un array:', departamentos);
        return;
      }

      // Renderizar opciones
      depSelect.innerHTML = '<option value="">Seleccione un departamento</option>';
      departamentos.forEach(dep => {
        const option = document.createElement('option');
        option.value = dep.id_departamento;  
        option.textContent = dep.descripcion;
        depSelect.appendChild(option);
      });

      // Listener para municipios
      depSelect.addEventListener('change', (e) => this._loadMunicipios(e.target.value));

    } catch (err) {
      console.error('Error cargando departamentos:', err);
      depSelect.innerHTML = '<option value="">No se pudieron cargar departamentos</option>';
    }
  },

  async _loadMunicipios(departamentoId) {
    const munSelect = document.getElementById('municipio');

    // Si no seleccionó departamento, limpiar municipios
    if (!departamentoId) {
      munSelect.innerHTML = '<option value="">Seleccione un municipio</option>';
      return;
    }

    try {
      const municipios = await entidadesAPI.getMunicipiosByDepartamento(departamentoId);

      if (!Array.isArray(municipios)) {
        console.error('getMunicipiosByDepartamento no retornó un array:', municipios);
        return;
      }

      munSelect.innerHTML = '<option value="">Seleccione un municipio</option>';
      municipios.forEach(mun => {
        const option = document.createElement('option');
        option.value = mun.id_municipio;
        option.textContent = mun.descripcion;
        munSelect.appendChild(option);
      });

    } catch (err) {
      console.error('Error cargando municipios:', err);
      munSelect.innerHTML = '<option value="">No se pudieron cargar municipios</option>';
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
  entidadesUI.initCreateForm();
});