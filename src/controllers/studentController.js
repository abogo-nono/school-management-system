const Student = require('../models/studentModel');
const User = require('../models/userModel');
const ValidationHelper = require('../utils/validationHelpers');

exports.createStudent = async (req, res) => {
    try {
        const { user_id, class_id, parent_id, enrollment_number, date_of_birth, gender } = req.body;

        // Validate inputs
        ValidationHelper.sanitizeInput(enrollment_number);
        ValidationHelper.validateDate(date_of_birth);
        [gender, user_id, class_id, parent_id].forEach(ValidationHelper.sanitizeInput);

        // Check user exists in same tenant
        const user = await User.findOne({
            _id: user_id,
            tenant_id: req.tenant._id
        });
        if (!user) throw new Error('User not found in tenant');

        const student = new Student({
            tenant_id: req.tenant._id,
            user_id,
            class_id,
            parent_id,
            enrollment_number,
            date_of_birth,
            gender
        });

        await student.save();
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getStudentsByClass = async (req, res) => {
    try {
        const { class_id } = req.params;
        const { page = 1, limit = 30 } = req.query;

        const students = await Student.find({
            tenant_id: req.tenant._id,
            class_id
        })
            .populate('user_id', 'name email')
            .populate('parent_id', 'phone_number')
            .limit(Number(limit))
            .skip((page - 1) * limit);

        const total = await Student.countDocuments({
            tenant_id: req.tenant._id,
            class_id
        });

        res.json({
            students,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            totalStudents: total
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.handleAdmission = async (req, res) => {
    try {
        const { student_id, status } = req.body;
        
        const student = await Student.findOneAndUpdate(
            { 
                _id: student_id,
                tenant_id: req.tenant._id 
            },
            { status },
            { new: true, runValidators: true }
        );

        if (!student) throw new Error('Student not found');
        
        // todo: Send admission status email
        res.json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};