import { afterEach, describe, expect, it, vi } from 'vitest';
import type { GetMealsRequest, GetSchedulesRequest, GetTimetablesRequest } from '../types/neis';
import { createClient, lastRequest, mockFetch, okEnvelope } from './helpers';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('NeisApi', () => {
  describe('getTimetables', () => {
    it('grade, classNum, date를 쿼리로 보낸다', async () => {
      const fetchMock = mockFetch({ body: okEnvelope({ timetables: [] }) });

      await createClient().neis().getTimetables({ grade: 1, classNum: 2, date: '2025-03-03' });

      const req = lastRequest(fetchMock);
      expect(req.url.pathname).toBe('/v1/neis/timetables');
      expect(Object.fromEntries(req.url.searchParams)).toEqual({
        grade: '1',
        classNum: '2',
        date: '2025-03-03',
      });
    });

    it('기간 조회 시 fromDate, toDate만 보내고 검증용 가짜 파라미터는 보내지 않는다', async () => {
      const fetchMock = mockFetch({ body: okEnvelope({ timetables: [] }) });

      await createClient()
        .neis()
        .getTimetables({ grade: 3, classNum: 4, fromDate: '2025-03-03', toDate: '2025-03-07' });

      const params = Object.fromEntries(lastRequest(fetchMock).url.searchParams);
      expect(params).toEqual({
        grade: '3',
        classNum: '4',
        fromDate: '2025-03-03',
        toDate: '2025-03-07',
      });
      expect(Object.keys(params).some((key) => key.startsWith('is'))).toBe(false);
    });
  });

  describe('getMeals', () => {
    it('날짜 조건 없이 호출할 수 있다', async () => {
      const fetchMock = mockFetch({ body: okEnvelope({ meals: [] }) });

      await createClient().neis().getMeals();

      const req = lastRequest(fetchMock);
      expect(req.url.pathname).toBe('/v1/neis/meals');
      expect([...req.url.searchParams.keys()]).toEqual([]);
    });

    it('기간 조건만 쿼리로 보낸다', async () => {
      const fetchMock = mockFetch({ body: okEnvelope({ meals: [] }) });

      await createClient().neis().getMeals({ fromDate: '2025-12-01', toDate: '2025-12-31' });

      expect(Object.fromEntries(lastRequest(fetchMock).url.searchParams)).toEqual({
        fromDate: '2025-12-01',
        toDate: '2025-12-31',
      });
    });
  });

  describe('getSchedules', () => {
    it('date 조건을 쿼리로 보낸다', async () => {
      const fetchMock = mockFetch({ body: okEnvelope({ schedules: [] }) });

      await createClient().neis().getSchedules({ date: '2025-12-15' });

      const req = lastRequest(fetchMock);
      expect(req.url.pathname).toBe('/v1/neis/schedules');
      expect(Object.fromEntries(req.url.searchParams)).toEqual({ date: '2025-12-15' });
    });
  });
});

// 타입 수준 검증: tsc --noEmit(type-check)에서 확인된다.
export const timetableTypeChecks: GetTimetablesRequest[] = [
  { grade: 1, classNum: 1, date: '2025-03-03' },
  { grade: 1, classNum: 1, fromDate: '2025-03-03', toDate: '2025-03-07' },
  { grade: 1, classNum: 1, fromDate: '2025-03-03' },
  { grade: 1, classNum: 1, toDate: '2025-03-07' },
  // @ts-expect-error 날짜 조건이 하나도 없으면 안 된다
  { grade: 1, classNum: 1 },
  // @ts-expect-error grade, classNum은 필수다
  { date: '2025-03-03' },
  // @ts-expect-error date와 fromDate/toDate는 함께 쓸 수 없다
  { grade: 1, classNum: 1, date: '2025-03-03', fromDate: '2025-03-01' },
  // @ts-expect-error 서버 검증 메서드는 쿼리 파라미터가 아니다
  { grade: 1, classNum: 1, date: '2025-03-03', isDateRequired: true },
];

export const mealTypeChecks: GetMealsRequest[] = [
  {},
  { date: '2025-12-15' },
  { fromDate: '2025-12-01' },
  // @ts-expect-error date와 toDate는 함께 쓸 수 없다
  { date: '2025-12-15', toDate: '2025-12-31' },
  // @ts-expect-error 서버 검증 메서드는 쿼리 파라미터가 아니다
  { isValidDateRange: true },
];

export const scheduleTypeChecks: GetSchedulesRequest[] = [
  {},
  // @ts-expect-error date와 fromDate는 함께 쓸 수 없다
  { date: '2025-12-15', fromDate: '2025-12-01' },
];
