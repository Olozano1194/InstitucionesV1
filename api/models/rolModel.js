import mongoose from 'mongoose';

const RolModel = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del rol es requerido'],
        unique: true,
        trim: true,
        lowercase:true
    },
    descripcion: {
        type: String,
        required:false
    },
    permisos: [{
        type: String,
        enum: ['crear', 'leer', 'actualizar', 'eliminar']
    }],
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true    
});

export default mongoose.model('Rol', RolModel, 'roles');