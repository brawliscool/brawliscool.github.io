# 🚀 Final Setup Guide: Backend & AI Chatbot

Follow these steps exactly to get your website, email system, and AI chatbot (Nova) working.

---

## 1️⃣ Install Node.js
Ensure you have **Node.js** installed.
- Open a terminal (Command Prompt or PowerShell) and type:
  ```bash
  node -v
  ```
- If it says "command not found" or shows a version lower than `v18.0.0`, download and install the latest "LTS" version from [nodejs.org](https://nodejs.org/).

---

## 2️⃣ Install Dependencies
Open your project folder in the terminal and run:

```bash
npm install
```
*This installs the required tools (Express, Nodemailer, etc.) listed in `package.json`.*

---

## 3️⃣ Create the Configuration File (.env)
You need a file to store your secrets.

1.  **Create a new file** in the root folder named `.env`
2.  **Paste the following content** into it:

```env
# --- Server Settings ---
PORT=3000
NODE_ENV=development

# --- Email Settings (Gmail) ---
# Your Gmail address
EMAIL_USER=your-email@gmail.com
# Your 16-character App Password (NOT your login password)
# Get one here: https://myaccount.google.com/apppasswords
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx

# Where you want to receive quote requests
BUSINESS_EMAIL=your-business-email@gmail.com

# --- AI Chatbot Settings (DeepSeek) ---
# Your DeepSeek API Key
CHATBOT_API_KEY=sk-17bbb682a1814cd9a7e6b98bb5ab82c0
```

3.  **Edit the file** with your real email details.
    *   *Note: The Chatbot API Key is already pre-filled with the key you provided.*

---

## 4️⃣ Start the Server
You have two ways to start the backend:

**Option A (Easy):**
*   Double-click the `start-server.bat` file in your folder.

**Option B (Terminal):**
*   Run this command in your terminal:
    ```bash
    npm start
    ```

*You should see a message saying "Server running on http://localhost:3000"*

---

## 5️⃣ Verify Everything Works

### ✅ Test the Website
Open your browser and go to: **[http://localhost:3000](http://localhost:3000)**

### ✅ Test the Chatbot (Nova)
1.  Click the blue chat bubble in the bottom right.
2.  Type "Hello".
3.  **Result:** Nova should reply "Hello! 👋 How can I help..." (using the AI).

### ✅ Test the Quote Form
1.  Scroll to the "Get a Free Quote" section.
2.  Fill it out with test info.
3.  Click Submit.
4.  **Result:**
    *   Button should turn green ("Sent!").
    *   Check your `BUSINESS_EMAIL` inbox for the notification.

---

## ❓ Troubleshooting

**"Fetch is not defined" Error:**
*   Update Node.js to version 18 or higher.

**"Authentication Failed" for Email:**
*   Make sure you are using a **Gmail App Password**, not your regular password.
*   Ensure 2-Step Verification is enabled on your Google Account.

**"Server API key not configured":**
*   Double-check your `.env` file exists and has the `CHATBOT_API_KEY` line.
*   Restart the server after editing `.env`.
