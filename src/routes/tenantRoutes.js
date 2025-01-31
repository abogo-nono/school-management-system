const express = require('express');
const {
    createTenant,
    getTenants,
    bulkCreateTenants,
    updateTenant,
    deleteTenant
} = require('../controllers/tenantController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public endpoint for tenant registration
router.post('/', createTenant);

// Protected admin routes
router.use(authMiddleware);
router.use(roleMiddleware(['super_admin']));

router.post('/bulk', bulkCreateTenants);
router.get('/', getTenants);
router.put('/:id', updateTenant);
router.delete('/:id', deleteTenant);

module.exports = router;