import Departamento from '../models/departamentoModel.js';

const getDepartamentos = async (req, res) => {
    try {
        const departamentos = await Departamento.find({}, 'id_departamento descripcion');
        res.status(200).json(departamentos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los departamentos', error });
    }
};

export default getDepartamentos;
