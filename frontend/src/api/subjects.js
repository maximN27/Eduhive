import { subjectService } from '../services/subjectService';

export const getSubjectsApi = async (params = {}) => subjectService.getSubjects(params);
export const getSubjectByIdApi = async (id) => subjectService.getSubjectById(id);
export const createSubjectApi = async (subjectData) => subjectService.createSubject(subjectData);
export const getSubjectPostsApi = async (id) => subjectService.getSubjectPosts(id);
