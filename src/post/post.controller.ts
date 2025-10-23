import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDto } from 'src/dto/createPostDto';
import { UpdatePostDto } from 'src/dto/updatePostDto';

@Controller('posts')
export class PostController {
    @Get()
    getAll() {
        return this.postService.getAll();
    }
    constructor(private readonly postService: PostService) {}
    @UseGuards(AuthGuard('jwt'))
    @Post('create')
    create(@Body() createPostDto: CreatePostDto, @Req() request : Request) {
        const userId = request.user['userId'];
        return this.postService.create(createPostDto, userId);
    }
    @UseGuards(AuthGuard('jwt'))
    @Delete('delete/:id')
    delete(@Param('id', ParseIntPipe) postId: number, createPostDto: CreatePostDto, @Req() request : Request) {
        const userId = request.user['userId'];
        return this.postService.delete(postId, userId);
    }
    @UseGuards(AuthGuard('jwt'))
    @Put('update/:id')
    update(@Param('id', ParseIntPipe) postId: number, @Body() updatePostDto : UpdatePostDto, @Req() request : Request) {
        const userId = request.user['userId'];
        return this.postService.update(postId, userId, updatePostDto);
    }
}
