const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { auth, isManager } = require('../middleware/auth');

// Get all employees (managers only)
router.get('/', auth, isManager, async (req, res) => {
    try {
        const employees = await User.find({ role: 'employee' }).select('-password');
        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get own profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update own profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { fullName, department, position } = req.body;
        const user = await User.findById(req.user.id);
        
        if (fullName) user.fullName = fullName;
        if (department) user.department = department;
        if (position) user.position = position;

        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Manager routes for employee management
router.post('/', auth, isManager, async (req, res) => {
    try {
        const { email, password, fullName, department, position } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newEmployee = new User({
            email,
            password: hashedPassword,
            fullName,
            role: 'employee',
            department,
            position
        });

        await newEmployee.save();
        res.status(201).json(newEmployee);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/:id', auth, isManager, async (req, res) => {
    try {
        const employee = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(employee);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:id', auth, isManager, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Employee deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;