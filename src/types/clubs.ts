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
