import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import cors from 'cors';
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
// Middlewares de inicialización
import initRoles from './middleware/initRoles.js';
import getDepartamentos from './middleware/initDepartamento.js';
import getMunicipio from './middleware/initMunicipio.js';
// Definir rutas
import institucionRoutes from './routes/institucionRoutes.js';
import departamentoRoutes from './routes/departamentoRoutes.js';
import municipioRoutes from './routes/municipioRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import rolRoutes from './routes/rolRoutes.js';
import estudianteRoutes from './routes/estudianteRoutes.js';
import profesorRoutes  from './routes/profesorRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();
const app = express();

await connectDB();

// Conectar a la base de datos
// connectDB();

// Middleware para analizar JSON
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));

// Configuración de CORS
const corsOptions = {
    origin: ['http://localhost:8000', 'https://instituciones-v1.vercel.app'],
    credentials: true,
    optionsSuccessStatus: 200
};

//Habilitar Cors
app.use(cors(corsOptions));


// Middleware para manejar errores
app.use((req, res, next) => {
    console.log(`\n🔵 ${req.method} ${req.url}`);
    if (req.method === 'POST' || req.method === 'PUT') {
        console.log('📦 Body:', req.body);
    }
    next();
});

// Rutas
//Ruta para las instituciones
app.use('/api/instituciones', institucionRoutes);
//Ruta para los departamentos
app.use('/api/departamentos', departamentoRoutes);
//Ruta para los municipios
app.use('/api/municipios', municipioRoutes);
//Rutas para los usuarios
app.use('/api/usuario', usuarioRoutes);
//Rutas para los roles
app.use('/api/roles', rolRoutes);
// Rutas para los estudiantes
app.use('/api/estudiante', estudianteRoutes);
// Rutas para los profesores
app.use('/api/profesor', profesorRoutes);
// Rutas para los administradores
app.use('/api/admin', adminRoutes);

// Configuración de swagger-jsdoc
const swaggerOptions = {
    definition: {
        openapi: "3.0.0", 
        info: {
            title: "API de Instituciones Educativas",
            version: "1.0.0",
            description: "Documentación de la API para gestionar instituciones educativas",
        },
        servers: [
            {
                url: (`http://localhost:${process.env.PORT || 5000}`, `https://instituciones-v1.vercel.app`),
            },
        ],
    },
    apis: ["./routes/*.js", "./models/schemas/*.js"]
};

// Iniciar Swagger en el puerto 5000
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Servir documentación Swagger en /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const runInitializations = async () => {
    try {
        if (!process.env.VERCEL) {
            const PORT = process.env.PORT || 5000;
            await initRoles();
            await getDepartamentos();
            await getMunicipio();
            app.listen(PORT, () => {
                console.log(`Servidor corriendo en http://localhost:${PORT}`);
            });
        }
    } catch (error) {
        console.error('Error inicializando datos:', error);
        process.exit(1);
    };
};
runInitializations();

// Exportar app para vercel
export default app;