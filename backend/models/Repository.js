import mongoose from 'mongoose';

// Definir o modelo de repositório
const repositorySchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Relacionamento com o usuário
		githubId: { type: String, required: true, unique: true },
		name: { type: String, required: true },
		description: { type: String },
		language: { type: String },
		forks_count: { type: Number, default: 0 },
		stars_count: { type: Number, default: 0 },
		created_at: { type: Date },
		updated_at: { type: Date },
	},
	{ timestamps: true } // Vai gerar createdAt e updatedAt automaticamente
);

const Repository = mongoose.model('Repository', repositorySchema);

export default Repository;
