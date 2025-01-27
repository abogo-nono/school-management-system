const Teacher = require('../models/teacherModel');
const User = require('../models/userModel');
const ValidationHelper = require('../utils/validationHelpers');

exports.createTeacher = async (req, res) => {
    try {
        const { user_id, specialization_id, first_name, last_name, phone_number } = req.body;

        // Validation
        ValidationHelper.validatePhoneNumber(phone_number);
        [first_name, last_name].forEach(ValidationHelper.sanitizeInput);

        // Verify user exists in tenant
        const user = await User.findOne({
            _id: user_id,
            tenant_id: req.tenant._id
        });
        if (!user) throw new Error('User not found in tenant');

        const teacher = new Teacher({
            tenant_id: req.tenant._id,
            user_id,
            specialization_id,
            first_name,
            last_name,
            phone_number
        });

        await teacher.save();
        res.status(201).json(teacher);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.assignSubjects = async (req, res) => {
    try {
        const { teacher_id, subject_ids } = req.body;
        
        const teacher = await Teacher.findOneAndUpdate(
            { 
                _id: teacher_id,
                tenant_id: req.tenant._id 
            },
            { $addToSet: { assigned_subjects: { $each: subject_ids } } },
            { new: true, runValidators: true }
        );

        if (!teacher) throw new Error('Teacher not found');
        res.json(teacher);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getTeachers = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search = '',
            status = 'active',
            specialization 
        } = req.query;

        const query = {
            tenant_id: req.tenant._id,
            status,
            ...(search && {
                $or: [
                    { first_name: { $regex: search, $options: 'i' } },
                    { last_name: { $regex: search, $options: 'i' } }
                ]
            }),
            ...(specialization && { specialization_id: specialization })
        };

        const teachers = await Teacher.find(query)
            .populate('user_id', 'name email')
            .populate('specialization_id', 'name')
            .limit(Number(limit))
            .skip((page - 1) * limit);

        const total = await Teacher.countDocuments(query);

        res.json({
            teachers,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            totalTeachers: total
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};