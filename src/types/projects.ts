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
