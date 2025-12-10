# Formspree Setup Guide (Legacy)

> **Heads up:** The quote form now sends requests through our Supabase Edge Function (`supabase/functions/quote`). You only need these Formspree instructions if you decide to switch back to the old static setup.

To make the Contact Form work on your website, you need to connect it to Formspree (a free service for handling forms on static sites).

## Step 1: Create a Formspree Account
1. Go to [https://formspree.io/](https://formspree.io/) and sign up for a free account.
2. Verify your email address.

## Step 2: Create a New Form
1. Click **+ New Form**.
2. Name it "Car Detailing Quote".
3. In the "Send emails to" field, enter the email address where you want to receive quote requests.
4. Click **Create Form**.

## Step 3: Get Your Form ID
1. Once created, you will see an **Endpoint URL** that looks like this:
   `https://formspree.io/f/mqkrvjbl`
2. The last part of the URL (e.g., `mqkrvjbl`) is your **Form ID**.
3. Copy this ID.

## Step 4: Add ID to Your Code
1. Open the file `js/main.js` on your computer.
2. Look for the line near `525` (inside the user `quoteForm` section):
   ```javascript
   const FORMSPREE_ID = 'YOUR_ID_HERE'; 
   ```
3. Replace `'YOUR_ID_HERE'` with your actual Form ID.
   Example:
   ```javascript
   const FORMSPREE_ID = 'mqkrvjbl'; 
   ```
4. Save the file.

## That's it!
Your form should now work. When someone submits a quote, you will receive an email instantly.

---

### Note on the Chat Widget
The Chat Widget has been switched to "Demo Mode" so it works immediately without needing a server. It uses pre-defined responses for common questions (Pricing, Services, Location, etc.).
