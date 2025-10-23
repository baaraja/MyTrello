import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { WorkspaceService } from './workspace.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateWorkspaceDto } from 'src/dto/createWorkspaceDto';
import { UpdateWorkspaceDto } from 'src/dto/updateWorkspaceDto';
import { AddUserDto } from 'src/dto/addUserDto';

@Controller('w')
export class WorkspaceController {
    @UseGuards(AuthGuard('jwt'))
    @Get('workspaces')
    getWorkspaces(@Req() request : Request) {
        const userId = request.user['userId'];
        return this.workspaceService.getWorkspaces(userId);
    }
    constructor(private readonly workspaceService: WorkspaceService) {}
    @UseGuards(AuthGuard('jwt'))
    @Post('create')
    create(@Body() createWorkspaceDto: CreateWorkspaceDto, @Req() request : Request) {
        const userId = request.user['userId'];
        return this.workspaceService.create(createWorkspaceDto, userId);
    }
    @UseGuards(AuthGuard('jwt'))
    @Delete('delete/:id')
    delete(@Param('id', ParseIntPipe) workspaceId: number, createWorkspaceDto: CreateWorkspaceDto, @Req() request : Request) {
        const userId = request.user['userId'];
        return this.workspaceService.delete(workspaceId, userId);
    }
    @UseGuards(AuthGuard('jwt'))
    @Put('update/:id')
    update(@Param('id', ParseIntPipe) workspaceId: number, @Body() updateWorkspaceDto : UpdateWorkspaceDto, @Req() request : Request) {
        const userId = request.user['userId'];
        return this.workspaceService.update(workspaceId, userId, updateWorkspaceDto);
    }
    @UseGuards(AuthGuard('jwt'))
    @Put('addUser/:id')
    add(@Param('id', ParseIntPipe) workspaceId: number, @Body() addUserDto: AddUserDto, @Req() request: Request) {
        const userId = request.user['userId'];
        return this.workspaceService.addUser(workspaceId, userId, addUserDto);
    }
}
