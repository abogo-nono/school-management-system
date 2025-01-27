const express = require('express');
const {
    createRole,
    getRoles,
    updateRole,
    deleteRole
} = require('../controllers/roleController');
const tenantMiddleware = require('../middlewares/tenantMiddleware');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/',
    tenantMiddleware,
    // authMiddleware,
    // roleMiddleware(['admin']),
    createRole
);

router.get('/',
    tenantMiddleware,
    // authMiddleware,
    // roleMiddleware(['admin']),
    getRoles
);

router.put('/:id',
    tenantMiddleware,
    // authMiddleware,
    // roleMiddleware(['admin']),
    updateRole
);

router.delete('/:id',
    tenantMiddleware,
    // authMiddleware,
    // roleMiddleware(['admin']),
    deleteRole
);

module.exports = router;