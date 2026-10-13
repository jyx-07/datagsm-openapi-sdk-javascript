import { afterEach, describe, expect, it, vi } from 'vitest';
import { HttpClient } from '../http/client';
import {
  BadRequestError,
  ConflictError,
  DataGsmError,
  ForbiddenError,
  NetworkError,
  NotFoundError,
  RateLimitError,
  ServerError,
  UnauthorizedError,
} from '../errors';
import { TEST_API_KEY, TEST_BASE_URL, lastRequest, mockFetch } from './helpers';

function createHttpClient() {
  return new HttpClient({ baseUrl: TEST_BASE_URL, apiKey: TEST_API_KEY });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('HttpClient', () => {
  it('API 키 헤더를 붙이고 undefined 쿼리 파라미터는 생략한다', async () => {
    const fetchMock = mockFetch({ body: { ok: true } });

    await createHttpClient().request({
      method: 'GET',
      path: '/v1/students',
      query: { name: '홍길동', grade: 1, includeGraduates: false, email: undefined },
    });

    const req = lastRequest(fetchMock);
    expect(req.headers['X-API-KEY']).toBe(TEST_API_KEY);
    expect(req.url.pathname).toBe('/v1/students');
    expect(Object.fromEntries(req.url.searchParams)).toEqual({
      name: '홍길동',
      grade: '1',
      includeGraduates: 'false',
    });
  });

  it('성공 응답의 JSON 본문을 그대로 반환한다', async () => {
    const body = { status: 'OK', code: 200, message: 'OK', data: { value: 1 } };
    mockFetch({ body });

    await expect(createHttpClient().request({ method: 'GET', path: '/x' })).resolves.toEqual(body);
  });

  it.each([
    [400, BadRequestError],
    [401, UnauthorizedError],
    [403, ForbiddenError],
    [404, NotFoundError],
    [500, ServerError],
    [503, ServerError],
  ])('%i 응답을 대응하는 에러로 변환한다', async (status, ErrorClass) => {
    mockFetch({ status, body: { status: 'ERROR', code: status, message: '에러 메시지' } });

    const promise = createHttpClient().request({ method: 'GET', path: '/x' });

    await expect(promise).rejects.toBeInstanceOf(ErrorClass);
    await expect(promise).rejects.toMatchObject({ statusCode: status, message: '에러 메시지' });
  });

  it('429 응답에서 Retry-After 헤더를 읽는다', async () => {
    mockFetch({ status: 429, body: { message: 'too many' }, headers: { 'Retry-After': '30' } });

    const promise = createHttpClient().request({ method: 'GET', path: '/x' });

    await expect(promise).rejects.toBeInstanceOf(RateLimitError);
    await expect(promise).rejects.toMatchObject({ retryAfter: 30 });
  });

  it('매핑되지 않은 4xx는 DataGsmError로 변환한다', async () => {
    mockFetch({ status: 418, body: { message: 'teapot' } });

    const promise = createHttpClient().request({ method: 'GET', path: '/x' });

    await expect(promise).rejects.toBeInstanceOf(DataGsmError);
    await expect(promise).rejects.toMatchObject({ statusCode: 418 });
  });

  it('fetch 실패를 NetworkError로 감싼다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new TypeError('fetch failed'))),
    );

    await expect(createHttpClient().request({ method: 'GET', path: '/x' })).rejects.toBeInstanceOf(
      NetworkError,
    );
  });
});

describe('HttpClient 쓰기 요청', () => {
  it('POST 본문을 JSON으로 직렬화한다', async () => {
    const fetchMock = mockFetch({ body: { status: 'OK', code: 200, message: 'OK', data: {} } });

    await createHttpClient().post('/v1/clubs', { name: '동아리', participantIds: [] });

    const req = lastRequest(fetchMock);
    expect(req.method).toBe('POST');
    expect(req.headers['Content-Type']).toBe('application/json');
    expect(req.body).toEqual({ name: '동아리', participantIds: [] });
  });

  it('falsy 본문도 생략하지 않고 직렬화한다', async () => {
    const fetchMock = mockFetch({ status: 204 });

    await createHttpClient().put('/x', 0);

    expect(fetchMock.mock.lastCall?.[1]?.body).toBe('0');
  });

  it('본문이 없으면 body를 보내지 않는다', async () => {
    const fetchMock = mockFetch({ status: 204 });

    await createHttpClient().delete('/v1/clubs/1');

    const req = lastRequest(fetchMock);
    expect(req.method).toBe('DELETE');
    expect(req.body).toBeUndefined();
  });

  it('204 No Content 응답을 undefined로 처리한다', async () => {
    mockFetch({ status: 204 });

    await expect(createHttpClient().requestVoid({ method: 'DELETE', path: '/x' })).resolves.toBe(
      undefined,
    );
  });

  it('본문이 빈 200 응답을 undefined로 처리한다', async () => {
    mockFetch({ status: 200 });

    await expect(createHttpClient().post('/x')).resolves.toBeUndefined();
  });

  it('requestVoid는 envelope 본문이 와도 무시한다', async () => {
    mockFetch({ body: { status: 'OK', code: 200, message: 'OK' } });

    await expect(createHttpClient().requestVoid({ method: 'POST', path: '/x' })).resolves.toBe(
      undefined,
    );
  });

  it('성공 응답의 본문이 JSON이 아니면 DataGsmError를 던진다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(new Response('<html>', { status: 200 }))),
    );

    await expect(createHttpClient().get('/x')).rejects.toMatchObject({
      name: 'DataGsmError',
      statusCode: 200,
    });
  });

  it('409 응답을 ConflictError로 변환한다', async () => {
    mockFetch({
      status: 409,
      body: { status: 'CONFLICT', code: 409, message: '이미 존재하는 동아리 이름입니다.' },
    });

    const promise = createHttpClient().post('/v1/clubs', {});

    await expect(promise).rejects.toBeInstanceOf(ConflictError);
    await expect(promise).rejects.toMatchObject({
      statusCode: 409,
      message: '이미 존재하는 동아리 이름입니다.',
    });
  });
});
