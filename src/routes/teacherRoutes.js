const express = require('express');
const {
    createTeacher,
    assignSubjects,
    getTeachers
} = require('../controllers/teacherController');
const tenantMiddleware = require('../middlewares/tenantMiddleware');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/',
    tenantMiddleware,
    authMiddleware,
    roleMiddleware(['admin', 'department_head']),
    createTeacher
);

router.put('/assign-subjects',
    tenantMiddleware,
    authMiddleware,
    roleMiddleware(['admin', 'department_head']),
    assignSubjects
);

router.get('/',
    tenantMiddleware,
    authMiddleware,
    roleMiddleware(['admin', 'department_head', 'teacher']),
    getTeachers
);

module.exports = router;