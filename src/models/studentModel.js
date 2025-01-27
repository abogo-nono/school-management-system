const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
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
    class_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    },
    parent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Parent'
    },
    enrollment_number: {
        type: String,
        required: true,
        unique: true
    },
    date_of_birth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    admission_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'alumni', 'transferred'],
        default: 'active'
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

// Indexes for common queries
studentSchema.index({ tenant_id: 1, enrollment_number: 1 });
studentSchema.index({ class_id: 1 });
studentSchema.index({ parent_id: 1 });

module.exports = mongoose.model('Student', studentSchema);