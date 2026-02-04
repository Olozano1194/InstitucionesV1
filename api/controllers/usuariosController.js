import Usuario from '../models/usuarioModel.js';
import Estudiante from '../models/estudiantesModel.js';
import Profesor from '../models/profesorModel.js';
import Admin from '../models/adminModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Rol from '../models/rolModel.js';
import mongoose from 'mongoose';
// const cloudinary = require('../config/cloudinary');
import fs from 'fs';
import path from 'path';

const fsp = fs.promises;


// Obtener todas los Usuarios
export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find().select('email rol').populate('rol', 'nombre').sort({ createdAt: -1 });        
        
        const usuariosFormateados = await Promise.all(
            usuarios.map(async (usuario) => {
                const estudiante = await Estudiante.findOne({ id_usuario: usuario._id }).select('nombre apellido');
                const profesor = await Profesor.findOne({ id_usuario: usuario._id }).select('nombre apellido');
                const admin = await Admin.findOne({ id_usuario: usuario._id }).select('nombre apellido');

                console.log(`Para usuario ${usuario.email}:`, estudiante);

                return {
                    _id: usuario._id,
                    email: usuario.email,
                    rol: usuario.rol?.nombre || 'No asignado',
                    nombre: estudiante?.nombre || profesor?.nombre || admin?.nombre || '',
                    apellido: estudiante?.apellido || profesor?.apellido || admin?.apellido || '',
                    // fotoPerfil: usuario.fotoPerfil || { url: '', publicId: '' },
                };
            })
        )
        res.status(200).json(usuariosFormateados);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear una nuevo Usuario
export const createUsuario = async (req, res) => {
    try {
        const { email, password, rol, nombre, apellido } = req.body;

        // Validaciones básicas
        if (!email || !password) {
            return res.status(400).json({ 
                message: "Email y contraseña son requeridos" 
            });
        }

        if (!rol) {
            return res.status(400).json({ 
                message: "El rol es requerido" 
            });
        }

        const rolExistente = await Rol.findOne({ 
            nombre: { $regex: new RegExp(`^${rol}$`, 'i') } // Case insensitive
        });

        if (!rolExistente) {
            return res.status(400).json({ 
                message: `El rol "${rol}" no existe. Roles válidos: admin, docente, estudiante` 
            });
        }

        // Verificar si el usuario ya existe
        const usuarioExiste = await Usuario.findOne({ email });
        if (usuarioExiste) {
            return res.status(400).json({ 
                message: "El email ya está registrado" 
            });
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        // Crear usuario con el ObjectId del rol encontrado
        const nuevoUsuario = new Usuario({
            nombre: nombre || '',
            apellido: apellido || '',
            email,
            password: hashedPass,
            rol: rolExistente._id, // ← Usar el ObjectId del rol encontrado
            idinstitucion: req.body.idinstitucion || null
        });

        const usuarioGuardado = await nuevoUsuario.save();

        // Generar token
        const token = jwt.sign(
            { id: usuarioGuardado._id }, 
            process.env.SECRET_KEY, 
            { expiresIn: '24h' }
        );

        // Crear perfil según rol
        const rolNombre = rolExistente.nombre.toLowerCase();
        if (rolNombre === 'estudiante') {
            await Estudiante.create({
                id_usuario: usuarioGuardado._id,
                nombre: nombre || '',
                apellido: apellido || '',
                fechanacimiento: req.body.fechanacimiento || new Date(),
                telefono: '',
                direccion: ''
            });
        } else if (rolNombre === 'docente') {
            await Profesor.create({
                id_usuario: usuarioGuardado._id,
                nombre: nombre || '',
                apellido: apellido || '',
                telefono: '',
                especialidad: '' 
            });
        } else if (rolNombre === 'admin') {
            await Admin.create({
                id_usuario: usuarioGuardado._id,
                nombre: nombre || '',
                apellido: apellido || '',
                telefono: '',
                cargo: ''
            });
        }

        res.status(201).json({
            message: "Usuario creado exitosamente",
            usuario: {
                id: usuarioGuardado._id,
                email: usuarioGuardado.email,
                nombre: usuarioGuardado.nombre,
                apellido: usuarioGuardado.apellido,
                rol: rolExistente.nombre,
            },
            token
        });

    } catch (error) {
        console.error('❌ Error al crear usuario:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({
                message: "El email ya está registrado"
            });
        }

        res.status(500).json({
            message: "Error al crear el usuario",
            details: error.message
        });   
    }
};

// Obtener un Usuario por ID
export const getUsuarioById = async (req, res) => {
    try {
        const userId = req.user.id;
        const usuario = await Usuario.findById(userId)
         .populate('rol', 'nombre');        
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json({
            user: {
                id: usuario._id,
                // nombre: usuario.nombre,
                // apellido: usuario.apellido,
                email: usuario.email,                
                rol: usuario.rol,
                fotoPerfil: usuario.fotoPerfil,
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un Usuario
export const updateUsuario = async (req, res) => {
    // console.log('Inicio de actualización');
    const { id } = req.params;
    const updates = req.body;
    const file = req.file;
    // console.log('Id:', id);        
    // console.log('Datos recibidos:', updates);
    // console.log('Archivo recibido:', file);
        
    try {
        const usuario = await Usuario.findById(id);
        if (!usuario) {
        if (file) {
            try { await fsp.unlink(file.path); } catch(_) {}
        }
        return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (file) {
        const oldPublicId = usuario.fotoPerfil?.publicId;
        if (oldPublicId) {
            const oldPath = path.join(__dirname, '..', 'uploads', oldPublicId);
            try {
            await fsp.unlink(oldPath);
            // console.log('Archivo anterior eliminado:', oldPath);
            } catch (err) {
            if (err.code !== 'ENOENT') {
                console.error('Error eliminando anterior:', err);
            } else {
                console.log('No existía archivo anterior:', oldPath);
            }
            }
        }

        updates.fotoPerfil = {
            url: `/uploads/${file.filename}`,
            publicId: file.filename
        };
        // console.log('Imagen guardada localmente:', updates.fotoPerfil);
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
        );

        return res.json({
        message: 'Usuario actualizado correctamente',
        usuario: usuarioActualizado
        });
    } catch (error) {
        console.error('❌ Error general updateUsuario:', error);
        if (file) {
        try { await fsp.unlink(file.path); } catch(_) {}
        }
        return res.status(400).json({
        message: 'Error al actualizar usuario',
        error: error.message
        });
    }        
};

// Eliminar un Usuario
export const deleteUsuario = async (req, res) => {
    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuarioEliminado) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Iniciar sesión
export const loginUsuario = async (req, res) => {
    //console.log('Datos recibidos en el login:', req.body);    
    const { email, password } = req.body;
    
    try {
        //Verficamos si el usuario existe
        const usuario = await Usuario.findOne({ email }).populate('rol', 'nombre');
        if  (!usuario) {
            return res.status(404).json({ message: 'Credenciales inválidas' });
        }
        
        //Verificamos si la contraseña es correcta
        const isValidPassword = await bcrypt.compare(password,  usuario.password);        
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }
        //Generamos un token de acceso
        const token = jwt.sign({ 
            id: usuario._id, rol: usuario.rol?.nombre },
            process.env.SECRET_KEY, { expiresIn: '24h' });

        res.status(200).json({ 
            message: 'Inicio de sesión exitoso', 
            token,
            user: {
                rol: usuario.rol?.nombre
            } 
        });

    }catch (err) {
        res.status(500).json({ 
            message: 'Error en el servidor',
            error: err.message 
        });
    }
}