export { DataGsmClient } from './client';

export {
  DataGsmError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  ServerError,
  NetworkError,
} from './errors';

export type {
  PageRequest,
  SortDirection,
  Sex,
  Major,
  ClubType,
  ClubSummary,
  ParticipantInfo,
  ApiResponse,
} from './types';

export type {
  Student,
  Role,
  EnrolledRole,
  SortBy as StudentSortBy,
  GetStudentsRequest,
  GetStudentsResponse,
  CreateStudentRequest,
  UpdateStudentRequest,
  StudentResponse,
} from './types/students';

export type {
  Club,
  ClubSortBy,
  ClubStatus,
  GetClubsRequest,
  GetClubsResponse,
  ClubRequest,
  ClubResponse,
} from './types/clubs';

export type {
  Project,
  ProjectCategory,
  KnownProjectCategory,
  ProjectSortBy,
  ProjectStatus,
  GetProjectsRequest,
  GetProjectsResponse,
  CreateProjectRequest,
  UpdateProjectRequest,
  EndProjectRequest,
  ProjectResponse,
} from './types/projects';

export type {
  NeisDateFilter,
  RequiredNeisDateFilter,
  Timetable,
  GetTimetablesRequest,
  GetTimetablesResponse,
  Meal,
  MealType,
  GetMealsRequest,
  GetMealsResponse,
  Schedule,
  GetSchedulesRequest,
  GetSchedulesResponse,
} from './types/neis';

export type { HealthCheckResponse } from './types/health';
