import { entidadesAPI } from '../api/entidades.api.js';
import { config, buildRoute } from '../../../core/config.js';
import { isNotEmpty, isValidEmail, isNumeric } from '../../../js/validations/validaciones.js';

export const entidadesService = {
  /**
  * Registrar un nuevo entidad   
  */    
  async register(formData) {
    try {
      // Validaciones de negocio antes de enviar
      const validation = this.validateEntidadData(formData);

      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Llamada a la API
      const response = await entidadesAPI.create(formData);

      return {
        success: true,
        data: response,
        message: 'Entidad creada exitosamente',
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
  /**
  * Listar entidades con filtros
  */
  async list(filters = {}) {
    try {
      const entidades = await entidadesAPI.getAll(filters);      
      // Transformar datos si es necesario
      return entidades.map(entidad => ({
        ...entidad,                
      }));

    } catch (error) {
      console.error('Error al listar entidades:', error);
      throw error;
    }
  },

  /**
   * Obtener entidad por ID
   */
  async getById(id) {
    try {
      return await entidadesAPI.getById(id);
    } catch (error) {
      console.error(`Error al obtener entidad ${id}:`, error);
      throw error;
    }
  },

  /**
   * Actualizar entidad
   */
  async update(id, data) {
    try {
      const response = await entidadesAPI.update(id, data);
      return {
        success: true,
        data: response,
        message: 'Entidad actualizada correctamente',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
  /**
   * Eliminar entidad
   */
  async delete(id) {
    try {
      await entidadesAPI.delete(id);
      return {
        success: true,
        message: 'Entidad eliminada correctamente',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
  /**
  * Validaciones de negocio (lado cliente)
  */
  validateEntidadData(data) {
    const errors = [];
    // Validar nombre
    if (!isNotEmpty(data.nombre)) {
      errors.push('El nombre es obligatorio');
    }
    // Validar direccion
    if (!isNotEmpty(data.direccion)) {
      errors.push('La dirección es obligatorio');
    }
    // Validar telefono
    if (!isNotEmpty(data.telefono)) {
      errors.push('El telefono es obligatorio');
    }
    // Validar email
    if (!isNotEmpty(data.email)) {
      errors.push('El email es obligatorio');
    } else if (!isValidEmail(data.email)) {
      errors.push('El formato del email no es válido');
    }
    // Validar director
    if (!isNotEmpty(data.director)) {
      errors.push('El director es obligatorio');
    }
    // Validar departamento
    if (!data.iddepartamento) {
      errors.push('Debes seleccionar un departamento');
    }
    // Validar municipio
    if (!data.idmunicipio) {
      errors.push('Debes seleccionar un municipio');
    }
    // Validar secretaria
    if (!isNotEmpty(data.secretaria)) {
      errors.push('La secretaria es obligatorio');
    }
    // Validar sedes
    if (!isNotEmpty(String(data.sedes))) {
      errors.push('Las sedes son obligatorias');
    } else if (!isNumeric(String(data.sedes))) {
      errors.push('Las sedes deben ser un número válido');
    }
    return {
      isValid: errors.length === 0,
      errors,
    };
  },
  /**
  * Navegar a lista de entidades
  */
  navigateToList() {
    window.location.href = buildRoute(config.routes.entidades.list);
  },
};