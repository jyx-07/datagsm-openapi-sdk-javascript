export type SortDirection = 'ASC' | 'DESC';
export type Sex = 'MAN' | 'WOMAN';
export type Major = 'SW_DEVELOPMENT' | 'SMART_IOT' | 'AI';
export type ClubType = 'MAJOR_CLUB' | 'AUTONOMOUS_CLUB';

export interface ClubSummary {
  id: number;
  name: string;
  type: ClubType;
}

export interface ParticipantInfo {
  id: number;
  name: string;
  email: string;
  studentNumber: number | null;
  major: Major | null;
  sex: Sex;
}

export interface ApiResponse<T> {
  status: string;
  code: number;
  message: string;
  data: T;
}

/** 목록 조회 API 공통 페이지 파라미터 (page는 0부터 시작) */
export interface PageRequest {
  page?: number;
  size?: number;
}
