export function isNotEmpty(value) {
  return value.trim().length > 0;
}

/**
 * Valida formato de email
 */
export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

/**
 * Valida contraseña segura
 * Al menos 6 caracteres, una mayúscula, una minúscula y un número
 */
export function isValidPassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  return regex.test(password);
}

/**
 * Valida que dos valores sean iguales (para confirmar contraseña)
 */
export function arePasswordsMatching(password, confirmPassword) {
  return password === confirmPassword && password.length > 0;
}

/**
 * Valida que se haya seleccionado una opción en un select
 */
export function isValidSelection(value) {
  return value !== '' && value !== null && value !== undefined;
}

/**
 * Valida que un valor sea numérico
 */
export function isNumeric(value) {
  return !isNaN(value) && value.trim() !== '';
}