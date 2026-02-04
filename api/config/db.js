import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// let cachedDb = null;

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        // cachedDb = true;
        console.log('Conectado a la base de datos MongoDB');
        return connection;
    } catch (error) {
        console.error('Error al conectar a la base de datos', error);
        //throw error;
        process.exit(1); 
    }
};

export const disconnectDB = async () => {
    await mongoose.disconnect().then(() => {
        console.log('Desconectado de la base de datos');
    }).catch((error) => {
        console.error('Error al desconectar de la base de datos', error);
    });

}

