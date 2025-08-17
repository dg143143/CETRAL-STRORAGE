const fs = require('fs').promises;
const path = require('path');

class GitHubFileStorage {
    constructor() {
        this.dataDir = path.join(__dirname, '../data');
        this.usersFile = path.join(this.dataDir, 'users.json');
        this.signalsFile = path.join(this.dataDir, 'signals.json');
        this.init();
    }

    async init() {
        try {
            // Data directory create karo agar nahi hai
            await fs.mkdir(this.dataDir, { recursive: true });

            // Initialize files agar nahi hain
            await this.initializeFile(this.usersFile, []);
            await this.initializeFile(this.signalsFile, []);
        } catch (error) {
            console.error('Storage initialization error:', error);
        }
    }

    async initializeFile(filePath, defaultData) {
        try {
            await fs.access(filePath);
        } catch {
            await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2));
        }
    }

    // Users Management
    async getUsers() {
        try {
            const data = await fs.readFile(this.usersFile, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading users:', error);
            return [];
        }
    }

    async addUser(userData) {
        try {
            const users = await this.getUsers();
            const newUser = {
                id: Date.now().toString(),
                ...userData,
                createdAt: new Date().toISOString()
            };
            users.push(newUser);
            await fs.writeFile(this.usersFile, JSON.stringify(users, null, 2));
            return newUser;
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    }

    async deleteUser(userId) {
        try {
            const users = await this.getUsers();
            const filteredUsers = users.filter(user => user.id !== userId);
            await fs.writeFile(this.usersFile, JSON.stringify(filteredUsers, null, 2));
            return true;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    async updateUser(userId, updateData) {
        try {
            const users = await this.getUsers();
            const userIndex = users.findIndex(user => user.id === userId);
            if (userIndex === -1) throw new Error('User not found');

            users[userIndex] = { ...users[userIndex], ...updateData };
            await fs.writeFile(this.usersFile, JSON.stringify(users, null, 2));
            return users[userIndex];
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    // Signals Management
    async getSignals() {
        try {
            const data = await fs.readFile(this.signalsFile, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading signals:', error);
            return [];
        }
    }

    async addSignal(signalData) {
        try {
            const signals = await this.getSignals();
            const newSignal = {
                id: Date.now().toString(),
                ...signalData,
                createdAt: new Date().toISOString()
            };
            signals.push(newSignal);
            await fs.writeFile(this.signalsFile, JSON.stringify(signals, null, 2));
            return newSignal;
        } catch (error) {
            console.error('Error adding signal:', error);
            throw error;
        }
    }

    async deleteSignal(signalId) {
        try {
            const signals = await this.getSignals();
            const filteredSignals = signals.filter(signal => signal.id !== signalId);
            await fs.writeFile(this.signalsFile, JSON.stringify(filteredSignals, null, 2));
            return true;
        } catch (error) {
            console.error('Error deleting signal:', error);
            throw error;
        }
    }

    // Authentication Helper
    async authenticateUser(username, password) {
        try {
            const users = await this.getUsers();
            const user = users.find(u => u.username === username && u.password === password);
            return user || null;
        } catch (error) {
            console.error('Authentication error:', error);
            return null;
        }
    }
}

module.exports = new GitHubFileStorage();
