import { User } from './user.js';

export interface Post {
  id: number;
  userId: number;
  user: User;
  title: string;
  content: string;
}