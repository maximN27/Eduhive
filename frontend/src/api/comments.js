import { postService } from '../services/postService';

export const getPostCommentsApi = async (postId) => postService.getPostComments(postId);
export const createCommentApi = async (postId, commentData) => postService.addPostComment(postId, commentData);
