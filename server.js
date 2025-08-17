const express = require('express');
const cors = require('cors');
const path = require('path');

// Routes import
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const signalRoutes = require('./routes/signals');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/signals', signalRoutes);

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
