const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const ValidationHelper = require('../utils/validationHelpers');
const EmailService = require('../utils/emailService');
const Tenant = require('../models/tenantModel');

// Email Configuration
// const transporter = nodemailer.createTransport({
//     // service: 'gmail',
//     // auth: {
//     //     user: process.env.EMAIL_USER,
//     //     pass: process.env.EMAIL_PASS
//     // }


//     // new config for local test
//     host: 'localhost', // Use localhost for Mailpit
//     port: 1025, // Port for Mailpit
//     secure: false // Use false for STARTTLS
// });

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role_id, avatar } = req.body;

        // Sanitize inputs
        ValidationHelper.sanitizeInput(req.body.name);
        ValidationHelper.sanitizeInput(req.body.email);

        // Validate inputs
        ValidationHelper.validateEmail(req.body.email);
        ValidationHelper.validatePassword(req.body.password);

        const existingUser = await User.findOne({
            email,
            tenant_id: req.tenant._id
        });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate email verification token
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role_id,
            avatar,
            tenant_id: req.tenant._id,
            emailVerificationToken,
            isEmailVerified: false
        });

        await user.save();

        // Send verification email
        await EmailService.sendVerificationEmail(email, emailVerificationToken);

        res.status(201).json({ message: 'User registered. Please verify your email.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        const user = await User.findOne({ emailVerificationToken: token });

        if (!user) {
            return res.status(400).json({ error: 'Invalid verification token' });
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        await user.save();

        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const tenantKey = req.headers['x-tenant-key'] || req.subdomains[0];
        const tenant = await Tenant.findOne({ name: tenantKey });
        // console.log(tenant.id);

        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        const user = await User.findOne({
            email,
            tenant_id: tenant.id
        }).populate('role_id');

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, tenantId: tenant.id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );
        console.log(user);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            status = '',
            role = ''
        } = req.query;

        const query = {
            tenant_id: req.tenant._id,
            ...(search && { name: { $regex: search, $options: 'i' } }),
            ...(status && { status }),
            ...(role && { role_id: role })
        };

        const users = await User.find(query)
            .populate('role_id')
            .limit(Number(limit))
            .skip((page - 1) * limit)
            .sort({ created_at: -1 });

        const total = await User.countDocuments(query);

        res.json({
            users,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            totalUsers: total
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({
            email,
            tenant_id: req.tenant._id
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour

        user.passwordResetToken = resetToken;
        user.passwordResetExpiry = resetTokenExpiry;
        await user.save();

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            html: `Click <a href="${resetLink}">here</a> to reset your password`
        });

        res.json({ message: 'Password reset link sent' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.passwordResetToken = undefined;
        user.passwordResetExpiry = undefined;
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};