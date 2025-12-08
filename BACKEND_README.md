# Fairfield Mobile Detailing - Backend Setup

## Overview
This is the backend server for the Fairfield Mobile Detailing website. It handles contact form submissions and sends email notifications.

## Features
- ✅ Contact form submission handling
- ✅ Email notifications to business owner
- ✅ Automatic confirmation emails to customers
- ✅ Input validation
- ✅ Error handling
- ✅ CORS enabled for frontend integration

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Gmail account (or other email service)

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
BUSINESS_EMAIL=your-business-email@gmail.com

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 3. Gmail App Password Setup
If using Gmail, you need to create an App Password:

1. Go to your Google Account settings
2. Navigate to Security → 2-Step Verification
3. Scroll down to "App passwords"
4. Generate a new app password for "Mail"
5. Copy the 16-character password to your `.env` file

**Important:** Use the app password, NOT your regular Gmail password!

## Running the Server

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### POST /api/quote
Submit a quote request

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "(903) 555-0123",
  "vehicle": "2020 Ford F-150",
  "service": "Standard",
  "requests": "Need interior deep clean",
  "marketingConsent": "yes"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Quote request sent successfully! We'll contact you soon."
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Error message here"
}
```

### GET /api/health
Health check endpoint

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Email Service Providers

### Gmail (Default)
Already configured in the code. Just add your credentials to `.env`.

### Other Providers
To use a different email service, update `server.js`:

```javascript
const transporter = nodemailer.createTransport({
    host: 'smtp.your-provider.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});
```

Popular providers:
- **Outlook/Hotmail:** `smtp-mail.outlook.com`, port 587
- **Yahoo:** `smtp.mail.yahoo.com`, port 587
- **SendGrid:** Use their API instead
- **Mailgun:** Use their API instead

## Deployment

### Option 1: Heroku
```bash
# Install Heroku CLI
heroku login
heroku create fairfield-detailing
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASSWORD=your-app-password
heroku config:set BUSINESS_EMAIL=business@example.com
git push heroku main
```

### Option 2: Railway
1. Connect your GitHub repo to Railway
2. Add environment variables in the Railway dashboard
3. Deploy automatically on push

### Option 3: DigitalOcean/AWS/Azure
1. Set up a Node.js server
2. Clone your repository
3. Install dependencies
4. Set environment variables
5. Use PM2 to keep the server running:
```bash
npm install -g pm2
pm2 start server.js --name fairfield-detailing
pm2 save
pm2 startup
```

## Security Considerations

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use app-specific passwords** - Don't use your main email password
3. **Enable HTTPS in production** - Use a reverse proxy like Nginx
4. **Rate limiting** - Consider adding rate limiting for the API
5. **Input sanitization** - Already basic validation, but consider adding more

## Troubleshooting

### Email not sending
- Check your email credentials in `.env`
- Verify app password is correct
- Check Gmail security settings
- Look at server console for error messages

### Port already in use
Change the PORT in `.env` or kill the process:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill
```

### CORS errors
Make sure your frontend is making requests to the correct URL. Update the fetch URL in `main.js` if needed.

## Support
For issues or questions, contact the development team.

## License
ISC
