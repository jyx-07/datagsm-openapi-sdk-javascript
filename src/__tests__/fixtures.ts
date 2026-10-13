import type { Club } from '../types/clubs';
import type { Project } from '../types/projects';
import type { Student } from '../types/students';

/** 서버는 null 필드를 키 생략이 아니라 null 값으로 직렬화한다. */
export const graduateStudent: Student = {
  id: 1,
  name: '홍길동',
  sex: 'MAN',
  email: 's20001@gsm.hs.kr',
  grade: null,
  classNum: null,
  number: null,
  studentNumber: null,
  major: null,
  specialty: null,
  role: 'GRADUATE',
  dormitoryFloor: null,
  dormitoryRoom: null,
  majorClub: null,
  autonomousClub: null,
  githubId: null,
  githubUrl: null,
};

export const abolishedClub: Club = {
  id: 1,
  name: 'SW개발동아리',
  type: 'MAJOR_CLUB',
  leader: null,
  participants: [
    {
      id: 1,
      name: '홍길동',
      email: 's20001@gsm.hs.kr',
      studentNumber: null,
      major: null,
      sex: 'MAN',
    },
  ],
  foundedYear: 2022,
  status: 'ABOLISHED',
  abolishedYear: 2024,
};

export const activeProject: Project = {
  id: 1,
  name: 'DataGSM 프로젝트',
  description: '학교 데이터를 제공하는 API 서비스',
  startYear: 2024,
  endYear: null,
  status: 'ACTIVE',
  categories: [],
  iconUrl: null,
  iconKey: null,
  deploymentUrl: null,
  club: null,
  participants: [],
  repositories: [],
  techStacks: [],
};
