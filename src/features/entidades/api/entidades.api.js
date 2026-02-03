import { apiClient } from '../../../core/api/api.js';
import { config } from '../../../core/config.js';


const ENDPOINT = config.endpoints.entidades;
  
export const entidadesAPI = {
  /**
  * Obtener departamentos
  */
  async getDepartamentos() {
    return apiClient.get('/departamentos');
  },
  /**
   * Obtener municipios por departamento
   */
  async getMunicipiosByDepartamento(departamentoId) {
    return apiClient.get('/municipios/by-departamento', { departamento: departamentoId });
  },
  /**
  * Crear un nueva entidad
  */
  async create(entidadData) {
  return apiClient.post(ENDPOINT, entidadData);
  },

  /**
  * Listar todos las entidades
  */
  async getAll(filters = {}) {
    return apiClient.get(ENDPOINT, filters);
  },

  /**
  * Obtener entidad por ID
  */
  async getById(id) {
  return apiClient.get(`${ENDPOINT}/${id}`);
  },

  /**
  * Actualizar entidad
  */
  async update(id, updateData) {
    return apiClient.put(`${ENDPOINT}/${id}`, updateData);
  },

  /**
  * Eliminar entidad
  */
  async delete(id) {
    return apiClient.delete(`${ENDPOINT}/${id}`);
  },
  /**
   * Obtener sedes de una entidad
   */
  async getSedes(entidadId) {
    return apiClient.get(`${ENDPOINT}/${entidadId}/sedes`);
  },

  /**
   * Obtener estadísticas de entidades
   */
  async getStats() {
    return apiClient.get(`${ENDPOINT}/stats`);
  },  
};