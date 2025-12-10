// Vercel Serverless Function for DeepSeek AI Chat
// This runs on Vercel's servers, keeping your API key secure

export default async function handler(req, res) {
    // Enable CORS for your domain
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }

        // API key from Vercel environment variables
        const apiKey = process.env.DEEPSEEK_API_KEY;
        
        if (!apiKey) {
            console.error('DEEPSEEK_API_KEY not configured');
            return res.status(500).json({ success: false, message: 'AI service not configured' });
        }

        const systemPrompt = `You are Nova, a helpful and friendly AI assistant for A&J Mobile Detailing. You help customers with pricing, services, and booking.

Our Packages:

📦 EXPRESS WASH - $89
Exterior wash & dry, wheel clean & tire shine, interior vacuum, wipe down dash & console, clean windows, all purpose cleaning, air fresheners

⭐ STANDARD DETAIL - $149 (Most Popular)
Everything in Express + shampoo seats & carpets, leather conditioning, steam cleaner, odor neutralizer treatment

💎 PREMIUM DETAIL - $249
Everything in Standard + clay bar treatment, hand wax application, light machine polish, engine bay detail, plastic debris removal, ceramic spray coating

Phone: (903) 423-1372 or (903) 388-8071

FORMATTING RULES:
- When listing packages, put a blank line between each package
- Keep responses concise but friendly
- Use emojis sparingly for package names
- Be professional and helpful`;

        // DeepSeek API base URL
        const baseUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';

        // Call DeepSeek API
        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ],
                stream: false
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('DeepSeek API Error:', data);
            throw new Error(data.error?.message || 'Failed to get AI response');
        }

        const botReply = data.choices?.[0]?.message?.content || 
            'I apologize, but I could not process your request. Please try again or call us at (903) 423-1372.';

        return res.status(200).json({ success: true, reply: botReply });

    } catch (error) {
        console.error('DeepSeek API Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to communicate with AI' });
    }
}
