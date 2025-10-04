// src/types/index.ts

export type PostStatus = 'draft' | 'published';

export interface Post {
  [x: string]: any;
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  featuredImage?: string;
  status: "draft" | "published";
  tags: string[];
  categoryId?: string;
  author: {
    id: string;
    name: string;
    image?: string;
  };
  category?: {
    id: string;
    name: string;
    color?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  viewCount?: number;
  commentCount?: number;
}

export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
  youtube?: string;
  website?: string;
  [key: string]: string | undefined;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export interface Stats {
  posts: number;
  categories: number;
  comments: number;
  users: number;
}

export interface Comment {
  id: string;
  content: string;
  postId: string;
  userId: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    posts: number;
  };
}

export interface CategoryWithStats extends Category {
  _count: {
    posts: number;
  };
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description?: string;
}

export interface PostFormData {
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  featuredImage?: string;
  status: PostStatus;
  tags: string[];
  categoryId?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CloudinaryResponse {
  public_id: string;
  version: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  type: string;
  url: string;
  secure_url: string;
}

export interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PostFormData) => Promise<void>;
  post?: Post;
  categories: Category[];
}
