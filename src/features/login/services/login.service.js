import { usuariosAPI } from '../../usuarios/api/usuarios.api.js';
import { saveToken, saveUser, saveRole } from '../../../core/auth/session.js';
import { isNotEmpty, isValidEmail } from '../../../js/validations/validaciones.js';

export const loginService = {
  async login(email, password) {
    if (!isNotEmpty(email) || !isValidEmail(email)) {
      return { success: false, error: 'Email inválido' };
    }

    if (!isNotEmpty(password)) {
      return { success: false, error: 'La contraseña es requerida' };
    }

    try {
      const res = await usuariosAPI.login(email, password);
      saveToken(res.token);
      saveUser(res.user);
      saveRole(res.user.rol);
      return { success: true, user: res.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};