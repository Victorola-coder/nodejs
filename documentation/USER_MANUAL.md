# Employee Management System - User Manual

## Table of Contents

1. System Requirements
2. Installation Guide
3. Usage Instructions
4. Troubleshooting
5. Client Requirements Coverage

## 1. System Requirements

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Modern web browser (Chrome, Firefox, Safari, or Edge)

## 2. Installation Guide

### Web Server Deployment

1. Clone or extract the project files
2. Install dependencies:

npm install

3. Create a `.env` file in the root directory with:

```
MONGODB_URI=mongodb://localhost:27017/employee-management
JWT_SECRET=your_secret_key
PORT=3000
```

4. Start MongoDB:

```bash
mongod
```

5. Start the server:

```bash
node server.js
```

The server will run on `http://localhost:3000`

## 3. Usage Instructions

### First-Time Setup

1. Create the first manager account using API:

```bash
curl -X POST http://localhost:3000/auth/register \
-H "Content-Type: application/json" \
-d '{
    "email": "manager@company.com",
    "password": "password123",
    "fullName": "Admin Manager",
    "role": "manager"
}'
```

## 4. Troubleshooting

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
