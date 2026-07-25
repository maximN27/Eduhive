import { postService } from '../services/postService';

export const getPostsApi = async (params = {}) => postService.getPosts(params);
export const getPostByIdApi = async (id) => postService.getPostById(id);
export const createPostApi = async (postData) => postService.createPost(postData);
export const updatePostApi = async (id, postData) => postService.updatePost(id, postData);
export const deletePostApi = async (id) => postService.deletePost(id);
export const summarizePostApi = async (id) => postService.summarizePost(id);
