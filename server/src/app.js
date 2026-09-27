const express = require('express');
const path = require('node:path');
const { existsSync } = require('node:fs');
const escapeHtml = value => value.replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);

function createApp({ env = process.env, fetchEmail = fetch, now = Date.now } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '24kb' }));
  const attempts = new Map();
  app.post('/api/contact', async (req, res) => {
    if (!req.is('application/json')) return res.status(415).json({ code: 'INVALID_INPUT' });
    const { name, email, message, website } = req.body || {};
    if (website) return res.json({ success: true });
    if (![name, email, message].every(value => typeof value === 'string')) return res.status(400).json({ code: 'INVALID_INPUT' });
    const fields = { name: name.trim(), email: email.trim(), message: message.trim() };
    if (!fields.name || fields.name.length > 100 || /[\r\n]/.test(fields.name)
      || fields.email.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(fields.email)
      || !fields.message || fields.message.length > 5000) return res.status(400).json({ code: 'INVALID_INPUT' });
    if (!env.RESEND_API_KEY || !env.MAIN_EMAIL) return res.status(503).json({ code: 'UNAVAILABLE' });
    const time = now();
    for (const [ip, value] of attempts) if (value.expires <= time) attempts.delete(ip);
    const attempt = attempts.get(req.ip) || { count: 0, expires: time + 900000 };
    if (attempt.count >= 5) {
      res.set('Retry-After', String(Math.ceil((attempt.expires - time) / 1000)));
      return res.status(429).json({ code: 'RATE_LIMITED' });
    }
    attempt.count += 1;
    attempts.set(req.ip, attempt);
    try {
      const response = await fetchEmail('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(15000),
        body: JSON.stringify({
          from: 'MasarPro <noreply@masarpro.app>', to: [env.MAIN_EMAIL], reply_to: fields.email,
          subject: `Contact-Us Form - ${fields.name}`,
          text: `New Contact Form\n\nName: ${fields.name}\nEmail: ${fields.email}\n\nMessage:\n${fields.message}`,
          html: `<h2>New Contact Form</h2><p><strong>Name:</strong> ${escapeHtml(fields.name)}</p><p><strong>Email:</strong> ${escapeHtml(fields.email)}</p><p><strong>Message:</strong></p><p style="white-space:pre-wrap">${escapeHtml(fields.message)}</p>`,
        }),
      });
      if (!response.ok) return res.status(502).json({ code: 'SEND_FAILED' });
      return res.json({ success: true });
    } catch { return res.status(502).json({ code: 'SEND_FAILED' }); }
  });
  app.use('/api', (_req, res) => res.status(404).json({ code: 'NOT_FOUND' }));
  const dist = path.join(__dirname, '../../client/dist');
  if (existsSync(path.join(dist, 'index.html'))) {
    app.use(express.static(dist));
    app.get(/.*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')));
  }
  app.use((error, _req, res, _next) => {
    res.status(error.type === 'entity.too.large' ? 413 : 400).json({ code: 'INVALID_INPUT' });
  });
  return app;
}
module.exports = { createApp };
