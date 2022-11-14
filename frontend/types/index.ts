import { ReactElement } from "react";
import { ReactNode } from "react";
import { NextPage } from "next";
import { SxProps } from "@mui/material";

export interface Styles {
  [key: string]: SxProps;
}

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

export type JwtPayload = {
  email: string;
  userId: string;
  name: string;
  username: string;
};

export const Role = {
  USER: "USER",
  ADMIN: "ADMIN",
};

export const ReactionType = {
  LIKE: "LIKE",
  DISLIKE: "DISLIKE",
};

export const ImageType = {
  USER_AVATAR: "USER_AVATAR",
  USER_BANNER: "USER_BANNER",
  POST: "POST",
};
type ImageTypeKeys = keyof typeof ImageType;
type ImageTypeValues = typeof ImageType[ImageTypeKeys];

type PostCounts = {
  childPosts: number;
};

export type UserEntity = {
  userId: string;
  email: string;
  name: string;
  username: string;
  birthday: Date;
  location: string;
  bio: string;
  gender: string;
  locked: boolean;
  role: typeof Role;
  createdAt: Date;
  updatedAt: Date;

  images: Partial<ImageEntity>[];
};

export type ReactionEntity = {
  reactionId: string;
  postId: string;
  userId: string;
  type: typeof ReactionType;
  createdAt: Date;
  updatedAt: Date;
};

export type PostEntity = {
  postId: string;
  authorId: string;
  body: string;
  isPublic: boolean;
  parentPostId: string;
  createdAt: Date;
  updatedAt: Date;

  reactions: ReactionEntity[];
  author: UserEntity;
  images: ImageEntity[];
  parentPost: PostEntity;
  _count: PostCounts;
};

export type ImageEntity = {
  imageId: string;
  url: string;
  type: ImageTypeValues;
  userId: string;
  postId: string;
  createdAt: Date;
  updatedAt: Date;
};

export const POSTS_SORT_MODES = {
  TOP_DAY: "top-day",
  TOP_WEEK: "top-week",
  TOP_MONTH: "top-month",
  TOP_YEAR: "top-year",
  TOP_ALL: "top-all",
  NEW: "new",
  OLD: "old",
};