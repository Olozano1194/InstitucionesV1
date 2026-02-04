import Estudiantes from '../models/estudiantesModel.js';
import Profesor from '../models/profesorModel.js';
import Institucion from '../models/institucionModel.js';
import mongoose from 'mongoose';

// Obtener todas las instituciones
export const getInstituciones = async (req, res) => {
    try {
        const instituciones = await Institucion.find().sort({ createdAt: -1 })
        .populate('iddepartamento', 'descripcion')
        .populate('idmunicipio', 'descripcion')
        .populate('estudiantes', 'nombre apellido')
        .populate('profesores', 'nombre apellido especialidad');
        
        res.status(200).json(instituciones);
    } catch (error) {
        console.error('Error al obtener instituciones:', error);
        res.status(500).json({ message: error.message });
    }
};

// Crear una nueva institución
export const createInstitucion = async (req, res) => {
    try {
        const { estudiantes = [], profesores = [] } = req.body;
       
        if (!req.body.iddepartamento) {
            return res.status(400).json({ message: 'Departamento requerido' });
        }

        if (!req.body.idmunicipio) {
            return res.status(400).json({ message: 'Municipio requerido' });
        }

       
        // Validar que los Ids de estudiantes y profesores existentes
        if (estudiantes.length > 0) {
            const estudiantesValidados = await Estudiantes.find({
                _id: { $in: estudiantes }
            });
            if (estudiantesValidados.length !== estudiantes.length) {
                return res.status(400).json({ message: 'Algunos estudiantes seleccionados no existen' });
            }
        }

        if (profesores.length > 0) {
            const profesoresValidados = await Profesor.find({
                _id: { $in: profesores }
            });
            if (profesoresValidados.length !== profesores.length) {
                return res.status(400).json({ message: 'Algunos profesores seleccionados no existen' });
            }
        }
        
        const nuevaInstitucion = new Institucion({
            ...req.body,
            estudiantes,
            profesores
        });
        
        const institucionGuardada = await nuevaInstitucion.save();
        
        await institucionGuardada.populate([
            { path: 'estudiantes', select: 'nombre apellido' },
            { path: 'profesores', select: 'nombre apellido especialidad' }
        ]);
        res.status(201).json(institucionGuardada);
    } catch (error) {
        console.error('❌ Error al crear institución:', error);
        console.error('❌ Error name:', error.name);
        console.error('❌ Error message:', error.message);
        console.error('❌ Stack trace:', error.stack);
        res.status(400).json({ message: 'Error al crear la institución', error: error.message });
    }
};

// Obtener una institución por ID
export const getInstitucionById = async (req, res) => {
    try {
        const institucion = await Institucion.findById(req.params.id);
        if (!institucion) {
            return res.status(404).json({ message: 'Institución no encontrada' });
        }
        res.status(200).json(institucion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar una institución
export const updateInstitucion = async (req, res) => {
    try {
        const institucionActualizada = await Institucion.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!institucionActualizada) {
            return res.status(404).json({ message: 'Institución no encontrada' });
        }
        res.status(200).json(institucionActualizada);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar una institución
export const deleteInstitucion = async (req, res) => {
    try {
        const institucionEliminada = await Institucion.findByIdAndDelete(req.params.id);
        if (!institucionEliminada) {
            return res.status(404).json({ message: 'Institución no encontrada' });
        }
        res.status(200).json({ message: 'Institución eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};