# DataGSM OpenAPI SDK for JavaScript

DataGSM의 OpenAPI를 추상화된 환경에서 제공합니다.

[![npm version](https://img.shields.io/npm/v/@themoment-team/datagsm-openapi.svg)](https://www.npmjs.com/package/@themoment-team/datagsm-openapi)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/Node-20%2B-339933.svg)](https://nodejs.org/)

## 설치

```bash
# npm
npm install @themoment-team/datagsm-openapi

# pnpm
pnpm add @themoment-team/datagsm-openapi

# yarn
yarn add @themoment-team/datagsm-openapi
```

## 사용 방법

자세한 사용법은 [기술문서](https://docs.datagsm.kr/api/sdk/javascript)를 참고하십시오.

### 클라이언트 생성

```ts
import { DataGsmClient } from '@themoment-team/datagsm-openapi';

const client = new DataGsmClient({
  apiKey: process.env.DATAGSM_API_KEY!,
  // baseUrl: 'https://openapi.datagsm.kr', // 기본값
  // timeout: 30000, // ms, 기본값
});
```

모든 응답은 서버 공통 응답 형식(`{ status, code, message, data }`)을 그대로 반환합니다.
서버에서 값이 없는 필드는 키가 생략되지 않고 `null`로 내려오므로, 응답 타입의 선택 값은 `T | null`로 선언되어 있습니다.

### 지원 API

| 메서드                              | HTTP                                | 필요 스코프   |
| ----------------------------------- | ----------------------------------- | ------------- |
| `students().getStudents(req?)`      | `GET /v1/students`                  | STUDENT_READ  |
| `students().createStudent(req)`     | `POST /v1/students`                 | STUDENT_WRITE |
| `students().updateStudent(id, req)` | `PUT /v1/students/{id}`             | STUDENT_WRITE |
| `clubs().getClubs(req?)`            | `GET /v1/clubs`                     | CLUB_READ     |
| `clubs().createClub(req)`           | `POST /v1/clubs`                    | CLUB_WRITE    |
| `clubs().updateClub(id, req)`       | `PUT /v1/clubs/{id}`                | CLUB_WRITE    |
| `clubs().deleteClub(id)`            | `DELETE /v1/clubs/{id}`             | CLUB_WRITE    |
| `projects().getProjects(req?)`      | `GET /v1/projects`                  | PROJECT_READ  |
| `projects().createProject(req)`     | `POST /v1/projects`                 | PROJECT_WRITE |
| `projects().updateProject(id, req)` | `PUT /v1/projects/{id}`             | PROJECT_WRITE |
| `projects().deleteProject(id)`      | `DELETE /v1/projects/{id}`          | PROJECT_WRITE |
| `projects().endProject(id, req)`    | `POST /v1/projects/{id}/end`        | PROJECT_WRITE |
| `projects().reactivateProject(id)`  | `POST /v1/projects/{id}/reactivate` | PROJECT_WRITE |
| `neis().getTimetables(req)`         | `GET /v1/neis/timetables`           | NEIS_READ     |
| `neis().getMeals(req?)`             | `GET /v1/neis/meals`                | NEIS_READ     |
| `neis().getSchedules(req?)`         | `GET /v1/neis/schedules`            | NEIS_READ     |
| `health().check()`                  | `GET /v1/health`                    | -             |

삭제, 종료, 재개 API는 응답 본문이 없으므로 `Promise<void>`를 반환합니다.

### 조회 예시

```ts
// 학생
const { data } = await client.students().getStudents({ grade: 2, classNum: 1 });
data.students.forEach((s) => console.log(s.name, s.studentNumber ?? '학번 없음'));

// 프로젝트: status를 생략하면 서버 기본값 ACTIVE가 적용되어 운영 중인 프로젝트만 조회됩니다.
const ended = await client.projects().getProjects({ status: 'ENDED' });

// 프로젝트 카테고리 필터 (단일 값, 해당 카테고리를 포함하는 프로젝트 조회)
const teamProjects = await client.projects().getProjects({ category: 'TEAM' });
teamProjects.data.projects.forEach((p) => console.log(p.name, p.categories));

// 시간표: grade, classNum은 필수이고 date 또는 fromDate/toDate 중 하나가 필요합니다.
await client.neis().getTimetables({ grade: 1, classNum: 2, date: '2025-03-03' });
await client
  .neis()
  .getTimetables({ grade: 1, classNum: 2, fromDate: '2025-03-03', toDate: '2025-03-07' });

// 급식/학사일정: date와 fromDate/toDate는 함께 쓸 수 없습니다. 기간은 최대 365일입니다.
await client.neis().getMeals({ date: '2025-12-15' });
await client.neis().getSchedules({ fromDate: '2025-12-01', toDate: '2025-12-31' });
```

### 쓰기 예시

```ts
// 학생 생성 (재학생은 grade, classNum, number 필수)
const created = await client.students().createStudent({
  name: '홍길동',
  sex: 'MAN',
  email: 's25001@gsm.hs.kr',
  grade: 1,
  classNum: 1,
  number: 1,
});

// 동아리 정보 수정 (전체 교체)
await client.clubs().updateClub(3, {
  name: 'SW개발동아리',
  type: 'MAJOR_CLUB',
  leaderId: 1,
  participantIds: [2, 3, 4],
  foundedYear: 2022,
  status: 'ACTIVE',
});

// 프로젝트 생성: status를 생략하면 ACTIVE로 생성됩니다.
const project = await client.projects().createProject({
  name: 'DataGSM',
  description: '학교 데이터를 제공하는 API 서비스',
  startYear: 2024,
  clubId: 3,
  participantIds: [1, 2],
  categories: ['TEAM', 'CLUB'],
  deploymentUrl: 'https://datagsm.kr',
});

// 프로젝트 수정: categories를 생략하면 기존 값 유지, []이면 모두 해제
await client.projects().updateProject(project.data.id, {
  name: 'DataGSM',
  description: '설명 수정',
  startYear: 2024,
  participantIds: [1, 2],
  categories: [],
});

// 프로젝트 상태 변경은 전용 API를 사용합니다 (updateProject는 status를 바꾸지 않습니다).
await client.projects().endProject(project.data.id, { endYear: 2025 });
await client.projects().reactivateProject(project.data.id);
```

### 프로젝트 카테고리

`TOY_PROJECT`, `TEAM`, `CLUB`, `IDEA_FESTIVAL`, `NOT_DEPLOYED` 중 여러 개를 선택할 수 있습니다.

- 응답의 `Project.categories`는 항상 배열이며 미분류이면 빈 배열입니다.
- 응답 타입 `ProjectCategory`는 서버에 새 값이 추가되어도 깨지지 않도록 알 수 없는 문자열도 허용합니다. `switch`로 분기할 때는 `default`를 두세요.
- 요청(필터, 생성/수정)에는 `KnownProjectCategory`만 사용할 수 있습니다.

### 에러 처리

```ts
import {
  ConflictError,
  NotFoundError,
  RateLimitError,
  DataGsmError,
} from '@themoment-team/datagsm-openapi';

try {
  await client.clubs().createClub({
    /* ... */
  });
} catch (e) {
  if (e instanceof ConflictError) {
    // 409: 이름, 이메일, 학번 등 중복
  } else if (e instanceof NotFoundError) {
    // 404
  } else if (e instanceof RateLimitError) {
    console.log(e.retryAfter);
  } else if (e instanceof DataGsmError) {
    console.log(e.statusCode, e.message);
  }
}
```

| 에러                | 상태 코드                                  |
| ------------------- | ------------------------------------------ |
| `BadRequestError`   | 400                                        |
| `UnauthorizedError` | 401                                        |
| `ForbiddenError`    | 403                                        |
| `NotFoundError`     | 404                                        |
| `ConflictError`     | 409                                        |
| `RateLimitError`    | 429                                        |
| `ServerError`       | 5xx                                        |
| `NetworkError`      | 네트워크 오류, 타임아웃                    |
| `DataGsmError`      | 위에 해당하지 않는 오류 (공통 부모 클래스) |
