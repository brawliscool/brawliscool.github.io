import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.44.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const BUSINESS_EMAIL = Deno.env.get('BUSINESS_EMAIL') ?? '';
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'nova@ajdetailing.store';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing Supabase configuration. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY secrets are set.');
}

const supabase = SUPABASE_URL && SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
  : null;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    if (!supabase) {
      throw new Error('Supabase client not configured');
    }

    if (!BUSINESS_EMAIL) {
      throw new Error('BUSINESS_EMAIL secret is not configured');
    }

    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY secret is not configured');
    }

    const payload = await req.json();
    const {
      name,
      phone,
      address,
      vehicle,
      service,
      requests,
      marketingConsent,
      utmSource,
      utmMedium,
      utmCampaign,
      referer,
    } = payload ?? {};

    const missingFields = ['name', 'phone', 'address', 'service', 'marketingConsent'].filter(
      (field) => !payload?.[field]?.toString().trim(),
    );

    if (missingFields.length) {
      return jsonResponse(
        { success: false, message: `Missing required fields: ${missingFields.join(', ')}` },
        400,
      );
    }

    const marketingAllowed = normalizeConsent(marketingConsent);

    const submission = {
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      vehicle: vehicle?.trim() || null,
      service: service.trim(),
      requests: requests?.trim() || null,
      marketing_consent: marketingAllowed,
      utm_source: utmSource || null,
      utm_medium: utmMedium || null,
      utm_campaign: utmCampaign || null,
      referer: referer || req.headers.get('referer'),
      user_agent: req.headers.get('user-agent'),
    };

    const { data, error } = await supabase
      .from('quote_requests')
      .insert(submission)
      .select('id, inserted_at')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw new Error('Failed to record quote request');
    }

    await sendOwnerEmail({
      submission: { ...submission, id: data.id, submitted_at: data.inserted_at },
    });

    return jsonResponse({
      success: true,
      message: 'Quote request sent successfully. We will contact you shortly.',
    });
  } catch (error) {
    console.error('Quote function error:', error);
    return jsonResponse(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to send quote request. Please try again later.',
      },
      500,
    );
  }
});

function normalizeConsent(value: unknown) {
  if (typeof value === 'boolean') return value;
  const normalized = String(value).toLowerCase();
  return normalized === 'yes' || normalized === 'true';
}

async function sendOwnerEmail({ submission }: { submission: Record<string, unknown> }) {
  const html = buildOwnerEmail(submission);

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: `A&J Detailing <${FROM_EMAIL}>`,
      to: [BUSINESS_EMAIL],
      subject: `New quote request from ${submission.name} (${submission.service})`,
      html,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    console.error('Resend API error:', details);
    throw new Error('Failed to deliver email notification');
  }
}

function buildOwnerEmail(submission: Record<string, unknown>) {
  const safe = (value: unknown) => escapeHtml(String(value ?? 'Not provided'));
  const boolBadge = (flag?: boolean) =>
    flag ? '<span style="color:#059669;font-weight:600;">Opted In</span>' : '<span style="color:#dc2626;font-weight:600;">Opted Out</span>';

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden;">
      <div style="background: linear-gradient(135deg,#2563eb,#1d4ed8); padding: 24px;">
        <h2 style="color:#fff;margin:0;font-size:22px;">New Quote Request</h2>
        <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:14px;">${new Date(submission.submitted_at as string).toLocaleString()}</p>
      </div>
      <div style="padding:24px;">
        ${buildRow('Name', safe(submission.name))}
        ${buildRow('Phone', `<a href="tel:${safe(submission.phone)}" style="color:#2563eb;text-decoration:none;">${safe(submission.phone)}</a>`)}
        ${buildRow('Address', safe(submission.address))}
        ${buildRow('Vehicle', safe(submission.vehicle))}
        ${buildRow('Service Package', `<span style="background:#eff6ff;color:#1d4ed8;padding:6px 14px;border-radius:999px;font-weight:600;">${safe(submission.service)}</span>`)}
        ${buildRow('Special Requests', submission.requests ? `<div style="background:#f9fafb;padding:12px;border-radius:10px;line-height:1.5;">${safe(submission.requests)}</div>` : '<span style="color:#9ca3af;">None</span>')}
        ${buildRow('Marketing Consent', boolBadge(submission.marketing_consent as boolean))}
        ${buildRow('Source', submission.utm_source ? `${safe(submission.utm_source)} / ${safe(submission.utm_medium)} / ${safe(submission.utm_campaign)}` : 'Website')}
      </div>
      <div style="background:#f8fafc;padding:16px;text-align:center;border-top:1px solid #e5e7eb;">
        <p style="margin:0;font-size:13px;color:#64748b;">Submission ID: <strong>${safe(submission.id)}</strong></p>
      </div>
    </div>
  `;
}

function buildRow(label: string, value: string) {
  return `
    <div style="margin-bottom:18px;">
      <div style="text-transform:uppercase;font-size:12px;color:#94a3b8;font-weight:600;letter-spacing:0.08em;margin-bottom:4px;">${label}</div>
      <div style="font-size:16px;color:#0f172a;">${value}</div>
    </div>
  `;
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
