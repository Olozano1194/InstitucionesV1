import { config } from '../config.js';

/**
 * Gestión centralizada de sesión
 * @description Abstracción sobre localStorage para manejo seguro de tokens
 */

export const session = {
  /**
   * Guardar token
   */
  saveToken(token) {
    if (!token || typeof token !== 'string') {
      throw new Error('Token inválido');
    }
    localStorage.setItem(config.storageKeys.TOKEN, token);
  },

  /**
   * Obtener token
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem(config.storageKeys.TOKEN);
  },

  /**
   * Guardar datos del usuario
   */
  saveUser(userData) {
    localStorage.setItem(
      config.storageKeys.USER, 
      JSON.stringify(userData)
    );
  },

  /**
   * Obtener datos del usuario
   * @returns {Object|null}
   */
  getUser() {
    const data = localStorage.getItem(config.storageKeys.USER);
    return data ? JSON.parse(data) : null;
  },

  /**
   * Guardar rol del usuario
   */
  saveRole(role) {
    localStorage.setItem(config.storageKeys.ROLE, role);
  },

  /**
   * Obtener rol del usuario
   * @returns {string|null}
   */
  getRole() {
    return localStorage.getItem(config.storageKeys.ROLE);
  },

  /**
   * Verificar si hay sesión activa
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.getToken();
  },

  /**
   * Limpiar toda la sesión
   */
  clearSession() {
    localStorage.removeItem(config.storageKeys.TOKEN);
    localStorage.removeItem(config.storageKeys.USER);
    localStorage.removeItem(config.storageKeys.ROLE);
  },

  /**
   * Obtener información completa de la sesión
   * @returns {Object}
   */
  getSessionInfo() {
    return {
      token: this.getToken(),
      user: this.getUser(),
      role: this.getRole(),
      isAuthenticated: this.isAuthenticated(),
    };
  },
};

// Exportar funciones individuales para compatibilidad
export const saveToken = (token) => session.saveToken(token);
export const getToken = () => session.getToken();
export const saveUser = (user) => session.saveUser(user);
export const getUser = () => session.getUser();
export const saveRole = (role) => session.saveRole(role);
export const getRole = () => session.getRole();
export const clearSession = () => session.clearSession();
export const isAuthenticated = () => session.isAuthenticated();
