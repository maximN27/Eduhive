import { voteService } from '../services/voteService';

export const castVoteApi = async (targetType, targetId, voteType) => voteService.castVote(targetType, targetId, voteType);
