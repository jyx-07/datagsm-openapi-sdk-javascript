import { type Mock, vi } from 'vitest';
import { DataGsmClient } from '../client';

export const TEST_BASE_URL = 'https://openapi.test';
export const TEST_API_KEY = 'test-api-key';

export interface MockResponseInit {
  status?: number;
  body?: unknown;
  headers?: Record<string, string>;
}

export interface CapturedRequest {
  url: URL;
  method: string;
  headers: Record<string, string>;
  body: unknown;
}

export type FetchMock = Mock<(input: string, requestInit?: RequestInit) => Promise<Response>>;

export function mockFetch(init: MockResponseInit = {}): FetchMock {
  const status = init.status ?? 200;
  const hasBody = init.body !== undefined && status !== 204;
  const fetchMock: FetchMock = vi.fn((_input: string, _requestInit?: RequestInit) =>
    Promise.resolve(
      new Response(hasBody ? JSON.stringify(init.body) : null, {
        status,
        headers: init.headers,
      }),
    ),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

export function lastRequest(fetchMock: FetchMock): CapturedRequest {
  const call = fetchMock.mock.lastCall;
  if (!call) {
    throw new Error('fetch was not called');
  }
  const [input, requestInit] = call;
  const rawBody = requestInit?.body;
  return {
    url: new URL(input),
    method: requestInit?.method ?? 'GET',
    headers: (requestInit?.headers ?? {}) as Record<string, string>,
    body: typeof rawBody === 'string' ? (JSON.parse(rawBody) as unknown) : rawBody,
  };
}

export function createClient(): DataGsmClient {
  return new DataGsmClient({ apiKey: TEST_API_KEY, baseUrl: TEST_BASE_URL });
}

export function okEnvelope<T>(data: T) {
  return { status: 'OK', code: 200, message: 'OK', data };
}
