export interface Comment {
  id: string;
  senderName: string;
  content: string;
  createdAt: string;
}

export interface BlogDetail {
  id: string;
  title: string;
  coverImage: string;
  content: string;
  createdAt: string;
  viewCount: number;
  images: BlogImage[];
  comments: Comment[];
}

export interface BlogImage {
  id: string;
  url: string;
  blogId: string;
}

export interface BlogCardProps {
  id: string;
  title: string;
  slug: string;
  summary: string;
  coverImage: string;
  createdAt: Date;
  viewCount: number;
}

export interface BlogWithImages extends BlogCardProps {
  content: string;
  published: boolean;
  updatedAt: Date;
  images: BlogImage[];
}
