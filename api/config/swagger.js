import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Opciones de configuración de Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Instituciones',
            version: '1.0.0',
            description: 'API para gestionar instituciones, estudiantes, profesores, etc.',
            contact: {
                name: "API Support",
                url: "http://localhost:5000",
                email: "support@api.com"
            }
        },
        servers: [
            {
                url: 'http://localhost:5000'
            }
        ]
    },
    apis: ['../api-instituciones/routes/*.js'], // Verifica que la ruta sea correcta
};

// Configuración de Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

export default setupSwagger;
