const Tenant = require('../models/tenantModel');

/**
 * Tenant middleware to identify the tenant making the request and
 * store the tenant object in the request context.
 *
 * The middleware extracts the tenant identifier from the request headers
 * (using the `x-tenant-key` header) or from the URL subdomains.
 *
 * If the tenant identifier is not present, it returns a 400 error.
 *
 * If the tenant is not found, it returns a 404 error.
 *
 * If the tenant is found, it stores the tenant object in the request context
 * and calls the next middleware in the stack.
 *
 * If an error occurs, it returns a 500 error.
 */
const tenantMiddleware = async (req, res, next) => {
    // Extract tenant identifier (can be from subdomain, header, etc.)
    const tenantKey = req.headers['x-tenant-key'] || req.subdomains[0];
    // console.log(tenantKey);

    if (!tenantKey) {
        return res.status(400).json({ error: 'Tenant identification required' });
    }

    try {
        const tenant = await Tenant.findOne({
            name: tenantKey,
            status: 'active'
        });

        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        req.tenant = tenant;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Tenant identification failed' });
    }
};

module.exports = tenantMiddleware;