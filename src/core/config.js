const ENV = {
  development: {
    API_BASE_URL: 'http://localhost:5000/api',
    TOKEN_EXPIRY: '24h',
    TIMEOUT: 10000,
  },
  production: {
    API_BASE_URL: 'https://api-instituciones.vercel.app/api',
    TOKEN_EXPIRY: '24h',
    TIMEOUT: 15000,
  }
};

// Detectar entorno automáticamente
const isDevelopment = window.location.hostname === 'localhost' 
  || window.location.hostname === '127.0.0.1';

export const config = {
  // ✅ Spread del entorno actual
  ...ENV[isDevelopment ? 'development' : 'production'],
  
  // Endpoints (sin barra inicial para más flexibilidad) ✅
  endpoints: {
    auth: '/auth',
    usuarios: '/usuario',  
    entidades: '/instituciones',
    estudiantes: '/estudiantes',
    profesores: '/profesores',
  },

  // Rutas del frontend
  routes: {
    login: '/pages/auth/login.html',
    dashboards: {
      admin: '/pages/admin/home.html',
      docente: '/pages/docente/home.html',
      estudiante: '/pages/estudiante/home.html',
    },    
    usuarios: {
      list: '/pages/admin/listarUsuarios.html',
      create: '/pages/admin/crearUsuario.html',
    }
  },

  // Storage keys
  storageKeys: {
    TOKEN: '__app_token',
    USER: '__app_user',
    ROLE: '__app_role',
  },
  
  // ✅ NUEVO: Info del entorno actual (útil para debugging)
  isDevelopment,
};

// Helpers
export const buildApiUrl = (endpoint) => {
  return `${config.API_BASE_URL}${endpoint}`;
};

export const buildRoute = (route) => {
  return `${window.location.origin}${route}`;
};