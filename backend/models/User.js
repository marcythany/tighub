import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        githubId: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            default: '',
        },
        avatarUrl: {
            type: String,
            default: '',
        },
        accessToken: {
            type: String,
            default: '',
        },
        repositories: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Repository',
        }],
        likedRepositories: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Repository',
        }],
        likedProfiles: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        likedBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        lastLogin: {
            type: Date,
            default: Date.now,
        }
    },
    {
        timestamps: true,
    }
);

// Índices compostos para melhor performance
userSchema.index({ githubId: 1, username: 1 });
userSchema.index({ likedProfiles: 1 });
userSchema.index({ likedBy: 1 });
userSchema.index({ likedRepositories: 1 });

// Helper method to check if there's a mutual like
userSchema.methods.hasMutualLike = function(userId) {
    return this.likedProfiles.includes(userId) && this.likedBy.includes(userId);
};

// Helper method to get all mutual likes
userSchema.methods.getMutualLikes = async function() {
    return this.model('User').find({
        _id: { $in: this.likedProfiles },
        likedProfiles: this._id
    });
};

// Método estático para criar ou atualizar usuário
userSchema.statics.findOrCreateFromGitHub = async function(profile, accessToken) {
    try {
        // Primeiro, tenta encontrar por githubId
        let user = await this.findOne({ githubId: profile.id });
        
        if (user) {
            // Atualiza informações existentes
            user.username = profile.username;
            user.email = profile._json.email;
            user.avatarUrl = profile._json.avatar_url;
            user.accessToken = accessToken;
            user.lastLogin = new Date();
            await user.save();
            return user;
        }

        // Se não encontrar, cria novo usuário
        user = await this.create({
            githubId: profile.id,
            username: profile.username,
            email: profile._json.email,
            avatarUrl: profile._json.avatar_url,
            accessToken: accessToken,
            likedProfiles: [],
            likedBy: [],
            likedRepositories: []
        });

        return user;
    } catch (error) {
        if (error.code === 11000) {
            // Se houver conflito de username, adiciona um sufixo único
            const suffix = Math.random().toString(36).substring(2, 7);
            return this.findOrCreateFromGitHub({
                ...profile,
                username: `${profile.username}_${suffix}`
            }, accessToken);
        }
        throw error;
    }
};

const User = mongoose.model('User', userSchema);

export default User;
