import { usuariosAPI } from '../api/usuarios.api.js';
import { saveToken, saveUser } from '../../../core/auth/session.js';
import { config, buildRoute } from '../../../core/config.js';
import { isNotEmpty, isValidEmail, isValidPassword } from '../../../js/validations/validaciones.js';

/**
 * Servicio de Usuarios
 * @description Lógica de negocio y orquestación
 * Transforma datos entre la API y la UI
 */
export const usuariosService = {
  /**
   * Registrar un nuevo usuario
   * @param {Object} formData - Datos del formulario
   * @returns {Promise<Object>} Usuario creado
   */
    
  async register(formData) {
    try {
      // Validaciones de negocio antes de enviar
      const validation = this.validateUserData(formData);

      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Llamada a la API
      const response = await usuariosAPI.create(formData);

      // Guardar sesión si el backend retorna token
      if (response.token) {
        saveToken(response.token);
        saveUser(response.usuario);
      }

      return {
        success: true,
        data: response.usuario,
        message: 'Usuario creado exitosamente',
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }, 

  /**
   * Listar usuarios con filtros
   * @param {Object} filters 
   * @returns {Promise<Array>}
   */
  async list(filters = {}) {
    try {
      const usuarios = await usuariosAPI.getAll(filters);
      
      // Transformar datos si es necesario
      return usuarios.map(user => ({
        ...user,
        nombreCompleto: `${user.nombre} ${user.apellido}`,        
      }));

    } catch (error) {
      console.error('Error al listar usuarios:', error);
      throw error;
    }
  },

  /**
   * Obtener usuario por ID
   */
  async getById(id) {
    try {
      return await usuariosAPI.getById(id);
    } catch (error) {
      console.error(`Error al obtener usuario ${id}:`, error);
      throw error;
    }
  },

  /**
   * Actualizar usuario
   */
  async update(id, data) {
    try {
      const response = await usuariosAPI.update(id, data);
      return {
        success: true,
        data: response,
        message: 'Usuario actualizado correctamente',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Eliminar usuario
   */
  async delete(id) {
    try {
      await usuariosAPI.delete(id);
      return {
        success: true,
        message: 'Usuario eliminado correctamente',
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
   * @private
   */
  validateUserData(data) {
    const errors = [];

    // Validar nombre
    if (!isNotEmpty(data.nombre)) {
      errors.push('El nombre es obligatorio');
    }

    // Validar apellido
    if (!isNotEmpty(data.apellido)) {
      errors.push('El apellido es obligatorio');
    }

    // Validar email
    if (!isNotEmpty(data.email)) {
      errors.push('El email es obligatorio');
    } else if (!isValidEmail(data.email)) {
      errors.push('El formato del email no es válido');
    }

    // Validar contraseña
    if (!isNotEmpty(data.password)) {
      errors.push('La contraseña es obligatoria');
    } else if (!isValidPassword(data.password)) {
      errors.push('La contraseña debe tener al menos 6 caracteres, una mayúscula y un número');
    }

    // Validar rol
    if (!isNotEmpty(data.rol)) {
      errors.push('Debes seleccionar un rol');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Navegar a lista de usuarios
   */
  navigateToList() {
    window.location.href = buildRoute(config.routes.usuarios.list);
  },
};