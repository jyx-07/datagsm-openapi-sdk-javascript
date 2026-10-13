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

export interface PageInfo {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface PageRequest {
  page?: number;
  size?: number;
}

export interface PagedResponse<T> {
  content: T[];
  pageInfo: PageInfo;
}
