/**
 * Utilidades de UI reutilizables
 * Estas funciones se usan en CUALQUIER módulo
 */

export function showMessage(message, type = 'success') {
  let container = document.getElementById('message-container');

  // Crear contenedor si no existe
  if (!container) {
    container = document.createElement('div');
    container.id = 'message-container';
    container.className = 'fixed top-4 right-4 z-50';
    document.body.appendChild(container);
  }

  // Crear mensaje
  const messageEl = document.createElement('div');
  messageEl.className = `
    p-4 rounded-lg shadow-lg mb-2 text-white font-medium
    transition-all duration-300
    ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}
  `;
  messageEl.textContent = message;
  container.appendChild(messageEl);

  // Auto-eliminar después de 3 segundos
  setTimeout(() => {
    messageEl.style.opacity = '0';
    messageEl.style.transform = 'translateY(-10px)';
    setTimeout(() => messageEl.remove(), 300);
  }, 3000);
}

export function setLoading(button, isLoading, {
  loadingText = 'Procesando...',
  defaultText = 'Registrarse',
  defaultIcon = 'bi bi-box-arrow-in-right',
} = {}) {
  if (!button) return;

  button.disabled = isLoading;

  if (isLoading) {
    button.innerHTML = `<i class="bi bi-arrow-repeat animate-spin"></i> ${loadingText}`;
    button.classList.add('opacity-50', 'cursor-not-allowed');
  } else {
    button.innerHTML = `<i class="${defaultIcon}"></i> ${defaultText}`;
    button.classList.remove('opacity-50', 'cursor-not-allowed');
  }
}