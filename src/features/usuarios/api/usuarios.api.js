import { registerUser, getAllUsers, getUserById, updateUser, deleteUser, loginUser } from '../../../core/api/api.js';


/**
 * API de Usuarios
 * @description Capa de abstracción sobre las peticiones HTTP de usuarios
 * SOLO maneja comunicación con el backend, NO lógica de negocio
 */

export const usuariosAPI = {
  /**
   * Crear un nuevo usuario
   */
  async create(userData) {
    return await registerUser(userData);
  },

  /**
   * Listar todos los usuarios
   */
  async getAll(filters = {}) {
    // Por ahora api.js no acepta filtros, así que solo llamamos
    // TODO: Agregar soporte de query params en api.js
    return await getAllUsers();
  },

  /**
   * Obtener un usuario por ID
   */
  async getById(id) {
    return await getUserById(id);
  },

  /**
   * Actualizar usuario
   */
  async update(id, updateData) {
    return await updateUser(id, updateData);
  },

  /**
   * Eliminar usuario
   */
  async delete(id) {
    return await deleteUser(id);
  },

  /**
   * Login de usuario
   */
  async login(email, password) {
    return await loginUser(email, password);
  },
};