const express = require('express');
const storage = require('../utils/githubStorage');
const router = express.Router();

// Get all signals
router.get('/', async (req, res) => {
    try {
        const signals = await storage.getSignals();
        res.json({ success: true, signals });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Add signal
router.post('/', async (req, res) => {
    try {
        const signalData = req.body;
        const newSignal = await storage.addSignal(signalData);
        res.json({ success: true, signal: newSignal });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete signal
router.delete('/:id', async (req, res) => {
    try {
        await storage.deleteSignal(req.params.id);
        res.json({ success: true, message: 'Signal deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
