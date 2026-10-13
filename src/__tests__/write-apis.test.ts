import { afterEach, describe, expect, it, vi } from 'vitest';
import { ConflictError, NotFoundError } from '../errors';
import type { ClubRequest } from '../types/clubs';
import type { CreateProjectRequest, UpdateProjectRequest } from '../types/projects';
import type { CreateStudentRequest, UpdateStudentRequest } from '../types/students';
import { abolishedClub, activeProject, graduateStudent } from './fixtures';
import { createClient, lastRequest, mockFetch, okEnvelope } from './helpers';

afterEach(() => {
  vi.unstubAllGlobals();
});

const createStudentReq: CreateStudentRequest = {
  name: '홍길동',
  sex: 'MAN',
  email: 's25001@gsm.hs.kr',
  grade: 1,
  classNum: 1,
  number: 1,
};

const updateStudentReq: UpdateStudentRequest = {
  ...createStudentReq,
  grade: 2,
  classNum: 3,
  number: 4,
  role: 'GENERAL_STUDENT',
  githubId: 'torvalds',
};

const clubReq: ClubRequest = {
  name: 'SW개발동아리',
  type: 'MAJOR_CLUB',
  leaderId: 1,
  participantIds: [2, 3],
  foundedYear: 2022,
  status: 'ACTIVE',
};

const createProjectReq: CreateProjectRequest = {
  name: 'DataGSM 프로젝트',
  description: '학교 데이터를 제공하는 API 서비스',
  startYear: 2024,
  participantIds: [1],
  categories: ['TEAM', 'CLUB'],
};

