const express = require('express');
const { createParent, getParents } = require('../controllers/parentController');
const tenantMiddleware = require('../middlewares/tenantMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/',
    tenantMiddleware,
    authMiddleware,
    createParent
);

router.get('/',
    tenantMiddleware,
    authMiddleware,
    getParents
);

module.exports = router;