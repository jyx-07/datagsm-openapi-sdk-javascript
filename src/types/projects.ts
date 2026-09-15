import type { ApiResponse, ClubSummary, ParticipantInfo, SortDirection } from './index';

export type ProjectSortBy = 'ID' | 'NAME';
export type ProjectStatus = 'ACTIVE' | 'ENDED';

export interface Project {
  id: number;
  name: string;
  description: string;
  club?: ClubSummary;
  participants: ParticipantInfo[];
  startYear: number;
  endYear?: number;
  status: ProjectStatus;
  /** Max 20 items, each up to 300 characters. */
  repositories: string[];
  /** Max 20 items, each up to 50 characters. */
  techStacks: string[];
}

export interface GetProjectsRequest {
  projectId?: number;
  projectName?: string;
  clubId?: number;
  status?: ProjectStatus;
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
