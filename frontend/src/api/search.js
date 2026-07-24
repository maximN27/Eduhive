import { searchService } from '../services/searchService';

export const searchApi = async (q, type = '') => searchService.search(q, type);
