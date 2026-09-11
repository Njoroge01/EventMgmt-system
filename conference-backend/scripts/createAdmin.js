// Run this once to create your first admin login:
//   node scripts/createAdmin.js myusername mypassword
require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../config/db');

async function createAdmin() {
    const [, , username, password] = process.argv;

    if (!username || !password) {
        console.error('Usage: node scripts/createAdmin.js <username> <password>');
        process.exit(1);
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)',
            [username, passwordHash]
        );
        console.log(`Admin user "${username}" created successfully.`);
    } catch (err) {
        console.error('Failed to create admin user:', err.message);
    } finally {
        await pool.end();
    }
}

createAdmin();
