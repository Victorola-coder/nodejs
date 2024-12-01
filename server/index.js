require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Server } = require('socket.io');
const http = require('http');
const User = require('./models/User');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/chatroom')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Track online users
const onlineUsers = new Map();

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle registration
    socket.on('register', async (userData, callback) => {
        try {
            const { username, email, password } = userData;
            
            // Check if username or email exists
            const existingUser = await User.findOne({ 
                $or: [{ username }, { email }] 
            });
            
            if (existingUser) {
                return callback({ 
                    success: false, 
                    message: 'Username or email already exists' 
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Create new user
            const user = new User({
                username,
                email,
                password: hashedPassword
            });
            
            await user.save();
            callback({ success: true, message: 'Registration successful' });
        } catch (error) {
            callback({ success: false, message: error.message });
        }
    });

    // Handle login
    socket.on('login', async (credentials, callback) => {
        try {
            const { username, password } = credentials;
            const user = await User.findOne({ username });

            if (!user || !(await bcrypt.compare(password, user.password))) {
                return callback({ 
                    success: false, 
                    message: 'Invalid credentials' 
                });
            }

            user.isOnline = true;
            await user.save();
            
            socket.username = username;
            onlineUsers.set(username, socket.id);
            
            callback({ 
                success: true, 
                message: 'Login successful' 
            });

            // Broadcast updated user list
            io.emit('userListUpdate', {
                online: Array.from(onlineUsers.keys()),
                offline: await getOfflineUsers()
            });
        } catch (error) {
            callback({ success: false, message: error.message });
        }
    });

    // Handle direct messages
    socket.on('directMessage', ({ to, message }) => {
        const receiverSocketId = onlineUsers.get(to);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('message', {
                from: socket.username,
                message
            });
        }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
        if (socket.username) {
            onlineUsers.delete(socket.username);
            const user = await User.findOne({ username: socket.username });
            if (user) {
                user.isOnline = false;
                await user.save();
            }
            io.emit('userListUpdate', {
                online: Array.from(onlineUsers.keys()),
                offline: await getOfflineUsers()
            });
        }
    });
});

async function getOfflineUsers() {
    const allUsers = await User.find({}, 'username');
    return allUsers
        .map(user => user.username)
        .filter(username => !onlineUsers.has(username));
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 