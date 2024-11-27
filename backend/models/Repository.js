import mongoose from 'mongoose';

// Definir o modelo de repositório
const repositorySchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Relacionamento com o usuário
        githubId: { type: String, required: true },
        fullName: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        description: { type: String },
        language: { type: String },
        forks_count: { type: Number, default: 0 },
        stars_count: { type: Number, default: 0 },
        created_at: { type: Date },
        updated_at: { type: Date },
        url: { type: String },
        likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Users who liked this repo
    },
    { timestamps: true } // Vai gerar createdAt e updatedAt automaticamente
);

// Helper method to check if a user has liked this repository
repositorySchema.methods.isLikedBy = function(userId) {
    return this.likedBy.includes(userId);
};

const Repository = mongoose.model('Repository', repositorySchema);

export default Repository;
