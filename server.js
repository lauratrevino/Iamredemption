/**
 * I Am Redemption — Form Submission Server
 * Handles Contact Us and Share Your Story forms,
 * emails submissions to jasmine@iamredemption.org via Nodemailer.
 *
 * Environment variables required (set in Render dashboard):
 *   SMTP_HOST     – e.g. smtp.gmail.com
 *   SMTP_PORT     – e.g. 587
 *   SMTP_USER     – sending email address
 *   SMTP_PASS     – app password or SMTP password
 *   TO_EMAIL      – jasmine@iamredemption.org  (or hardcoded below)
 *   PORT          – Render sets this automatically
 */

const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // serve HTML files from /public

// ---------------------------------------------------------------------------
// Nodemailer transporter
// ---------------------------------------------------------------------------
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const TO_EMAIL = process.env.TO_EMAIL || 'jasmine@iamredemption.org';

// ---------------------------------------------------------------------------
// POST /api/submit-form
// Body: { formType: 'story'|'contact', ...fields }
// ---------------------------------------------------------------------------
app.post('/api/submit-form', async (req, res) => {
  try {
    const { formType } = req.body;

    let subject, html;

    if (formType === 'story') {
      const { name = 'Anonymous', email = '', story = '' } = req.body;
      if (!story.trim()) {
        return res.status(400).json({ success: false, error: 'Story is required.' });
      }
      subject = `IAR Story Submission from ${name}`;
      html = `
        <h2 style="color:#1e2e10;">New Story Submission — I Am Redemption</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px;">
          <tr><td style="padding:8px;font-weight:bold;width:120px;">Name:</td><td style="padding:8px;">${escapeHtml(name)}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Email:</td><td style="padding:8px;">${escapeHtml(email)}</td></tr>
        </table>
        <hr style="margin:1.5rem 0;">
        <h3 style="color:#1e2e10;">Their Story:</h3>
        <p style="line-height:1.8;white-space:pre-wrap;">${escapeHtml(story)}</p>
      `;
    } else if (formType === 'contact') {
      const { topic = 'General Question', name = '', email = '', message = '' } = req.body;
      if (!message.trim()) {
        return res.status(400).json({ success: false, error: 'Message is required.' });
      }
      subject = `IAR Contact: ${topic}${name ? ' from ' + name : ''}`;
      html = `
        <h2 style="color:#1e2e10;">New Contact Message — I Am Redemption</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px;">
          <tr><td style="padding:8px;font-weight:bold;width:120px;">Topic:</td><td style="padding:8px;">${escapeHtml(topic)}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Name:</td><td style="padding:8px;">${escapeHtml(name)}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Email:</td><td style="padding:8px;">${escapeHtml(email)}</td></tr>
        </table>
        <hr style="margin:1.5rem 0;">
        <h3 style="color:#1e2e10;">Message:</h3>
        <p style="line-height:1.8;white-space:pre-wrap;">${escapeHtml(message)}</p>
      `;
    } else {
      return res.status(400).json({ success: false, error: 'Unknown form type.' });
    }

    await transporter.sendMail({
      from: `"I Am Redemption Website" <${process.env.SMTP_USER}>`,
      to: TO_EMAIL,
      subject,
      html,
    });

    return res.json({ success: true });
  } catch (err) {
    console.error('Form submission error:', err);
    return res.status(500).json({ success: false, error: 'Server error. Please try again.' });
  }
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`IAR server running on port ${PORT}`));
