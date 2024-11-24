# Employee Management System - User Manual

## 1. Web Server Deployment Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm (Node Package Manager)

### Installation Steps

1. Clone or extract the project files
2. Open terminal/command prompt in the project directory
3. Install dependencies:

npm installx

4. Create `.env` file in root directory with:

```
MONGODB_URI=mongodb://localhost:27017/employee-management
JWT_SECRET=your_secret_key
PORT=3000
```

5. Start MongoDB server (see commands above)
6. Start the application:

```
npm start
```

7. Access the application at: `http://localhost:3000`

## 2. Web Application Access Instructions

### Initial Setup

- Default manager account:
  - Email: manager@company.com
  - Password: manager123

### User Types and Access Levels:

#### Normal Users (Employees):

- Can log in with email/password
- View their own profile
- Edit their own profile information
- Cannot access other employees' information

#### Managers:

- All employee capabilities plus:
- View list of all employees
- Add new employees
- Edit employee information
- Delete employees

### Navigation Guide:

1. Login Page (`/login`)

   - Enter email and password
   - Click "Login"

2. Profile Page (`/employee/profile`)

   - View personal information
   - Edit profile details
   - Save changes

3. Employee List (Managers Only) (`/employee/list`)
   - View all employees
   - Add new employees
   - Edit employee details
   - Delete employees

## 3. Requirements Implementation Status

### Implemented Features ✅

- Complete user authentication system
- Role-based access control (Manager/Employee)
- Employee profile management
- Manager administrative capabilities
- MongoDB data storage
- Secure password handling
- Session management

### Security Features

- Password hashing using bcrypt
- Session-based authentication
- Role-based access control
- Input validation
- Secure routes protection

## 4. Troubleshooting Guide

### Common Issues and Solutions

1. **Cannot Connect to MongoDB**

   - Verify MongoDB is running: `mongosh`
   - Check MongoDB connection string in .env
   - Ensure MongoDB service is active

2. **Login Issues**

   - Verify correct email/password
   - Clear browser cache/cookies
   - Check if MongoDB is running

3. **Access Denied Errors**

   - Verify user role permissions
   - Try logging out and back in
   - Clear session data

4. **Page Not Loading**
   - Check server console for errors
   - Verify correct port number
   - Ensure all dependencies are installed

### Error Messages and Solutions

1. "MongoDB connection error"

   - Start MongoDB server
   - Check database connection string

2. "Access denied. Managers only."

   - Login with manager account
   - Verify account permissions

3. "User already exists"
   - Use different email for registration
   - Reset password if forgotten

## 5. Support

For additional support:

1. Check server logs for errors
2. Verify MongoDB status
3. Check application logs
4. Contact system administrator
