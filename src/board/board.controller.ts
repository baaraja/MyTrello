import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { BoardService } from './board.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateBoardDto } from 'src/dto/createBoardDto';
import { UpdateBoardDto } from 'src/dto/updateBoardDto';
import { AddUserDto } from 'src/dto/addUserDto';

@Controller('b')
export class BoardController {
    @UseGuards(AuthGuard('jwt'))
    @Get('boards')
    getBoards(@Req() request : Request) {
        const userId = request.user['userId'];
        return this.boardService.getBoards(userId);
    }
    constructor(private readonly boardService: BoardService) {}
    @UseGuards(AuthGuard('jwt'))
    @Post('create')
    create(@Body() createBoardDto: CreateBoardDto, @Req() request : Request) {
        const userId = request.user['userId'];
        return this.boardService.create(createBoardDto, userId);
    }
    @UseGuards(AuthGuard('jwt'))
    @Delete('delete/:id')
    delete(@Param('id', ParseIntPipe) boardId: number, @Req() request : Request) {
        const userId = request.user['userId'];
        return this.boardService.delete(boardId, userId);
    }
    @UseGuards(AuthGuard('jwt'))
    @Put('update/:id')
    update(@Param('id', ParseIntPipe) boardId: number, @Body() updateBoardDto : UpdateBoardDto, @Req() request : Request) {
        const userId = request.user['userId'];
        return this.boardService.update(boardId, userId, updateBoardDto);
    }
    @UseGuards(AuthGuard('jwt'))
    @Put('addUser/:id')
    add(@Param('id', ParseIntPipe) boardId: number, @Body() addUserDto: AddUserDto, @Req() request: Request) {
        const userId = request.user['userId'];
        return this.boardService.addUser(boardId, userId, addUserDto);
    }
    @UseGuards(AuthGuard('jwt'))
    @Put('removeUser/:id')
    remove(@Param('id', ParseIntPipe) boardId: number, @Body() addUserDto: AddUserDto, @Req() request: Request) {
        const userId = request.user['userId'];
        return this.boardService.removeUser(boardId, userId, addUserDto);
    }
    @UseGuards(AuthGuard('jwt'))
    @Get('members/:id')
    members(@Param('id', ParseIntPipe) boardId: number, @Req() request: Request) {
        const userId = request.user['userId'];
        return this.boardService.getMembers(boardId, userId);
    }
    @UseGuards(AuthGuard('jwt'))
    @Get('members/:id')
    getMembers(@Param('id', ParseIntPipe) boardId: number, @Req() request: Request) {
        const userId = request.user['userId'];
        return this.boardService.getMembers(boardId, userId);
    }
}
