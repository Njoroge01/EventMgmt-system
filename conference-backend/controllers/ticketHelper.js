const pool = require('../config/db');

// Generates a ticket number like "TCK-7F3A9C21" and records it against a
// registration. registrationType is 'participant' or 'exhibitor'.
async function issueTicket(registrationType, registrationId) {
    const ticketNumber = `TCK-${Date.now().toString(36).toUpperCase()}${Math.floor(
        Math.random() * 1000
    )}`;

    const result = await pool.query(
        `INSERT INTO tickets (ticket_number, registration_type, registration_id)
         VALUES ($1, $2, $3) RETURNING *`,
        [ticketNumber, registrationType, registrationId]
    );

    return result.rows[0];
}

module.exports = { issueTicket };
