import { usuariosService } from "../services/usuarios.service.js";

/**
 * Controlador de UI para Usuarios
 */
export const usuariosListUI = {
  validator: null, 

  /**
   * Inicializar formulario de registro
   */
  async initList() {
    const tbody = document.getElementById('usuariosTable');
    if (!tbody) {
      console.warn('Tabla de usuarios registrados no encontrada');
      return;
    }    
    try {
        const listUser = await usuariosService.list();
        this.renderTable(tbody, listUser);
    } catch (error) {
        console.error(error);
        this.showError('Error al cargar los usuarios');                
    }    
  },
  renderTable(tbody, usuarios) {
    tbody.innerHTML = '';

    if (usuarios.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="text-center">No hay usuarios</td>
        </tr>
      `;
      return;
    }
    usuarios.forEach((user, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="border-l-2 border-b-2 border-slate-700 px-4 py-2 text-center">${index + 1}</td>
        <td class="border-b-2 border-slate-700 px-4 py-2 text-center">${user.nombreCompleto}</td>
        <td class="border-b-2 border-slate-700 px-4 py-2 text-center">${user.email}</td>
        <td class="border-b-2 border-slate-700 px-4 py-2 text-center">${user.rol}</td>
        <td class="border-b-2 border-slate-700 px-4 py-2 text-center">
            <button data-id="${user.id}" class="text-sky-500 hover:scale-105"><i class="bi bi-pencil"></i></button>            
        </td>
        <td class="border-r-2 border-b-2 border-slate-700 px-4 py-2 text-center">
            <button data-id="${user.id}" class="text-red-500 hover:scale-105"><i class="bi bi-trash3"></i></button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  },
  showError(message) {
    console.error(message);
  }
};
// Auto-inicialización
document.addEventListener('DOMContentLoaded', () => {
  usuariosListUI.initList();
});