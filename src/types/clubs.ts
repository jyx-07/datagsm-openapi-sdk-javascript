import type { ApiResponse, ClubType, ParticipantInfo, SortDirection } from './index';

export type ClubStatus = 'ACTIVE' | 'ABOLISHED';
export type ClubSortBy = 'ID' | 'NAME' | 'TYPE' | 'FOUNDED_YEAR' | 'STATUS';

export interface Club {
  id: number;
  name: string;
  type: ClubType;
  leader: ParticipantInfo | null;
  participants: ParticipantInfo[];
  foundedYear: number;
  status: ClubStatus;
  abolishedYear: number | null;
}

export interface GetClubsRequest {
  clubId?: number;
  clubName?: string;
  clubType?: ClubType;
  clubStatus?: ClubStatus;
  foundedYear?: number;
  page?: number;
  size?: number;
  includeLeaderInParticipants?: boolean;
  sortBy?: ClubSortBy;
  sortDirection?: SortDirection;
}

export type GetClubsResponse = ApiResponse<{
  totalPages: number;
  totalElements: number;
  clubs: Club[];
}>;

/**
 * 동아리 생성/수정 요청 (POST /v1/clubs, PUT /v1/clubs/{clubId})
 *
 * 수정은 전체 교체 방식입니다.
 */
export interface ClubRequest {
  /** 최대 30자 */
  name: string;
  type: ClubType;
  /** 부장 학생 ID. `ABOLISHED`이면 null */
  leaderId?: number | null;
  /** 부원 학생 ID 목록 (최대 100명). `ABOLISHED`이면 빈 배열 */
  participantIds: number[];
  foundedYear: number;
  status: ClubStatus;
  /** 폐지 학년도. `ABOLISHED`일 때 설정 */
  abolishedYear?: number | null;
}

export type ClubResponse = ApiResponse<Club>;
