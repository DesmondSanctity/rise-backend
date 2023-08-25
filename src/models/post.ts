import { User } from './user';

export interface Post {
  id: number;
  userId: number;
  user: User;
  title: string;
  content: string;
}