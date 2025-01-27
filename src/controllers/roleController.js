const Role = require('../models/roleModel');

exports.createRole = async (req, res) => {
    try {
        const { name, description } = req.body;
        const role = new Role({
            name,
            description,
            tenant_id: req.tenant._id
        });
        await role.save();
        res.status(201).json(role);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getRoles = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = ''
        } = req.query;

        const query = {
            tenant_id: req.tenant._id,
            ...(search && { name: { $regex: search, $options: 'i' } })
        };

        const roles = await Role.find(query)
            .limit(Number(limit))
            .skip((page - 1) * limit)
            .sort({ created_at: -1 });

        const total = await Role.countDocuments(query);

        res.json({
            roles,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            totalRoles: total
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateRole = async (req, res) => {
    try {
        const { name, description } = req.body;
        const role = await Role.findOneAndUpdate(
            { _id: req.params.id, tenant_id: req.tenant._id },
            { name, description },
            { new: true, runValidators: true }
        );

        if (!role) {
            return res.status(404).json({ error: 'Role not found' });
        }

        res.json(role);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteRole = async (req, res) => {
    try {
        const role = await Role.findOneAndDelete({
            _id: req.params.id,
            tenant_id: req.tenant._id
        });

        if (!role) {
            return res.status(404).json({ error: 'Role not found' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};