import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Request } from 'express';
import { CreateCommentDto } from 'src/dto/createCommentDto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateCommentDto } from 'src/dto/updateCommentDto';

@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}
    @UseGuards(AuthGuard('jwt'))
    @Post('create')
    create(@Body() createCommentDto: CreateCommentDto, @Req() request : Request) {
        const userId = request.user['userId'];
        return this.commentService.create(createCommentDto, userId);
    }
    @UseGuards(AuthGuard('jwt'))
    @Delete('delete/:id')
    delete(@Req() request : Request, @Param('id', ParseIntPipe) commentId: number, @Body('postId') postId: number) {
        const userId = request.user['userId'];
        return this.commentService.delete(commentId, userId, postId);
    }
    @UseGuards(AuthGuard('jwt'))
    @Put('update/:id')
    update(@Req() request : Request, @Param('id', ParseIntPipe) commentId: number, @Body() updateCommentDto: UpdateCommentDto) {
        const userId = request.user['userId'];
        return this.commentService.update(commentId, userId, updateCommentDto);
    }   
}
