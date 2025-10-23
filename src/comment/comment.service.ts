import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from 'src/dto/createCommentDto';
import { UpdateCommentDto } from 'src/dto/updateCommentDto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
    constructor( private readonly prismaService: PrismaService ) {}
    async create(createCommentDto: CreateCommentDto, userId: number) {
        const { postId, content } = createCommentDto;
        const post = await this.prismaService.post.findUnique({ where: { postId } });
        if (!post) throw new NotFoundException('Post not found');
        await this.prismaService.comment.create({
            data: { 
                content,
                userId,
                postId
            }
        });
        return { data: 'Comment created' };
    }
    async delete(commentId: number, userId: number, postId: number) {
        const comment = await this.prismaService.comment.findUnique({ where: { id : commentId } });
        if (!comment) throw new NotFoundException('Comment not found');
        if (comment.postId !== postId) throw new NotFoundException('Post id does not match');
        if (comment.userId !== userId) throw new ForbiddenException('Forbidden action');
        await this.prismaService.comment.delete({ where: { id: commentId } });
        return { data: 'Comment deleted' };
    }
    async update(commentId: number, userId: number, updateCommentDto: UpdateCommentDto) {
        const { content, postId } = updateCommentDto;
        const comment = await this.prismaService.comment.findUnique({ where: { id : commentId } });
        if (!comment) throw new NotFoundException('Comment not found');
        if (comment.userId !== userId) throw new ForbiddenException('Forbidden action');
        await this.prismaService.comment.update({ where: { id: commentId }, data: { content, postId } });
        return { data: 'Comment updated' };
        
    }
}
