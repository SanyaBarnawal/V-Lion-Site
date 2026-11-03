// Cloudflare Worker: receives enquiries/orders from the website and sends them to Telegram.
// Secrets (set in Cloudflare, never in the website code): BOT_TOKEN, CHAT_ID
// Change ALLOWED_ORIGIN to the live site, e.g. https://yourname.github.io or https://vlion.in
const ALLOWED_ORIGIN = 'https://YOUR-SITE-URL';

export default {
  async fetch(req, env) {
    const cors = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: cors });

    let d;
    try { d = await req.json(); } catch { return new Response('Bad request', { status: 400, headers: cors }); }

    const clean = v => String(v ?? '').slice(0, 300);
    const text = d.type === 'order'
      ? `🛒 New order\n${clean(d.name)} ${clean(d.phone)}\n${(d.items || []).map(clean).join(', ')}\nTotal: ${clean(d.total)}`
      : `📩 New enquiry\nName: ${clean(d.name)}\nPhone: ${clean(d.phone)}\nGoal: ${clean(d.goal)}`;

    const r = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: env.CHAT_ID, text }),
    });
    return new Response(r.ok ? 'ok' : 'telegram error', { status: r.ok ? 200 : 502, headers: cors });
  },
};
