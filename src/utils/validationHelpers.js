const validator = require('validator');

class ValidationHelper {
    static validateEmail(email) {
        // this.sanitizeInput(email);
        if (!validator.isEmail(email)) {
            throw new Error('Invalid email format');
        }
    }

    static validatePhoneNumber(phoneNumber) {
        if (!validator.isMobilePhone(phoneNumber)) {
            throw new Error('Invalid phone number format');
        }
    }
    
    static validateSubjectIds(subjectIds) {
        if (!Array.isArray(subjectIds) || !subjectIds.every(id => validator.isMongoId(id))) {
            throw new Error('Invalid subject IDs format');
        }
    }

    static validatePOBox(pOBox) {
        if (!validator.isNumeric(pOBox)) {
            throw new Error('Invalid PO Box format');
        }
    }

    static validatePassword(password) {
        if (!validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })) {
            throw new Error('Password does not meet strength requirements');
        }
    }

    static sanitizeInput(input) {
        return validator.escape(input.trim());
    }

    static validateTenantName(name) {
        this.sanitizeInput(name);
        if (!name || name.length < 2 || name.length > 50) {
            throw new Error('Tenant name must be between 2 and 50 characters');
        }
    }
}

module.exports = ValidationHelper;