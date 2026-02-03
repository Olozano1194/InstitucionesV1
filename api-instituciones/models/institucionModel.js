import mongoose from 'mongoose';


const PeriodoSchema = new mongoose.Schema({
    idperiodo: mongoose.Schema.Types.ObjectId,
    nombre: String,
    fechainicio: Date,
    fechafin: Date,
});

const InstitucionSchema = new mongoose.Schema({
    nombre: String,
    direccion: String,
    telefono: String,
    email: String,
    director: String,
    iddepartamento: { type: String, required: true },
    idmunicipio: { type: String, required: true }, 
    // estado: String,
    idsecretaria: mongoose.Schema.Types.ObjectId,
    nosedes: Number,
    estudiantes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Estudiante' }],
    profesores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profesor' }],
    periodos: [PeriodoSchema] 
}, {
    timestamps: true
});

export default mongoose.model('Institucion', InstitucionSchema, 'instituciones');