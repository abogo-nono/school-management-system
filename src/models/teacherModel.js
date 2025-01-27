const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
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
    specialization_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specialization',
        required: true
    },
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    phone_number: {
        type: String,
        required: true
    },
    hire_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    assigned_subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    }]
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

// Indexes for common queries
teacherSchema.index({ tenant_id: 1, user_id: 1 });
teacherSchema.index({ specialization_id: 1 });
teacherSchema.index({ status: 1 });

module.exports = mongoose.model('Teacher', teacherSchema);