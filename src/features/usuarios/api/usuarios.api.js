import { apiClient } from '../../../core/api/api.js';
import { config } from '../../../core/config.js';


  /**
   * API de Usuarios
   * @description Capa de abstracción sobre las peticiones HTTP de usuarios
   * SOLO maneja comunicación con el backend, NO lógica de negocio
   */

const ENDPOINT = config.endpoints.usuarios;
  
export const usuariosAPI = {
  /**
     * Crear un nuevo usuario
     */
  async create(userData) {
  return apiClient.post(ENDPOINT, userData);
  },

  /**
  * Listar todos los usuarios
  */
  async getAll(filters = {}) {
    // Por ahora api.js no acepta filtros, así que solo llamamos
    // TODO: Agregar soporte de query params en api.js
    return apiClient.get(ENDPOINT, filters);
  },

  /**
     * Obtener un usuario por ID
     */
  async getById(id) {
  return apiClient.get(`${ENDPOINT}/${id}`);
  },

  /**
     * Actualizar usuario
     */
  async update(id, updateData) {
    return apiClient.put(`${ENDPOINT}/${id}`, updateData);
  },

  /**
     * Eliminar usuario
     */
  async delete(id) {
    return apiClient.delete(`${ENDPOINT}/${id}`);
  },

  /**
     * Login de usuario
     */
  async login(email, password) {
    return apiClient.post(`${ENDPOINT}/login`, { email, password });
  },
};