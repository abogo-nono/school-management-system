const express = require('express');
const {
    createStudent,
    getStudentsByClass,
    handleAdmission
} = require('../controllers/studentController');
const tenantMiddleware = require('../middlewares/tenantMiddleware');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/',
    tenantMiddleware,
    authMiddleware,
    roleMiddleware(['admin', 'registrar']),
    createStudent
);

router.get('/class/:class_id',
    tenantMiddleware,
    authMiddleware,
    roleMiddleware(['admin', 'teacher']),
    getStudentsByClass
);

router.put('/admission',
    tenantMiddleware,
    authMiddleware,
    roleMiddleware(['admin', 'registrar']),
    handleAdmission
);

module.exports = router;