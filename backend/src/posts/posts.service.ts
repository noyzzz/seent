import { ImagesService } from "src/images/images.service";
import { PrismaService } from "../prisma.service";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Prisma, Post } from "@prisma/client";
import { PostFindManyParams } from "./posts.types";
import { createPaginator } from "prisma-pagination";

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => ImagesService))
    private imagesService: ImagesService
  ) {}

  async findOne(postWhereUniqueInput: Prisma.PostWhereUniqueInput) {
    const post = await this.prisma.post.findUnique({
      where: postWhereUniqueInput,
      include: {
        author: {
          select: {
            name: true,
          },
        },
        parentPost: {
          select: {
            author: {
              select: {
                name: true,
              },
            },
            postId: true,
          },
        },
        childPosts: {
          select: {
            body: true,
            createdAt: true,
            postId: true,
            author: {
              select: {
                name: true,
              },
            },
            authorId: true,
          },
        },
      },
    });
    const images = await this.imagesService.findMany({});
    const image = images.find((i) => i.entityId === post.postId) ?? null;
    const postWithImages = { ...post, image: image };

    return postWithImages;
  }

  async findMany(params: PostFindManyParams) {
    const { where, orderBy, page, perPage } = params;
    const paginate = createPaginator({ perPage: perPage });
    const result = await paginate<Post, Prisma.PostFindManyArgs>(
      this.prisma.post,
      {
        where,
        orderBy,
        include: {
          author: {
            select: {
              name: true,
            },
          },
          childPosts: {
            select: {
              body: true,
              createdAt: true,
              postId: true,
              author: {
                select: {
                  name: true,
                },
              },
              authorId: true,
            },
          },
          parentPost: {
            select: {
              author: {
                select: {
                  name: true,
                },
              },
              postId: true,
            },
          },
          reactions: {
            select: {
              type: true,
              userId: true,
              postId: true,
              reactionId: true,
            },
          },
        },
      },
      { page: page }
    );

    const images = await this.imagesService.findMany({});
    const postsWithImages = result.data.map((p) => {
      const image = images.find((i) => i.entityId === p.postId) ?? null;
      return { ...p, image: image };
    });

    return { ...result, data: postsWithImages };
  }

  async create(data: Prisma.PostCreateInput): Promise<Post> {
    return this.prisma.post.create({
      data,
    });
  }

  async update(params: {
    where: Prisma.PostWhereUniqueInput;
    data: Prisma.PostUpdateInput;
  }): Promise<Post> {
    const { where, data } = params;
    return this.prisma.post.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.PostWhereUniqueInput): Promise<Post> {
    return this.prisma.post.delete({
      where,
    });
  }

  async getDepth(postId: string) {
    let depth = 0;
    const post = await this.findOne({ postId });
    let curParentPost = post.parentPost;
    while (curParentPost) {
      const post = await this.findOne({ postId: curParentPost.postId });
      depth++;
      curParentPost = post.parentPost;
    }
    return depth;
  }
}
