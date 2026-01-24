import express from 'express';
import {
    getRoles,
    getRolById,
    createRol,
    updateRol,
    deleteRol
} from '../controllers/rolController.js';
import protegerRutas from '../middleware/proteccionRutas/authMiddleware.js';

const router = express.Router();

// Rutas publicas
router.get('/', getRoles);

// Rutas protegidas
router.get('/:id', getRolById);
router.post('/', protegerRutas, createRol);
router.put('/:id', protegerRutas, updateRol);
router.delete('/:id', protegerRutas, deleteRol);

export default router;