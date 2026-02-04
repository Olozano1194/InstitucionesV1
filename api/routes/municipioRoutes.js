import express from 'express';
import { getMunicipios, getMunicipalityByDepartament } from '../controllers/municipioController.js';

const router = express.Router();

/**
 * @swagger
 * /api/municipios:
 *   get:
 *     summary: Obtiene todos los municipios
 *     tags: [Municipios]
 *     responses:
 *       200:
 *         description: Lista de municipios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Municipios'
 */
router.get('/', getMunicipios);

// 
router.get('/by-departamento', getMunicipalityByDepartament);

export default router;
