const { readFileSync, existsSync } = require('node:fs');
const path = require('node:path');
const { parseEnv } = require('node:util');
const { createApp } = require('./src/app');

// Load only server settings. Deployment variables take precedence.
for (const filename of [path.join(__dirname, '.env'), path.join(__dirname, '../.env'), path.join(__dirname, '../client/.env')]) {
  if (!existsSync(filename)) continue;
  const values = parseEnv(readFileSync(filename, 'utf8'));
  for (const key of ['RESEND_API_KEY', 'MAIN_EMAIL', 'PORT', 'GEMINI_API_KEY', 'GEMINI_MODEL', 'SUPABASE_URL', 'SUPABASE_PUBLISHABLE_KEY', 'VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY']) {
    if (!process.env[key] && values[key]) process.env[key] = values[key];
  }
}
const port = Number(process.env.PORT) || 3001;
createApp().listen(port, () => console.log(`MasarPro server listening on port ${port}`));
