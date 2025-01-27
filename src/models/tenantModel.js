const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    contact_email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    phone_number: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    p_o_box: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: {
        createdAt: 'created_at'
    }
});

module.exports = mongoose.model('Tenant', tenantSchema);