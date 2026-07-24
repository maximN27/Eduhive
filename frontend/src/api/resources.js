import { subjectService } from '../services/subjectService';

export const getSubjectResourcesApi = async (subjectId, tag = '', q = '', page = 1, limit = 20) => {
  return subjectService.getSubjectResources(subjectId, { tag, q, page, limit });
};
