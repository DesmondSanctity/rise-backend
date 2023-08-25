import { Post } from './post.js';

export interface Comment {
  id: number;
  postId: number; 
  post: Post;
  content: string; 
}