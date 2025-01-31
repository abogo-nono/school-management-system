const Tenant = require('../models/tenantModel');
const ValidationHelper = require('../utils/validationHelpers');

exports.createTenant = async (req, res) => {
    try {
        const { name, contact_email, phone_number, address, p_o_box, logo } = req.body;

        // Validate inputs using your existing helpers
        await ValidationHelper.validateTenantName(name);
        ValidationHelper.validateEmail(contact_email);
        ValidationHelper.validatePhoneNumber(phone_number);
        ValidationHelper.validatePOBox(p_o_box);

        // Check for existing tenant
        const existingTenant = await Tenant.findOne({
            $or: [
                { contact_email },
                { phone_number },
                { name: { $regex: new RegExp(`^${name}$`, 'i') } }
            ]
        });
        
        if (existingTenant) {
            return res.status(409).json({
                error: 'Tenant already exists',
                conflictField: existingTenant.contact_email === contact_email ? 'email' : 
                             existingTenant.phone_number === phone_number ? 'phone' : 'name'
            });
        }

        const tenant = new Tenant(req.body);
        await tenant.save();

        res.status(201).json({
            message: 'Tenant created successfully',
            tenant: tenant.toJSON()
        });

    } catch (error) {
        res.status(400).json({
            error: error.message,
            validation: error.errors
        });
    }
};