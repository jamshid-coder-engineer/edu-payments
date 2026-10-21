import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, apiRequest } from '../api-client';

const mockFetch = (impl: () => Promise<Response>) =>
  vi.stubGlobal('fetch', vi.fn(impl));

afterEach(() => vi.unstubAllGlobals());

describe('apiRequest', () => {
  it('muvaffaqiyatli javobni qaytaradi', async () => {
    mockFetch(async () => Response.json([{ id: 1 }]));
    await expect(apiRequest('/students')).resolves.toEqual([{ id: 1 }]);
  });

  it('backend xabarlarini ApiError ichida beradi', async () => {
    mockFetch(async () =>
      Response.json(
        { message: ["Summa musbat bo'lishi kerak"] },
        { status: 400 },
      ),
    );
    const error = await apiRequest('/payments').catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 400,
      messages: ["Summa musbat bo'lishi kerak"],
    });
  });

  it('server ishlamasa tushunarli xabar beradi', async () => {
    mockFetch(async () => {
      throw new TypeError('Failed to fetch');
    });
    await expect(apiRequest('/debtors')).rejects.toMatchObject({ status: 0 });
  });
});
