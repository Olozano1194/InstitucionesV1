import { getToken, clearSession } from '../../core/auth/session.js';
import { config } from '../config.js'; 

/**
 * Función principal para hacer peticiones
 * @param {string} endpoint - Ejemplo: '/usuarios/login'
 * @param {Object} options - Configuración de fetch
 */
async function request(endpoint, options = {}) {
  // 1️⃣ Preparar headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // 2️⃣ Agregar token si existe
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 3️⃣ Hacer la petición usando config.API_BASE_URL ✅
  try {
    const response = await fetch(`${config.API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // 4️⃣ Manejar errores HTTP
    if (!response.ok) {
      await handleError(response);
    }

    // 5️⃣ Retornar datos
    return await response.json();
    
  } catch (error) {
    if (error.name === 'TypeError') {
      throw new Error('Sin conexión a internet. Verifica tu red.');
    }
    throw error;
  }
}

/**
 * Manejo centralizado de errores HTTP
 */
async function handleError(response) {
  const error = await response.json().catch(() => ({}));
  const message = error.message || 'Error desconocido';

  switch (response.status) {
    case 401:
      clearSession();
      // ✅ Usar config.routes.login en vez de hardcodear
      window.location.href = config.routes.login;
      throw new Error('Sesión expirada. Inicia sesión nuevamente.');
    
    case 403:
      throw new Error('No tienes permisos para esta acción.');
    
    case 404:
      throw new Error('No encontrado: ' + message);
    
    case 400:
      throw new Error(message);
    
    case 500:
      throw new Error('Error del servidor. Intenta más tarde.');
    
    default:
      throw new Error(message);
  }
}

export const apiClient = {
  /**
   * GET request
   */
  async get(endpoint, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams ? `${endpoint}?${queryParams}` : endpoint;
    
    return request(url, {
      method: 'GET',
    });
  },

  /**
   * POST request
   */
  async post(endpoint, data) {
    return request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * PUT request
   */
  async put(endpoint, data) {
    return request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return request(endpoint, {
      method: 'DELETE',
    });
  },

  /**
   * PATCH request
   */
  async patch(endpoint, data) {
    return request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};

// ===================================
// 🚀 Funciones específicas para cada endpoint
// ===================================

/**
 * OBTENER TODAS LAS ENTIDADES
 */
export async function getAllEntidades() {
  return request(config.endpoints.entidades, {
    method: 'GET',
  });
}

/**
 * OBTENER TODOS LOS ESTUDIANTES
 */
export async function getAllEstudiantes() {
  return request(config.endpoints.estudiantes, {
    method: 'GET',
  });
}

/**
 * OBTENER TODOS LOS PROFESORES
 */
export async function getAllProfesores() {
  return request(config.endpoints.profesores, {
    method: 'GET',
  });
}