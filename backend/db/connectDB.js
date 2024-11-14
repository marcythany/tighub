import mongoose from 'mongoose';

export default async function connectionMongoDB() {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log('Conectado a MongoDB');
	} catch (error) {
		console.log('Erro ao conectar a MongoDB', error.message);
	}
}
