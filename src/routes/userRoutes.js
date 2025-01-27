const express = require('express');
const {
    registerUser,
    loginUser,
    getUsers,
    verifyEmail,
    forgotPassword,
    resetPassword
} = require('../controllers/userController');
const tenantMiddleware = require('../middlewares/tenantMiddleware');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', tenantMiddleware, registerUser);
router.post('/login', tenantMiddleware, loginUser);
router.get('/verify-email', tenantMiddleware, verifyEmail);
router.post('/forgot-password', tenantMiddleware, forgotPassword);
router.post('/reset-password', tenantMiddleware, resetPassword);
router.get('/',
    tenantMiddleware,
    authMiddleware,
    roleMiddleware(['admin']),
    getUsers
);

// Test
// console.log('curl -X POST -H "x-tenant-key: School Corp" -H "Content-Type: application/json" -d \'{"name": "John Doe", "email": "john.doe@example.com", "password": "UserPass123!", "role_id": "teacher_role_id", "avatar": "https://example.com/avatar.png"}\' http://localhost:3000/api/users/register');
// console.log('curl -X POST -H "x-tenant-key: School Corp" -H "Content-Type: application/json" -d \'{"email": "john.doe@example.com", "password": "UserPass123!"}\' http://localhost:3000/api/users/login');
// console.log('curl -X GET -H "x-tenant-key: School Corp" http://localhost:3000/api/users/verify-email?token=dummy_email_verification_token');
// console.log('curl -X POST -H "x-tenant-key: School Corp" -H "Content-Type: application/json" -d \'{"email": "john.doe@example.com"}\' http://localhost:3000/api/users/forgot-password');
// console.log('curl -X POST -H "x-tenant-key: School Corp" -H "Content-Type: application/json" -d \'{"token": "dummy_reset_token_from_email", "newPassword": "NewUserPass456!"}\' http://localhost:3000/api/users/reset-password');
// console.log('curl -X GET -H "x-tenant-key: School Corp" -H "Authorization: Bearer dummy_jwt_token" http://localhost:3000/api/users');

// curl -X POST -H "x-tenant-key: School Corp" -H "Content-Type: application/json" -d '{"name": "John Doe", "email": "john.doe@example.com", "password": "UserPass123!", "role_id": "teacher_role_id", "avatar": "https://example.com/avatar.png"}' http://localhost:3000/api/users/register
// curl -X POST -H "x-tenant-key: School Corp" -H "Content-Type: application/json" -d '{"email": "john.doe@example.com", "password": "UserPass123!"}' http://localhost:3000/api/users/login
// curl -X GET -H "x-tenant-key: School Corp" http://localhost:3000/api/users/verify-email?token=dummy_email_verification_token
// curl -X POST -H "x-tenant-key: School Corp" -H "Content-Type: application/json" -d '{"email": "john.doe@example.com"}' http://localhost:3000/api/users/forgot-password
// curl -X POST -H "x-tenant-key: School Corp" -H "Content-Type: application/json" -d '{"token": "dummy_reset_token_from_email", "newPassword": "NewUserPass456!"}' http://localhost:3000/api/users/reset-password
// curl -X GET -H "x-tenant-key: School Corp" -H "Authorization: Bearer dummy_jwt_token" http://localhost:3000/api/users

module.exports = router;