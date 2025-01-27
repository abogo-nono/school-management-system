# Multi-Tenant School Management System

A comprehensive school management system built with Node.js, Express, and MongoDB, featuring multi-tenancy support, role-based access control, and robust API endpoints for managing academic operations.

## Features

- **Multi-Tenant Architecture**: Separate data isolation for different schools/organizations
- **Role-Based Access Control**: Granular permissions for admin, teachers, and staff
- **User Management**: Complete auth system with email verification
- **Student Management**: Admission tracking, class assignment, and parent relationships
- **Teacher Management**: Specialization tracking and subject assignment
- **RESTful API**: Well-documented endpoints with proper status codes

## Technology Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT, bcrypt
- **Validation**: Custom validation helpers
- **Email**: Nodemailer with Mailpit for local testing

## API Documentation

### Authentication

**Register User**

```bash
curl -X POST -H "x-tenant-key: School Corp" -H "Content-Type: application/json" \
-d '{"name": "John Doe", "email": "john.doe@example.com", "password": "UserPass123!", "role_id": "teacher_role_id", "avatar": "https://example.com/avatar.png"}' \
http://localhost:3000/api/users/register
```

**Login**

```bash
curl -X POST -H "x-tenant-key: School Corp" -H "Content-Type: application/json" \
-d '{"email": "john.doe@example.com", "password": "UserPass123!"}' \
http://localhost:3000/api/users/login
```

### Tenant Management

**Create Tenant**

```bash
curl -X POST -H "Content-Type: application/json" \
-d '{"name": "School Corp", "contact_email": "admin@schoolcorp.com", "phone_number": "1234567890", "address": "123 Main St", "p_o_box": "12345", "logo": "https://schoolcorp.com/logo.png"}' \
http://localhost:3000/api/tenants
```

**Get Tenants**

```bash
curl -X GET -H "x-tenant-key: School Corp" \
http://localhost:3000/api/tenants?page=1&limit=10
```

### Role Management

**Create Role**

```bash
curl -X POST -H "x-tenant-key: School Corp" -H "Content-Type: application/json" \
-d '{"name": "teacher", "description": "Teaching staff role"}' \
http://localhost:3000/api/roles
```

### Student Management

**Create Student**

```bash
curl -X POST -H "x-tenant-key: School Corp" -H "Content-Type: application/json" \
-d '{"user_id": "64b5f5f5f5f5f5f5f5f5f5f5", "class_id": "64b5f5f5f5f5f5f5f5f5f5f6", "parent_id": "64b5f5f5f5f5f5f5f5f5f5f7", "enrollment_number": "2023-001", "date_of_birth": "2005-01-01", "gender": "male"}' \
http://localhost:3000/api/students
```

### Teacher Management

**Create Teacher**

```bash
curl -X POST -H "x-tenant-key: School Corp" -H "Content-Type: application/json" \
-d '{"user_id": "64b5f5f5f5f5f5f5f5f5f5f5", "specialization_id": "64b5f5f5f5f5f5f5f5f5f5f6", "first_name": "John", "last_name": "Doe", "phone_number": "1234567890"}' \
http://localhost:3000/api/teachers
```

**Assign Subjects**

```bash
curl -X PUT -H "x-tenant-key: School Corp" -H "Content-Type: application/json" \
-d '{"teacher_id": "64b5f5f5f5f5f5f5f5f5f5f5", "subject_ids": ["64b5f5f5f5f5f5f5f5f5f5f6"]}' \
http://localhost:3000/api/teachers/assign-subjects
```

## Environment Variables

Create a `.env` file with the following variables:

```bash
MONGODB_URI=mongodb://localhost:27017/school_db
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=1d
EMAIL_HOST=localhost
EMAIL_PORT=1025
EMAIL_USER=test@example.com
EMAIL_PASS=password
FRONTEND_URL=http://localhost:3000
```

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start the server: `npm start`
5. Access API at `http://localhost:3000`

## Testing

Run the provided curl commands to test endpoints. Use Mailpit for testing email functionality locally.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Roadmap

- [ ] Implement class management system
- [ ] Add attendance tracking
- [ ] Develop exam and grade management
- [ ] Create timetable generation
- [ ] Add reporting and analytics
