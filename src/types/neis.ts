import type { ApiResponse } from './index';

/**
 * 날짜는 `YYYY-MM-DD` 형식 문자열입니다.
 * 단일 날짜(`date`) 또는 기간(`fromDate`/`toDate`) 중 한 가지만 사용하는 날짜 조건입니다.
 * 서버는 `date`와 `fromDate`/`toDate`를 함께 보내면 400을 반환합니다.
 * 기간 조회는 최대 365일이며 `fromDate`는 `toDate`보다 이전이거나 같아야 합니다.
 * 날짜 조건을 모두 생략하면 캐시된 전체 데이터를 조회합니다.
 */
export type NeisDateFilter =
  | { date?: string; fromDate?: never; toDate?: never }
  | { date?: never; fromDate?: string; toDate?: string };

/**
 * 날짜 조건이 반드시 하나 이상 필요한 경우의 날짜 조건입니다.
 * `date`, 또는 `fromDate`/`toDate` 중 최소 하나를 지정해야 합니다.
 * 한쪽만 지정하면 그 날짜 이후(`fromDate`) 또는 이전(`toDate`) 전체를 조회합니다.
 */
export type RequiredNeisDateFilter =
  | { date: string; fromDate?: never; toDate?: never }
  | { date?: never; fromDate: string; toDate?: string }
  | { date?: never; fromDate?: string; toDate: string };

export interface Timetable {
  timetableId: string;
  schoolCode: string;
  schoolName: string;
  officeCode: string;
  officeName: string;
  timetableDate: string;
  academicYear: string;
  semester: string | null;
  grade: number;
  classNum: number;
  period: number;
  subject: string | null;
}

export type GetTimetablesRequest = {
  /** 학년 (1~3) */
  grade: number;
  /** 반 (1~4) */
  classNum: number;
} & RequiredNeisDateFilter;

export type GetTimetablesResponse = ApiResponse<{
  timetables: Timetable[];
}>;

export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER';

export interface Meal {
  mealId: string;
  schoolCode: string;
  schoolName: string;
  officeCode: string;
  officeName: string;
  mealDate: string;
  mealType: MealType;
  mealMenu: string[];
  mealAllergyInfo: string[] | null;
  mealCalories: string | null;
  originInfo: string | null;
  nutritionInfo: string | null;
  mealServeCount: number | null;
}

export type GetMealsRequest = NeisDateFilter;

export type GetMealsResponse = ApiResponse<{
  meals: Meal[];
}>;

export interface Schedule {
  scheduleId: string;
  schoolCode: string;
  schoolName: string;
  officeCode: string;
  officeName: string;
  scheduleDate: string;
  academicYear: string;
  eventName: string;
  eventContent: string | null;
  dayCategory: string | null;
  schoolCourseType: string | null;
  dayNightType: string | null;
  targetGrades: number[];
}

export type GetSchedulesRequest = NeisDateFilter;

export type GetSchedulesResponse = ApiResponse<{
  schedules: Schedule[];
}>;
