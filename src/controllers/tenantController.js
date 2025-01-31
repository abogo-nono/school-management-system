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

exports.getTenants = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', status = '' } = req.query;
        
        const query = {
            ...(search && {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { contact_email: { $regex: search, $options: 'i' } }
                ]
            }),
            ...(status && { status })
        };

        const [tenants, total] = await Promise.all([
            Tenant.find(query)
                .sort({ created_at: -1 })
                .limit(Number(limit))
                .skip((page - 1) * limit)
                .lean(),
            Tenant.countDocuments(query)
        ]);

        res.json({
            tenants,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            totalTenants: total
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.bulkCreateTenants = async (req, res) => {
    try {
        const tenants = req.body.tenants;
        if (!Array.isArray(tenants)) {
            return res.status(400).json({ error: 'Invalid tenants array format' });
        }

        const results = await Promise.all(
            tenants.map(async (tenantData) => {
                try {
                    const existing = await Tenant.findOne({
                        $or: [
                            { contact_email: tenantData.contact_email },
                            { phone_number: tenantData.phone_number }
                        ]
                    });
                    
                    if (!existing) {
                        const tenant = new Tenant(tenantData);
                        await tenant.save();
                        return { success: true, tenant };
                    }
                    return { 
                        success: false, 
                        error: 'Conflict', 
                        data: tenantData 
                    };
                } catch (error) {
                    return { 
                        success: false, 
                        error: error.message, 
                        data: tenantData 
                    };
                }
            })
        );

        res.status(207).json({
            message: 'Bulk create completed with partial success',
            results
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateTenant = async (req, res) => {
    try {
        const tenant = await Tenant.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        res.json({
            message: 'Tenant updated successfully',
            tenant
        });

    } catch (error) {
        res.status(400).json({ 
            error: error.message,
            validation: error.errors 
        });
    }
};

exports.deleteTenant = async (req, res) => {
    try {
        const tenant = await Tenant.findByIdAndDelete(req.params.id);
        
        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        res.status(204).send();

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};