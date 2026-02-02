import { getDepartments, getMunicipalities } from '../../../api/locations.api.js';

export async function loadDepartments(select) {
  const departments = await getDepartments();
  select.innerHTML = departments.map(d =>
    `<option value="${d._id}">${d.name}</option>`
  ).join('');
}

export async function loadMunicipalities(select, departmentId) {
  const municipalities = await getMunicipalities(departmentId);
  select.innerHTML = municipalities.map(m =>
    `<option value="${m._id}">${m.name}</option>`
  ).join('');
}
