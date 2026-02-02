import { loginService } from '../services/login.service.js';
import { FormValidator } from '../../../js/validations/formValidator.js';
import { config } from '../../../core/config.js';

export const loginUI = {
  init() {
    const form = document.getElementById('login');
    if (!form) return;

    this.validator = new FormValidator('login', 'login');
    this.validator.setSubmitButton('btn');
    this.validator.init();

    form.addEventListener('submit', e => this.handleSubmit(e));
  },

  async handleSubmit(e) {
    e.preventDefault();

    if (!this.validator.validateAll()) return;

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const button = document.getElementById('btn');

    button.disabled = true;
    button.textContent = 'Cargando...';

    const result = await loginService.login(email, password);

    button.disabled = false;
    button.textContent = 'Iniciar Sesión';

    if (result.success) {
      window.location.href = config.routes.dashboards[result.user.rol];
    } else {
      this.showError(result.error);
    }
  },

  showError(message) {
    const error = document.getElementById('error-message');
    error.textContent = message;
    error.classList.remove('hidden');
  }
};

document.addEventListener('DOMContentLoaded', () => loginUI.init());

