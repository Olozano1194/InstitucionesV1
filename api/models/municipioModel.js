import mongoose from 'mongoose';
// const Departamentos = require('./departamentoModel') 

const MunicipioModel = new mongoose.Schema({
    id_municipio: {
        type: String,
        required: true,
        unique: true
    },
    descripcion: {
        type: String,
        required: true
    },
    id_departamento: {
        type: String,
        required: true
    }
});

export default mongoose.model('Municipio', MunicipioModel);
