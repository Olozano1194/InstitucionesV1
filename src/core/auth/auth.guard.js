import { isAuthenticated } from '../core/session';

export function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = '/login.html';
  }
}

/**
 * La estructura del proyecto es la siguiente:
 * InstitucionesV1
 *                /api-instituciones
 *                         /config(db.js, swagger)
 *                         /controllers(adminController.js,      departamentos.js, estudiantes, instituciones, municipio, rol, profesores, usuarios)
 *                         /middleware(protecccionRutas, initDepartemento, initMunicipio, initRoles, upload.js)
 *                         /model(schemas(todos los schemas correspondientes), adminModel.js, departementos, estudiantes,intituciones, etc)
 *                         /routes
 *                          package.json
 *               src(front)
 *                   /core(api(api.js), auth(session.js), config))
 *                   /css(importaciones de tailwind)
 *                   /js(features(locations(selectors.js)), validations(validacionesEntidades, usuarios, login))
 *                   /pages(admin(home.html, listarEntidades, listarUsuarios), auth(entidades(actualizar, register), usuarios(update, register), login.html, registerDocntes, registerEstudiantes))
 *                    /shared(components(Buton.js, Card.js, header.js, loader, menuToggle, Model, sideba, Table), utils(helpers))
 *                   
 *                                  
 */
