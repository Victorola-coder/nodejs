# Chat Room Application - User Manual

## Table of Contents

1. Server Deployment Instructions
2. Application Access Instructions
3. Requirements Coverage
4. Usage Guide with Screenshots
5. Troubleshooting Guide

## 1. Server Deployment Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm (Node Package Manager)

### Server Setup

1. Extract the zip file to your desired location
2. Navigate to the server directory:

````bash
cd server
```UserManual.md
3. Install dependencies:
```bash
npm install
````

4. Create a `.env` file in the server directory with:

```env
MONGODB_URI=mongodb://localhost/chatroom
PORT=3000
```

5. Start the server:

```bash
node index.js
```

You should see: "Server running on port 3000" and "Connected to MongoDB"

## 2. Application Access Instructions

### Client Setup

1. Open a new terminal
2. Navigate to the client directory:

```bash
cd client
```

3. Install dependencies:

```bash:UserManual.md
npm install
```

4. Start the client:

```bash
node index.js
```

## 3. Requirements Coverage

### Implemented Features ✅

- User Registration
  - Username validation
  - Email validation
  - Password encryption
- User Login
  - Credential verification
  - Session management
- Real-time Messaging
  - Direct messaging
  - Online/Offline status
- Database Integration
  - MongoDB storage
  - User data persistence
- User Interface
  - Console-based menu system
  - Clear navigation options
  - Status indicators

## 4. Usage Guide with Screenshots

### Main Menu

```
=== Chat Room Application ===
=========================
1) Login
2) Register
3) Quit
=========================
User Command >
```

### Registration Process

1. Select option 2 from main menu
2. Enter username when prompted
3. Enter email address
4. Enter password
5. System will confirm successful registration

### Login Process

1. Select option 1 from main menu
2. Enter username
3. Enter password
4. Upon successful login, user list will be displayed

### User List View

```
=== Users ===

Offline Users:
- UserA
- UserB

Online Users:
- UserC
- UserD

m) direct message    q) quit
>
```

### Direct Messaging

1. Type 'm' from user list view
2. Enter username to message
3. Chat window opens:

```
=== Chat with UserC ===
Type GoBackToMainMenu to return

You> Hello
UserC> Hi there!
You>
```

## 5. Troubleshooting Guide

### Common Issues and Solutions

1. **Server Won't Start**

   - Check if MongoDB is running
   - Verify correct MongoDB URI in .env file
   - Ensure port 3000 is not in use

2. **Can't Connect to Server**

   - Verify server is running
   - Check if client is using correct server address
   - Confirm no firewall blocking

3. **Registration Fails**

   - Username might already exist
   - Email might already be registered
   - Check all fields are filled correctly

4. **Login Issues**

   - Verify username spelling
   - Ensure password is correct
   - Check if server is running

5. **Messages Not Sending**
   - Confirm recipient is online
   - Check network connection
   - Verify you're still logged in

### Error Messages and Solutions

| Error Message              | Possible Cause              | Solution                  |
| -------------------------- | --------------------------- | ------------------------- |
| "MongoDB connection error" | Database not running        | Start MongoDB service     |
| "Username already exists"  | Duplicate registration      | Choose different username |
| "Invalid credentials"      | Wrong login details         | Verify username/password  |
| "User not found"           | Messaging non-existent user | Check username spelling   |

## Project Structure

```
chat-room/
├── client/
│   ├── index.js
│   └── package.json
├── server/
│   ├── index.js
│   ├── models/
│   │   └── User.js
│   └── package.json
└── README.md
```

## Security Notes

- All passwords are encrypted using bcrypt
- User sessions are managed securely
- No sensitive data is stored in plain text
