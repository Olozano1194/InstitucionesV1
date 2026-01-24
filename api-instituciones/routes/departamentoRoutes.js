import express from 'express';
import getDepartamentos from '../controllers/departamentoController.js';

const router = express.Router();

/**
 * @swagger
 * /api/departamentos:
 *   get:
 *     summary: Obtiene todos los departamentos
 *     tags: [Departamentos]
 *     responses:
 *       200:
 *         description: Lista de departamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Departamentos'
 */
router.get('/', getDepartamentos);

export default router;
