/** Backend bilan ishlash. Vite /api ni backendga yo'naltiradi (vite.config.ts). */

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

/** Backend xatosi: foydalanuvchiga ko'rsatiladigan xabarlar bilan. */
export class ApiError extends Error {
  readonly status: number;
  readonly messages: string[];

  constructor(status: number, messages: string[]) {
    super(messages.join('. '));
    this.name = 'ApiError';
    this.status = status;
    this.messages = messages;
  }
}

/** NestJS xatosi: { message: string | string[] } */
function readMessages(body: unknown, status: number): string[] {
  const message = (body as { message?: unknown } | null)?.message;
  if (Array.isArray(message)) return message.map(String);
  if (typeof message === 'string') return [message];
  return [`Server xatosi (${status})`];
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
  } catch {
    throw new ApiError(0, [
      "Server bilan aloqa yo'q. Backend ishga tushganini tekshiring",
    ]);
  }

  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(response.status, readMessages(body, response.status));
  }
  return body as T;
}
