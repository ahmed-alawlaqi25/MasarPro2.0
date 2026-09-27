const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('./app');

async function setup(t, options = {}) {
  const sends = [];
  const app = createApp({ env: { RESEND_API_KEY: 'test-key', MAIN_EMAIL: 'owner@example.com' },
    fetchEmail: async (_url, request) => { sends.push(JSON.parse(request.body)); return { ok: true }; }, ...options });
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const post = async (data, raw = false) => fetch(`http://127.0.0.1:${server.address().port}/api/contact`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: raw ? data : JSON.stringify(data),
  });
  return { post, sends };
}
const valid = { name: 'Ahmed', email: 'visitor@example.com', message: 'Hello MasarPro' };

test('sends escaped content to configured recipient with visitor reply-to', async t => {
  const { post, sends } = await setup(t);
  const response = await post({ ...valid, name: '<Ahmed>', message: '<script>alert(1)</script>\nمرحبا', to: 'attacker@example.com' });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.deepEqual(sends[0].to, ['owner@example.com']);
  assert.equal(sends[0].reply_to, valid.email);
  assert.equal(sends[0].from, 'MasarPro <noreply@masarpro.app>');
  assert.ok(sends[0].html.includes('&lt;script&gt;'));
  assert.ok(!sends[0].html.includes('<script>'));
  assert.ok(sends[0].text.includes('مرحبا'));
});
test('rejects invalid fields and malformed JSON without sending', async t => {
  const { post, sends } = await setup(t);
  for (const body of [{}, { ...valid, name: ' ' }, { ...valid, email: 'bad' }, { ...valid, message: 'x'.repeat(5001) }, { ...valid, name: 'Name\r\nHeader' }]) {
    assert.equal((await post(body)).status, 400);
  }
  assert.equal((await post('{', true)).status, 400);
  assert.equal(sends.length, 0);
});
test('honeypot does not send email', async t => {
  const { post, sends } = await setup(t);
  assert.equal((await post({ ...valid, website: 'spam' })).status, 200);
  assert.equal(sends.length, 0);
});
test('limits repeated submissions and expires the limit', async t => {
  let time = 0;
  const { post, sends } = await setup(t, { now: () => time });
  for (let index = 0; index < 5; index++) assert.equal((await post(valid)).status, 200);
  const response = await post(valid);
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('retry-after'), '900');
  assert.equal(sends.length, 5);
  time = 900001;
  assert.equal((await post(valid)).status, 200);
});
test('reports missing configuration without sending', async t => {
  const { post, sends } = await setup(t, { env: {} });
  assert.equal((await post(valid)).status, 503);
  assert.equal(sends.length, 0);
});
test('provider errors and network failures do not return success or secrets', async t => {
  for (const fetchEmail of [async () => ({ ok: false }), async () => { throw new Error('secret-provider-details'); }]) {
    const { post } = await setup(t, { fetchEmail });
    const response = await post(valid);
    assert.equal(response.status, 502);
    assert.deepEqual(await response.json(), { code: 'SEND_FAILED' });
  }
});
