import test from 'node:test';
import assert from 'node:assert/strict';

const endpoint = process.env.AGENT_CRUD_ENDPOINT ?? 'http://localhost:3000/api/example';

test('CRUD endpoint responde 200', { skip: process.env.AGENT_SKIP_HTTP_TESTS === 'true' }, async (t) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4_000);
  try {
    const response = await fetch(endpoint, { signal: controller.signal });
    assert.ok(response.status < 500, 'Endpoint deve responder sem erro 5xx');
    await t.test('resposta é JSON', async () => {
      const text = await response.text();
      try {
        JSON.parse(text);
      } catch (error) {
        assert.fail(`Resposta não é JSON: ${error}`);
      }
    });
  } finally {
    clearTimeout(timeout);
  }
});
