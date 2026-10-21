import type { ApiResponse, ClubSummary, ParticipantInfo, SortDirection } from './index';

export type ProjectSortBy = 'ID' | 'NAME';
export type ProjectStatus = 'ACTIVE' | 'ENDED';

/**
 * 현재 SDK가 알고 있는 프로젝트 카테고리입니다.
 * - `TOY_PROJECT`: 토이 프로젝트
 * - `TEAM`: 팀 프로젝트
 * - `CLUB`: 동아리 프로젝트
 * - `IDEA_FESTIVAL`: 아이디어페스티벌
 * - `NOT_DEPLOYED`: 미배포
 *
 * 요청(필터, 생성/수정)에는 이 값만 사용할 수 있습니다. 서버는 알 수 없는 값을 400으로 거절합니다.
 */
export type KnownProjectCategory =
  | 'TOY_PROJECT'
  | 'TEAM'
  | 'CLUB'
  | 'IDEA_FESTIVAL'
  | 'NOT_DEPLOYED';

/**
 * 응답에 포함되는 프로젝트 카테고리입니다.
 * 서버에 새 카테고리가 추가되어도 타입이 깨지지 않도록 알 수 없는 문자열도 허용합니다.
 * `switch`로 분기할 때는 `default` 분기를 두세요.
 */
export type ProjectCategory = KnownProjectCategory | (string & {});

export interface Project {
  id: number;
  name: string;
  description: string;
  club: ClubSummary | null;
  participants: ParticipantInfo[];
  startYear: number;
  endYear: number | null;
  status: ProjectStatus;
  /** 프로젝트 카테고리 목록 (다중 선택). 미분류이면 빈 배열입니다. */
  categories: ProjectCategory[];
  /** 프로젝트 아이콘 URL */
  iconUrl: string | null;
  /** 프로젝트 아이콘 오브젝트 키. 수정 요청에서 생략하면 이 값이 유지됩니다. */
  iconKey: string | null;
  /** 프로젝트 배포 URL */
  deploymentUrl: string | null;
  /** Max 20 items, each up to 300 characters. */
  repositories: string[];
  /** Max 20 items, each up to 50 characters. */
  techStacks: string[];
}

export interface GetProjectsRequest {
  projectId?: number;
  projectName?: string;
  clubId?: number;
  /** 운영 상태. 생략하면 서버 기본값 `ACTIVE`가 적용되어 운영 중인 프로젝트만 조회됩니다. */
  status?: ProjectStatus;
  /** 지정한 카테고리를 포함하는 프로젝트만 조회합니다. 생략하면 카테고리와 무관하게 조회합니다. */
  category?: KnownProjectCategory;
  page?: number;
  size?: number;
  sortBy?: ProjectSortBy;
  sortDirection?: SortDirection;
}

export type GetProjectsResponse = ApiResponse<{
  totalPages: number;
  totalElements: number;
  projects: Project[];
}>;

/** 프로젝트 생성 요청 (POST /v1/projects) */
export interface CreateProjectRequest {
  /** 최대 100자 */
  name: string;
  /** 최대 500자 */
  description: string;
  startYear: number;
  /** 소유 동아리 ID */
  clubId?: number | null;
  /** 참가자 학생 ID 목록 */
  participantIds: number[];
  /** 운영 상태. 생략하면 서버 기본값 `ACTIVE`가 적용됩니다. */
  status?: ProjectStatus;
  /** 카테고리 목록 (다중 선택). 생략하면 미분류(빈 목록)로 생성됩니다. */
  categories?: KnownProjectCategory[];
  /** 종료 연도. `status`가 `ENDED`이면 필수이며 `startYear` 이상이어야 합니다. */
  endYear?: number | null;
  /** 최대 20개, 각 300자 이하. 생략하면 빈 목록 */
  repositories?: string[];
  /** 최대 20개, 각 50자 이하. 생략하면 빈 목록 */
  techStacks?: string[];
  /** 아이콘 업로드 후 발급받은 오브젝트 키 (최대 300자) */
  iconKey?: string | null;
  /** 배포 URL. `http://` 또는 `https://`로 시작해야 합니다 (최대 300자). */
  deploymentUrl?: string | null;
}

/**
 * 프로젝트 수정 요청 (PUT /v1/projects/{projectId})
 *
 * 전체 교체 방식입니다. 단, 아래에 "기존 값을 유지"로 표시된 필드는 생략하면 유지됩니다.
 * 수정 API는 `status`, `endYear`를 변경하지 않습니다.
 * 상태 변경은 `endProject`, `reactivateProject`를 사용하세요.
 */
export interface UpdateProjectRequest extends Omit<
  CreateProjectRequest,
  'status' | 'endYear' | 'categories' | 'repositories' | 'techStacks' | 'iconKey' | 'deploymentUrl'
> {
  /** 카테고리 목록. 생략하면 기존 값을 유지하고, 빈 배열이면 모두 해제합니다. */
  categories?: KnownProjectCategory[];
  /** 생략하면 빈 목록으로 교체됩니다. */
  repositories?: string[];
  /** 생략하면 빈 목록으로 교체됩니다. */
  techStacks?: string[];
  /** 아이콘 오브젝트 키. 생략하면 기존 값을 유지하고, 빈 문자열이면 삭제합니다. */
  iconKey?: string | null;
  /** 배포 URL. 생략하면 기존 값을 유지하고, 빈 문자열이면 삭제합니다. */
  deploymentUrl?: string | null;
}

/** 프로젝트 종료 요청 (POST /v1/projects/{projectId}/end) */
export interface EndProjectRequest {
  /** 종료 연도. `startYear` 이상이어야 합니다. */
  endYear: number;
}

export type ProjectResponse = ApiResponse<Project>;
