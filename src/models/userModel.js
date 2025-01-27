const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    tenant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    emailVerificationToken: {
        type: String
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpiry: {
        type: Date
    },
    lastLogin: {
        type: Date
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date
    }
}, {
    timestamps: {
        createdAt: 'created_at'
    }
});

// Add index for email verification and password reset
userSchema.index({
    emailVerificationToken: 1,
    passwordResetToken: 1
});

module.exports = mongoose.model('User', userSchema);