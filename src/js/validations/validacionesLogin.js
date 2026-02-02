import { isNotEmpty, isValidEmail, isValidPassword } from './validaciones.js';

/**
 * Valida el formulario de login completo
 * @param {string} email 
 * @param {string} password 
 * @returns {Object} { isValid, errors }
 */
export function validateLoginForm(email, password) {
  const errors = [];

  // Validar email
  if (!isNotEmpty(email)) {
    errors.push('El email es obligatorio');
  } else if (!isValidEmail(email)) {
    errors.push('El formato del email no es válido');
  }

  // Validar contraseña
  if (!isNotEmpty(password)) {
    errors.push('La contraseña es obligatoria');
  } else if (!isValidPassword(password)) {
    errors.push('La contraseña debe tener al menos 8 caracteres, una mayúscula y un número');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}