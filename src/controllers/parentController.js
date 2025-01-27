const Parent = require('../models/parentModel');
const ValidationHelper = require('../utils/validationHelpers');

exports.createParent = async (req, res) => {
    try {
        const { user_id, phone_number, email } = req.body;

        // Validation
        ValidationHelper.validateEmail(email);
        ValidationHelper.validatePhoneNumber(phone_number);
        [user_id, phone_number, email].forEach(ValidationHelper.sanitizeInput);

        const parent = new Parent({
            tenant_id: req.tenant._id,
            user_id,
            phone_number,
            email
        });

        await parent.save();
        res.status(201).json(parent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getParents = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        
        const query = {
            tenant_id: req.tenant._id,
            ...(search && { 
                $or: [
                    { email: { $regex: search, $options: 'i' } },
                    { phone_number: { $regex: search, $options: 'i' } }
                ]
            })
        };

        const parents = await Parent.find(query)
            .populate('user_id')
            .limit(Number(limit))
            .skip((page - 1) * limit);

        const total = await Parent.countDocuments(query);

        res.json({
            parents,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            totalParents: total
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};