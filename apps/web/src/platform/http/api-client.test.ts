import { describe, expect, it, vi } from 'vitest';
import { ApiClient } from './api-client';

describe('ApiClient', () => {
  it('uses an injectable transport boundary', async () => {
    const fetchImplementation = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    const client = new ApiClient({
      baseUrl: 'http://localhost:3000/api/v1',
      fetchImplementation,
    });

    await expect(client.get('/health')).resolves.toEqual({ status: 'ok' });
    expect(fetchImplementation).toHaveBeenCalledOnce();
  });
});
