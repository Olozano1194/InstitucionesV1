import mongoose from 'mongoose';

const ProfesorSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,    
    id_usuario: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Usuario', 
            required: true
    },
    telefono: String,
    especialidad: String,
    },
    { timestamps: true     
  
});

export default mongoose.model('Profesor', ProfesorSchema, 'profesores');