// Supabase Edge Function for DeepSeek AI Chat
// Deploy with: supabase functions deploy chat

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()

    if (!message) {
      return new Response(
        JSON.stringify({ success: false, message: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get API key from Supabase secrets
    const apiKey = Deno.env.get('DEEPSEEK_API_KEY')
    
    if (!apiKey) {
      console.error('DEEPSEEK_API_KEY not configured')
      return new Response(
        JSON.stringify({ success: false, message: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
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
- Be professional and helpful`

    // DeepSeek API base URL
    const baseUrl = Deno.env.get('DEEPSEEK_BASE_URL') || 'https://api.deepseek.com'

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
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('DeepSeek API Error:', data)
      throw new Error(data.error?.message || 'Failed to get AI response')
    }

    const botReply = data.choices?.[0]?.message?.content || 
      'I apologize, but I could not process your request. Please try again or call us at (903) 423-1372.'

    return new Response(
      JSON.stringify({ success: true, reply: botReply }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to communicate with AI' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