describe('StudentsApi 쓰기', () => {
  it('createStudent는 POST /v1/students로 본문을 보낸다', async () => {
    const fetchMock = mockFetch({ body: okEnvelope(graduateStudent) });

    const res = await createClient().students().createStudent(createStudentReq);

    const req = lastRequest(fetchMock);
    expect(req.method).toBe('POST');
    expect(req.url.pathname).toBe('/v1/students');
    expect(req.body).toEqual(createStudentReq);
    expect(res.data).toEqual(graduateStudent);
  });

  it('updateStudent는 PUT /v1/students/{id}로 본문을 보낸다', async () => {
    const fetchMock = mockFetch({ body: okEnvelope(graduateStudent) });

    await createClient().students().updateStudent(7, updateStudentReq);

    const req = lastRequest(fetchMock);
    expect(req.method).toBe('PUT');
    expect(req.url.pathname).toBe('/v1/students/7');
    expect(req.body).toEqual(updateStudentReq);
  });

  it('중복 이메일 409를 ConflictError로 던진다', async () => {
    mockFetch({ status: 409, body: { message: '이미 존재하는 이메일입니다.' } });

    await expect(createClient().students().createStudent(createStudentReq)).rejects.toBeInstanceOf(
      ConflictError,
    );
  });

  it.each([0, -1, 1.5, Number.NaN])('잘못된 ID(%s)는 요청 전에 거절한다', async (id) => {
    const fetchMock = mockFetch({ body: okEnvelope(graduateStudent) });

    await expect(createClient().students().updateStudent(id, updateStudentReq)).rejects.toThrow(
      TypeError,
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('ClubsApi 쓰기', () => {
  it('createClub은 POST /v1/clubs로 본문을 보낸다', async () => {
    const fetchMock = mockFetch({ body: okEnvelope(abolishedClub) });

    const res = await createClient().clubs().createClub(clubReq);

    const req = lastRequest(fetchMock);
    expect(req.method).toBe('POST');
    expect(req.url.pathname).toBe('/v1/clubs');
    expect(req.body).toEqual(clubReq);
    expect(res.data.id).toBe(abolishedClub.id);
  });

  it('updateClub은 PUT /v1/clubs/{id}로 본문을 보낸다', async () => {
    const fetchMock = mockFetch({ body: okEnvelope(abolishedClub) });

    await createClient().clubs().updateClub(3, clubReq);

    const req = lastRequest(fetchMock);
    expect(req.method).toBe('PUT');
    expect(req.url.pathname).toBe('/v1/clubs/3');
  });

  it('deleteClub은 DELETE /v1/clubs/{id}를 보내고 204 응답에 undefined를 반환한다', async () => {
    const fetchMock = mockFetch({ status: 204 });

    await expect(createClient().clubs().deleteClub(3)).resolves.toBeUndefined();

    const req = lastRequest(fetchMock);
    expect(req.method).toBe('DELETE');
    expect(req.url.pathname).toBe('/v1/clubs/3');
    expect(req.body).toBeUndefined();
  });

  it('deleteClub은 빈 200 응답도 처리한다', async () => {
    mockFetch({ status: 200 });

    await expect(createClient().clubs().deleteClub(3)).resolves.toBeUndefined();
  });

  it('없는 동아리 삭제 시 NotFoundError를 던진다', async () => {
    mockFetch({ status: 404, body: { message: '동아리를 찾을 수 없습니다.' } });

    await expect(createClient().clubs().deleteClub(999)).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe('ProjectsApi 쓰기', () => {
  it('createProject는 POST /v1/projects로 categories를 포함한 본문을 보낸다', async () => {
    const fetchMock = mockFetch({ body: okEnvelope(activeProject) });

    const res = await createClient().projects().createProject(createProjectReq);

    const req = lastRequest(fetchMock);
    expect(req.method).toBe('POST');
    expect(req.url.pathname).toBe('/v1/projects');
    expect(req.body).toEqual(createProjectReq);
    expect(res.data.categories).toEqual([]);
  });

  it('updateProject는 categories를 생략하면 본문에서도 생략하고 빈 배열은 그대로 보낸다', async () => {
    const fetchMock = mockFetch({ body: okEnvelope(activeProject) });
    const base: UpdateProjectRequest = {
      name: 'DataGSM 프로젝트',
      description: '설명',
      startYear: 2024,
      participantIds: [],
    };

    await createClient().projects().updateProject(5, base);
    const omitted = lastRequest(fetchMock);
    await createClient()
      .projects()
      .updateProject(5, { ...base, categories: [] });
    const cleared = lastRequest(fetchMock);

    expect(omitted.method).toBe('PUT');
    expect(omitted.url.pathname).toBe('/v1/projects/5');
    expect(omitted.body).not.toHaveProperty('categories');
    expect(cleared.body).toHaveProperty('categories', []);
  });

  it('deleteProject는 DELETE /v1/projects/{id}를 보낸다', async () => {
    const fetchMock = mockFetch({ status: 204 });

    await expect(createClient().projects().deleteProject(5)).resolves.toBeUndefined();

    const req = lastRequest(fetchMock);
    expect(req.method).toBe('DELETE');
    expect(req.url.pathname).toBe('/v1/projects/5');
  });

  it('endProject는 POST /v1/projects/{id}/end로 endYear를 보낸다', async () => {
    const fetchMock = mockFetch({ status: 204 });

    await expect(
      createClient().projects().endProject(5, { endYear: 2025 }),
    ).resolves.toBeUndefined();

    const req = lastRequest(fetchMock);
    expect(req.method).toBe('POST');
    expect(req.url.pathname).toBe('/v1/projects/5/end');
    expect(req.body).toEqual({ endYear: 2025 });
  });

  it('reactivateProject는 본문 없이 POST /v1/projects/{id}/reactivate를 보낸다', async () => {
    const fetchMock = mockFetch({ status: 200 });

    await expect(createClient().projects().reactivateProject(5)).resolves.toBeUndefined();

    const req = lastRequest(fetchMock);
    expect(req.method).toBe('POST');
    expect(req.url.pathname).toBe('/v1/projects/5/reactivate');
    expect(req.body).toBeUndefined();
  });
});

// 타입 수준 검증: tsc --noEmit(type-check)에서 확인된다.
export const writeTypeChecks = {
  // @ts-expect-error 수정 API로 졸업생 전환은 허용되지 않는다
  graduateUpdate: { ...updateStudentReq, role: 'GRADUATE' } satisfies UpdateStudentRequest,
  // @ts-expect-error 수정 API는 status를 받지 않는다 (endProject/reactivateProject 사용)
  statusUpdate: { ...createProjectReq, status: 'ENDED' } satisfies UpdateProjectRequest,
  // @ts-expect-error 요청 카테고리는 알려진 값만 허용한다
  unknownCategory: { ...createProjectReq, categories: ['UNKNOWN'] } satisfies CreateProjectRequest,
};
