// scripts/createAdmin.js
const storage = require('../utils/githubStorage');

async function createAdmin() {
    await storage.addUser({
        username: 'DG143',
        password: 'DG143',
        role: 'admin'
    });
    console.log('Admin user created!');
}

createAdmin();
