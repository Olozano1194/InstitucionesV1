import { httpClient } from '../../core/httpClient.js';
import { httpClient } from '../../../core/';
import { config } from '../../../core/config/config.js';

/**
 * API de Entidades
 * @description Capa de abstracción sobre las peticiones HTTP de entidades
 * SOLO maneja comunicación con el backend, NO lógica de negocio
 */

const ENDPOINT = config.endpoints.usuarios;

export const usuariosAPI = {
  /**
   * Crear un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} Usuario creado con token
   */
  async create(userData) {
    return httpClient.post(ENDPOINT, userData);
  },

  /**
   * Listar todos los usuarios
   * @param {Object} filters - Filtros opcionales (rol, activo, etc)
   * @returns {Promise<Array>} Lista de usuarios
   */
  async getAll(filters = {}) {
    return httpClient.get(ENDPOINT, filters);
  },

  /**
   * Obtener un usuario por ID
   * @param {string} id - ID del usuario
   * @returns {Promise<Object>} Datos del usuario
   */
  async getById(id) {
    return httpClient.get(`${ENDPOINT}/${id}`);
  },

  /**
   * Actualizar usuario
   * @param {string} id - ID del usuario
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  async update(id, updateData) {
    return httpClient.put(`${ENDPOINT}/${id}`, updateData);
  },

  /**
   * Eliminar usuario
   * @param {string} id - ID del usuario
   * @returns {Promise<Object>} Confirmación
   */
  async delete(id) {
    return httpClient.delete(`${ENDPOINT}/${id}`);
  },

  /**
   * Login de usuario
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>} Token y datos del usuario
   */
  async login(email, password) {
    return httpClient.post(`${config.endpoints.auth}/login`, { 
      email, 
      password 
    });
  },
};