const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to your email provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/api/quote', async (req, res) => {
    try {
        const { name, phone, vehicle, service, requests, marketingConsent } = req.body;

        // Validate required fields
        if (!name || !phone || !service || !marketingConsent) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields.'
            });
        }

        // Email to business owner
        const ownerMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.BUSINESS_EMAIL || process.env.EMAIL_USER,
            subject: `New Quote Request from ${name}`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <div style="background-color: #3b82f6; padding: 24px; text-align: center;">
                        <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">New Quote Request</h2>
                    </div>
                    
                    <div style="padding: 32px;">
                        <table style="width: 100%; border-collapse: separate; border-spacing: 0 16px;">
                            <tr>
                                <td style="width: 35%; color: #6b7280; font-weight: 500; font-size: 14px; padding-right: 16px; border-bottom: 1px solid #f3f4f6; padding-bottom: 8px;">Name</td>
                                <td style="color: #111827; font-weight: 600; font-size: 16px; border-bottom: 1px solid #f3f4f6; padding-bottom: 8px;">${name}</td>
                            </tr>
                            <tr>
                                <td style="color: #6b7280; font-weight: 500; font-size: 14px; padding-right: 16px; border-bottom: 1px solid #f3f4f6; padding-bottom: 8px;">Phone</td>
                                <td style="color: #111827; font-weight: 600; font-size: 16px; border-bottom: 1px solid #f3f4f6; padding-bottom: 8px;">
                                    <a href="tel:${phone}" style="color: #3b82f6; text-decoration: none;">${phone}</a>
                                </td>
                            </tr>
                            <tr>
                                <td style="color: #6b7280; font-weight: 500; font-size: 14px; padding-right: 16px; border-bottom: 1px solid #f3f4f6; padding-bottom: 8px;">Vehicle</td>
                                <td style="color: #111827; font-weight: 600; font-size: 16px; border-bottom: 1px solid #f3f4f6; padding-bottom: 8px;">${vehicle || '<span style="color: #9ca3af; font-style: italic;">Not provided</span>'}</td>
                            </tr>
                            <tr>
                                <td style="color: #6b7280; font-weight: 500; font-size: 14px; padding-right: 16px; border-bottom: 1px solid #f3f4f6; padding-bottom: 8px;">Service Package</td>
                                <td style="border-bottom: 1px solid #f3f4f6; padding-bottom: 8px;">
                                    <span style="background-color: #eff6ff; color: #1d4ed8; padding: 6px 16px; border-radius: 20px; font-weight: 600; font-size: 14px; display: inline-block; border: 1px solid #bfdbfe;">${service}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="color: #6b7280; font-weight: 500; font-size: 14px; padding-right: 16px; vertical-align: top; padding-top: 8px;">Special Requests</td>
                                <td style="color: #374151; line-height: 1.6; padding-top: 8px;">
                                    ${requests ? `<div style="background-color: #f9fafb; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb;">${requests}</div>` : '<span style="color: #9ca3af; font-style: italic;">None</span>'}
                                </td>
                            </tr>
                            <tr>
                                <td style="color: #6b7280; font-weight: 500; font-size: 14px; padding-right: 16px; padding-top: 16px;">Marketing Consent</td>
                                <td style="color: #374151; padding-top: 16px;">
                                    <span style="display: flex; align-items: center; gap: 6px;">
                                        ${marketingConsent === 'yes' || marketingConsent === 'Yes' || marketingConsent === true
                    ? '✅ <span style="color: #059669; font-weight: 500;">Opted In</span>'
                    : '❌ <span style="color: #dc2626; font-weight: 500;">Opted Out</span>'}
                                    </span>
                                </td>
                            </tr>
                        </table>
                    </div>
                    
                    <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="margin: 0; color: #64748b; font-size: 12px;">
                            Received at: <span style="font-family: monospace; color: #475569;">${new Date().toLocaleString()}</span>
                        </p>
                    </div>
                </div>
            `
        };

        // Confirmation email to customer
        const customerMailOptions = {
            from: process.env.EMAIL_USER,
            to: phone, // If you want to send to email instead, add email field to form
            subject: 'Quote Request Received - Fairfield Mobile Detailing',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #3b82f6;">Thank You for Your Quote Request!</h2>
                    <p>Hi ${name},</p>
                    <p>We've received your quote request for our <strong>${service}</strong> package.</p>
                    <p>We'll get back to you within 1 hour during business hours (Mon-Sat: 8:00 AM - 6:00 PM).</p>
                    
                    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Your Request Details:</h3>
                        <p><strong>Service:</strong> ${service}</p>
                        <p><strong>Vehicle:</strong> ${vehicle || 'Not provided'}</p>
                        ${requests ? `<p><strong>Special Requests:</strong> ${requests}</p>` : ''}
                    </div>

                    <p>If you have any immediate questions, feel free to call or text us at <strong>(903) 555-0123</strong>.</p>
                    
                    <p style="margin-top: 30px;">Best regards,<br>
                    <strong>Fairfield Mobile Detailing Team</strong></p>
                    
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                    <p style="font-size: 12px; color: #6b7280;">
                        This is an automated confirmation email. Please do not reply to this email.
                    </p>
                </div>
            `
        };

        // Send emails
        await transporter.sendMail(ownerMailOptions);

        // Only send customer confirmation if they provided an email
        // For now, we'll skip this since the form only has phone
        // await transporter.sendMail(customerMailOptions);

        res.json({
            success: true,
            message: 'Quote request sent successfully! We\'ll contact you soon.'
        });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send quote request. Please try again or call us directly.'
        });
    }
});

// AI Chat Endpoint (DeepSeek)
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }

        const apiKey = process.env.DEEPSEEK_API_KEY || 'sk-aafcf16baa0344e4aa043b553d413ead';

        const systemPrompt = `You are Nova, a helpful and friendly AI assistant for Fairfield Mobile Detailing. You help customers with pricing, services, and booking.

Our Packages:

📦 EXPRESS WASH - $89
Hand wash & dry, wheel clean & tire shine, interior vacuum, wipe down dash & console, clean windows, all purpose cleaning

⭐ STANDARD DETAIL - $149 (Most Popular)
Everything in Express + clay bar treatment, hand wax application, shampoo seats & carpets, leather conditioning, steam cleaner, odor neutralizer treatment

💎 PREMIUM DETAIL - $249
Everything in Standard + clay bar treatment, hand wax application, light machine polish, engine bay detail, plastic debris removal

Phone: (903) 555-0123

FORMATTING RULES:
- When listing packages, put a blank line between each package
- Keep responses concise but friendly
- Use emojis sparingly for package names
- Be professional and helpful`;


        // Call DeepSeek API
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message }
                ],
                stream: false
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('DeepSeek API Error:', data);
            throw new Error(data.error?.message || 'Failed to get AI response');
        }

        const botReply = data.choices?.[0]?.message?.content || 'I apologize, but I could not process your request. Please try again or call us at (903) 555-0123.';

        res.json({ success: true, reply: botReply });

    } catch (error) {
        console.error('DeepSeek API Error:', error);
        res.status(500).json({ success: false, message: 'Failed to communicate with AI' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
