import mongoose from 'mongoose';

const DepartamentoModel = new mongoose.Schema({
    id_departamento: {
        type: String,
        required: true,
        unique: true
    },
    descripcion: {
        type: String,
        required: true
    }
});

const Departamento = mongoose.model('Departamento', DepartamentoModel);
export default Departamento;
