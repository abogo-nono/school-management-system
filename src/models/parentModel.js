const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
    tenant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    }
}, {
    timestamps: {
        createdAt: 'created_at'
    }
});

module.exports = mongoose.model('Parent', parentSchema);