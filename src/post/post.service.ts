import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from 'src/dto/createPostDto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
    constructor(private readonly prismaService: PrismaService) {}
    async getAll() {
        return await this.prismaService.post.findMany( {
            include: {
                user: {
                    select: {
                        username: true,
                        email: true,
                        password : false
                    }
                },
                comments: {
                    include: {
                        user: {
                            select: {
                                username: true,
                                email: true,
                                password : false
                            }
                        }
                    }
                }
            }
        });
    }
    async create(createPostDto: CreatePostDto, userId: number) {
        const { title, body } = createPostDto;
        await this.prismaService.post.create({ data: { title, body, userId } });
        return { data: 'Post created' };
    }
    async delete(postId: number, userId: number) {
        const post = await this.prismaService.post.findUnique({ where: { postId } });
        if (!post) throw new NotFoundException('Post not found');
        if (post.userId !== userId) throw new ForbiddenException('Forbidden action');
        await this.prismaService.post.delete({ where: { postId } });
        return { data: 'Post deleted' };
    }
    async update(postId: number, userId: number, updatePostDto: any) {
        const post = await this.prismaService.post.findUnique({ where: { postId } });
        if (!post) throw new NotFoundException('Post not found');
        if (post.userId !== userId) throw new ForbiddenException('Forbidden action');
        await this.prismaService.post.update({ where: { postId }, data: { ...updatePostDto } });
        return { data: 'Post updated' };
    }
}
