const express = require('express');
const {
    createTenant,
    bulkCreateTenants,
    getTenants,
    // getTenant,
    updateTenant,
    // bulkUpdateTenants,
    // deleteTenant,
    // bulkDeleteTenants
} = require('../controllers/tenantController');

const router = express.Router();

router.post('/', createTenant);
router.post('/bulk', bulkCreateTenants);
router.get('/', getTenants);
// router.get('/:id', getTenant);
router.put('/:id', updateTenant);
// router.put('/', bulkUpdateTenants);
// router.delete('/:id', deleteTenant);
// router.delete('/', bulkDeleteTenants);

module.exports = router;