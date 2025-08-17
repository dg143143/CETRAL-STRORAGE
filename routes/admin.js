const express = require('express');
const storage = require('../utils/githubStorage');
const router = express.Router();

// Create user
router.post('/users', async (req, res) => {
    try {
        const userData = req.body;
        const newUser = await storage.addUser(userData);
        res.json({ success: true, user: newUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await storage.getUsers();
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
    try {
        await storage.deleteUser(req.params.id);
        res.json({ success: true, message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
