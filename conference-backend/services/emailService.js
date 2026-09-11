const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const CONFERENCE_NAME = 'The 1st East Africa Bio-Inputs Conference 2027';
const CONFERENCE_DATES = '8th - 12th February 2027';
const CONFERENCE_VENUE = 'Nairobi, Kenya';

async function sendPaymentReceivedEmail(toEmail, fullName, registrationType) {
    const roleLabel = registrationType === 'exhibitor' ? 'exhibitor' : 'participant';

    await transporter.sendMail({
        from: `"EA Bio-Inputs Conference 2027" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: `We've received your payment details - ${CONFERENCE_NAME}`,
        html: `
            <p>Hi ${fullName},</p>
            <p>Thank you - we've received your payment reference for your ${roleLabel} registration for <strong>${CONFERENCE_NAME}</strong>.</p>
            <p>Our team will confirm your payment shortly. You'll receive a second email once it's verified.</p>
            <p>Dates: ${CONFERENCE_DATES}<br/>Venue: ${CONFERENCE_VENUE}</p>
            <p>&mdash; The 1st East Africa Bio-Inputs Conference 2027 Organizing Committee</p>
        `,
    });
}

async function sendPaymentConfirmedEmail(toEmail, fullName, registrationType) {
    const roleLabel = registrationType === 'exhibitor' ? 'exhibitor' : 'participant';

    await transporter.sendMail({
        from: `"EA Bio-Inputs Conference 2027" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: `Payment confirmed - ${CONFERENCE_NAME}`,
        html: `
            <p>Hi ${fullName},</p>
            <p>Your payment has been confirmed and your ${roleLabel} registration for <strong>${CONFERENCE_NAME}</strong> is complete.</p>
            <p>Dates: ${CONFERENCE_DATES}<br/>Venue: ${CONFERENCE_VENUE}</p>
            <p>Please bring a valid ID to the registration desk at the venue, where your ticket will be issued upon confirming your record.</p>
            <p>&mdash; The 1st East Africa Bio-Inputs Conference 2027 Organizing Committee</p>
        `,
    });
}

module.exports = { sendPaymentReceivedEmail, sendPaymentConfirmedEmail };