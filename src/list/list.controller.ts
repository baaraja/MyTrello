import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ListService } from 'src/list/list.service';
import { CreateListDto } from 'src/dto/createListDto';
import { UpdateListDto } from 'src/dto/updateListDto';
import { Request } from 'express';

@Controller('l')
export class ListController {
    constructor(private readonly listService: ListService) {}
    @UseGuards(AuthGuard('jwt'))
    @Post('create')
    create(@Body()createListDto : CreateListDto , @Req() request : Request) {
        const userId = request.user['userId'];
        return this.listService.create(createListDto , userId);
    }
    @UseGuards(AuthGuard('jwt'))
    @Get('board/:id')
    getByBoard(@Param('id', ParseIntPipe) boardId: number, @Req() request: Request) {
        const userId = request.user['userId'];
        return this.listService.getLists(boardId, userId);
    }
    @UseGuards(AuthGuard('jwt'))
    @Delete('delete/:id')
    delete(@Param('id', ParseIntPipe) listId: number, @Req() request : Request) {
        const userId = request.user['userId'];
        return this.listService.delete(listId, userId);
    }
    @UseGuards(AuthGuard('jwt'))
    @Put('update/:id')
    update(@Param('id', ParseIntPipe) listId: number, @Body() updateListDto : UpdateListDto, @Req() request : Request) {
        const userId = request.user['userId'];
        return this.listService.update(listId, userId, updateListDto);
    }
}
