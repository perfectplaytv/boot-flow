import test from 'node:test';
import assert from 'node:assert/strict';

test('supabase configuration available', { skip: !process.env.VITE_SUPABASE_URL && !process.env.SUPABASE_URL }, () => {
  const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
  assert.ok(url && url.startsWith('http'), 'Supabase URL deve estar configurada');
});

test('supabase health endpoint responde', { timeout: 5_000, skip: !process.env.VITE_SUPABASE_URL }, async () => {
  const response = await fetch(`${process.env.VITE_SUPABASE_URL}/rest/v1/`, {
    method: 'HEAD',
    headers: { apikey: process.env.VITE_SUPABASE_ANON_KEY ?? '' },
  });
  assert.ok([200, 204].includes(response.status), 'Supabase REST deve responder com sucesso');
});
