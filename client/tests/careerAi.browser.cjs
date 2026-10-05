const { chromium } = require('playwright');
const { readFileSync, mkdirSync } = require('node:fs');
const { parseEnv } = require('node:util');
const assert = require('node:assert/strict');
const path = require('node:path');
const { createApp } = require('../../server/src/app');

(async () => {
  const env = parseEnv(readFileSync(path.join(__dirname, '../.env'), 'utf8'));
  const authOrigin = new URL(env.VITE_SUPABASE_URL).origin;
  const project = new URL(authOrigin).hostname.split('.')[0];
  const user = { id: '00000000-0000-4000-8000-000000000001', email: 'test@example.com', user_metadata: { name: 'Test User' }, aud: 'authenticated', role: 'authenticated' };
  const token = `e30.${Buffer.from(JSON.stringify({ sub: user.id, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`;
  const session = { access_token: token, refresh_token: 'test-refresh', token_type: 'bearer', expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, user };
  let stored = { personal: { fullName: 'Sara Ahmed', professionalTitle: 'Frontend Developer', email: 'sara@example.com', location: 'Riyadh' }, summary: 'I build responsive React applications.', experience: [{ position: 'Frontend Developer', company: 'Example Studio', highlights: ['Built accessible React interfaces'] }], skills: [{ category: 'Development', items: 'React, JavaScript, CSS' }] };
  const sampleLetter = 'Dear Hiring Team,\n\nI am applying for the Frontend Developer role at Example Ltd. My experience building responsive React applications aligns with the requirements described in your posting.\n\nAt Example Studio, I built accessible React interfaces. This work strengthened my attention to usability and helped me translate product requirements into clear, maintainable interfaces. I would bring the same care to your development team.\n\nMy background includes React, JavaScript, and CSS. I value readable code, accessible interactions, and layouts which work across different screen sizes. I am interested in contributing these skills to the role and learning more about your team’s priorities.\n\nThank you for considering my application. I welcome the opportunity to discuss how my experience fits your needs.\n\nSincerely,';
  let failAI = false;
  const server = createApp({ env: {} }).listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const output = process.env.QA_OUTPUT_DIR || path.join(__dirname, '../../tmp/ai-checks');
  mkdirSync(output, { recursive: true });
  try {
    await context.addInitScript(({ key, session }) => {
      localStorage.setItem(key, JSON.stringify(session));
      localStorage.setItem('masarpro-language', 'en');
    }, { key: `sb-${project}-auth-token`, session });
    await context.route(`${authOrigin}/**`, async route => {
      const request = route.request();
      const url = new URL(request.url());
      let result = [];
      if (url.pathname.includes('/auth/')) result = user;
      if (url.pathname.includes('/profiles')) result = { name: 'Sara Ahmed' };
      if (url.pathname.includes('/resumes')) {
        if (request.method() === 'PATCH') { stored = request.postDataJSON().content; result = { resume_id: 'demo' }; }
        else if (url.searchParams.get('select') === 'content') result = { content: stored };
        else result = [{ resume_id: 'demo', title: 'Frontend CV' }];
      }
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(result) });
    });
    await context.route(`${base}/api/ai/**`, async route => {
      const payload = route.request().postDataJSON();
      const text = route.request().url().endsWith('/summary') ? 'Frontend developer building accessible, responsive React applications.' : payload.language === 'ar' ? 'فريق التوظيف المحترم،\n\nأتقدم لوظيفة مطور واجهات أمامية. لدي خبرة في تطوير واجهات React متجاوبة وسهلة الاستخدام.\n\nأرحب بفرصة مناقشة خبراتي ومتطلبات الوظيفة مع فريقكم.\n\nمع خالص التقدير،' : sampleLetter;
      await route.fulfill({ status: failAI ? 429 : 200, contentType: 'application/json', body: JSON.stringify(failAI ? { code: 'AI_QUOTA' } : { text }) });
    });
    await page.goto(`${base}/cover-letter/demo`);
    await page.getByLabel('Company name', { exact: true }).fill('Example Ltd');
    await page.getByLabel('Job description', { exact: true }).fill('Frontend developer with React and accessibility experience.');
    await page.screenshot({ path: path.join(output, 'details-desktop.png'), fullPage: true });
    await page.getByRole('button', { name: 'Generate cover letter', exact: true }).click();
    await page.getByLabel('Letter text', { exact: true }).waitFor();
    assert.equal(await page.getByLabel('Letter text', { exact: true }).inputValue(), sampleLetter);
    await page.getByLabel('Letter text', { exact: true }).fill(`${sampleLetter}\n\nEdited by the applicant.`);
    await page.getByText('All changes saved', { exact: true }).waitFor();
    assert.ok(stored.coverLetter.body.endsWith('Edited by the applicant.'));
    await page.reload();
    await page.getByLabel('Letter text', { exact: true }).waitFor();
    assert.ok((await page.getByLabel('Letter text', { exact: true }).inputValue()).endsWith('Edited by the applicant.'));
    await page.screenshot({ path: path.join(output, 'editor-desktop.png'), fullPage: true });
    await page.pdf({ path: path.join(output, 'cover-letter.pdf'), preferCSSPageSize: true, printBackground: true });
    await page.emulateMedia({ media: 'print' });
    assert.equal(await page.getByRole('button', { name: 'Download PDF' }).isVisible(), false);
    assert.equal(await page.locator('#cover-letter-preview').isVisible(), true);
    await page.emulateMedia({ media: 'screen' });
    await page.getByRole('button', { name: 'Back to job details' }).click();
    failAI = true;
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'Generate a new letter' }).click();
    await page.getByRole('alert').filter({ hasText: 'usage limit' }).waitFor();
    assert.ok(stored.coverLetter.body.endsWith('Edited by the applicant.'));
    failAI = false;
    await page.getByLabel('Letter language', { exact: true }).selectOption('ar');
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'Generate a new letter' }).click();
    await page.getByLabel('Letter text', { exact: true }).waitFor();
    assert.equal(await page.locator('#cover-letter-preview').getAttribute('dir'), 'rtl');
    await page.getByText('All changes saved', { exact: true }).waitFor();
    await page.evaluate(() => localStorage.setItem('masarpro-language', 'ar'));
    // The init script sets English on navigation, so update it for subsequent pages.
    await context.addInitScript(() => localStorage.setItem('masarpro-language', 'ar'));
    await page.reload();
    await page.getByLabel('نص الخطاب', { exact: true }).waitFor();
    await page.screenshot({ path: path.join(output, 'editor-arabic.png'), fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    await page.screenshot({ path: path.join(output, 'editor-mobile.png'), fullPage: true });
    for (const width of [768, 1024, 1280]) {
      await page.setViewportSize({ width, height: 1000 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `No horizontal overflow at ${width}px`);
    }
    await context.addInitScript(() => localStorage.setItem('masarpro-language', 'en'));
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${base}/resume-builder/demo`);
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('button', { name: 'Improve with AI' }).click();
    await page.getByRole('button', { name: 'Use suggestion' }).waitFor();
    await page.locator('#professional-summary').fill('My newer summary.');
    assert.equal(await page.getByRole('button', { name: 'Use suggestion' }).isDisabled(), true);
    await page.getByRole('button', { name: 'Improve with AI' }).click();
    await page.getByRole('button', { name: 'Use suggestion' }).click();
    await page.getByText('All changes saved', { exact: true }).waitFor();
    assert.match(stored.summary, /Frontend developer/);
    assert.ok(stored.coverLetter.body.includes('فريق التوظيف'));
    await page.screenshot({ path: path.join(output, 'summary.png'), fullPage: true });
    assert.deepEqual(errors, []);
    console.log('PASS: generation, editing, autosave, reopen, quota failure preserves draft, Arabic, mobile, print isolation, summary review, stale-suggestion protection, and CV/letter persistence.');
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
