import { afterEach, describe, expect, it, vi } from 'vitest';
import { abolishedClub, activeProject, graduateStudent } from './fixtures';
import { createClient, lastRequest, mockFetch, okEnvelope } from './helpers';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('StudentsApi.getStudents', () => {
  it('필터를 쿼리로 보내고 null 필드를 그대로 반환한다', async () => {
    const fetchMock = mockFetch({
      body: okEnvelope({ totalPages: 1, totalElements: 1, students: [graduateStudent] }),
    });

    const res = await createClient().students().getStudents({ includeGraduates: true, page: 0 });

    const req = lastRequest(fetchMock);
    expect(req.method).toBe('GET');
    expect(req.url.pathname).toBe('/v1/students');
    expect(Object.fromEntries(req.url.searchParams)).toEqual({
      includeGraduates: 'true',
      page: '0',
    });
    expect(res.data.students[0]?.studentNumber).toBeNull();
    expect(res.data.students[0]?.majorClub).toBeNull();
  });
});

describe('ClubsApi.getClubs', () => {
  it('필터를 쿼리로 보내고 null 부장과 학번을 그대로 반환한다', async () => {
    const fetchMock = mockFetch({
      body: okEnvelope({ totalPages: 1, totalElements: 1, clubs: [abolishedClub] }),
    });

    const res = await createClient().clubs().getClubs({ clubStatus: 'ABOLISHED' });

    expect(Object.fromEntries(lastRequest(fetchMock).url.searchParams)).toEqual({
      clubStatus: 'ABOLISHED',
    });
    expect(res.data.clubs[0]?.leader).toBeNull();
    expect(res.data.clubs[0]?.participants[0]?.studentNumber).toBeNull();
  });
});

describe('ProjectsApi.getProjects', () => {
  it('필터를 쿼리로 보내고 null 필드를 그대로 반환한다', async () => {
    const fetchMock = mockFetch({
      body: okEnvelope({ totalPages: 1, totalElements: 1, projects: [activeProject] }),
    });

    const res = await createClient().projects().getProjects({ clubId: 3, status: 'ENDED' });

    const req = lastRequest(fetchMock);
    expect(req.url.pathname).toBe('/v1/projects');
    expect(Object.fromEntries(req.url.searchParams)).toEqual({ clubId: '3', status: 'ENDED' });
    expect(res.data.projects[0]?.club).toBeNull();
    expect(res.data.projects[0]?.endYear).toBeNull();
  });
});
