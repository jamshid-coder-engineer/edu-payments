import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { vi } from 'vitest';

/** Har test uchun alohida kesh: testlar bir-biriga ta'sir qilmaydi. */
export function renderWithQuery(ui: React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  );
}

type Handler = (init?: RequestInit) => Response | Promise<Response>;

/**
 * fetch o'rniga soxta backend: "METHOD /yo'l" -> javob.
 * Ro'yxatda yo'q so'rov 404 qaytaradi. Chaqiruvlar ro'yxati tekshirish uchun qaytadi.
 */
export function mockApi(routes: Record<string, Handler>) {
  const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
    const path = url.replace(/^\/api/, '').split('?')[0];
    const handler = routes[`${init?.method ?? 'GET'} ${path}`];
    return handler
      ? handler(init)
      : Response.json({ message: 'Topilmadi' }, { status: 404 });
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}
