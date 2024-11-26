import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		githubId: {
			type: String,
			required: true,
			unique: true, // Garantir que o ID do GitHub seja único
		},
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		avatarUrl: {
			type: String,
			default: '', // Se não houver avatar, armazenar um valor vazio
		},
		accessToken: {
			type: String,
			default: '', // Pode ser útil para chamadas futuras à API do GitHub
		},
		repositories: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Repository', // Referência ao modelo de Repositório
			},
		],
	},
	{ timestamps: true }
);

// Criar o modelo baseado no schema
const User = mongoose.model('User', userSchema);

export default User;
