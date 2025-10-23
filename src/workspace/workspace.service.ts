import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWorkspaceDto } from 'src/dto/createWorkspaceDto';
import { UpdateWorkspaceDto } from 'src/dto/updateWorkspaceDto';
import { AddUserDto } from 'src/dto/addUserDto';

@Injectable()
export class WorkspaceService {
    async getWorkspaces(userId: number) {
        const workspaces = await this.prismaService.workspaceUsers.findMany({
            where: { userId },
            include: {
                workspace: {
                    select: {
                        workspaceId: true,
                        name: true,
                        description: true,
                    },
                },
            },
        });
       return workspaces.map(ws => ({
            workspaceId: ws.workspace.workspaceId,
            name: ws.workspace.name,
            description: ws.workspace.description,
        }));
    }
    constructor(private readonly prismaService: PrismaService) {}
    async create(createWorkspaceDto: CreateWorkspaceDto, userId: number) {
        const { name, description } = createWorkspaceDto;
        const workspace = await this.prismaService.workspace.create({
            data: { name, description },
        });
        await this.prismaService.workspaceUsers.create({
            data: {
                workspaceId: workspace.workspaceId,
                userId: userId,
            },
        });
        return {
            data: {
                workspaceId: workspace.workspaceId,
                name: workspace.name,
                description: workspace.description,
                message: 'Workspace created',
            },
        };
    }
    async delete(workspaceId: number, userId: number) {
        const workspace = await this.prismaService.workspace.findUnique({
            where: { workspaceId },
        });
        if (!workspace) throw new NotFoundException('Workspace not found');
        const userWorkspace = await this.prismaService.workspaceUsers.findFirst({
            where: { workspaceId, userId },
        });
        if (!userWorkspace) throw new ForbiddenException('Forbidden action');
    
        await this.prismaService.workspace.delete({
            where: { workspaceId },
        });
        return {
            data: {
                workspaceId: workspace.workspaceId,
                name: workspace.name,
                description: workspace.description,
                message: 'Workspace deleted',
            },
        };
    }
    async update(workspaceId: number, userId: number, updateWorkspaceDto: UpdateWorkspaceDto) {
        const workspace = await this.prismaService.workspace.findUnique({
            where: { workspaceId },
        });
        if (!workspace) throw new NotFoundException('Workspace not found');
        const userWorkspace = await this.prismaService.workspaceUsers.findFirst({
            where: { workspaceId, userId },
        });
        if (!userWorkspace) throw new ForbiddenException('Forbidden action');
        const updatedWorkspace = await this.prismaService.workspace.update({
            where: { workspaceId },
            data: updateWorkspaceDto,
        });
        return {
            data: {
                workspaceId: updatedWorkspace.workspaceId,
                name: updatedWorkspace.name,
                description: updatedWorkspace.description,
                message: 'Workspace updated',
            },
        };
    }
    async addUser(workspaceId: number, userId: number, addUserDto: AddUserDto) {
        const workspace = await this.prismaService.workspace.findUnique({ where: { workspaceId } });
        if (!workspace) throw new NotFoundException('Workspace not found');
        const userWorkspace = await this.prismaService.workspaceUsers.findFirst({
            where: { workspaceId, userId },
        });
        if (!userWorkspace) throw new ForbiddenException('Forbidden action');
        await this.prismaService.workspaceUsers.create({
            data: {
                workspaceId,
                userId: addUserDto.userId,
            },
        });
        const board = await this.prismaService.board.findMany({
            where: { workspaceId },
        });
        const boardUsersData = board.map((board) => {
            return {
                boardId: board.boardId,
                userId: addUserDto.userId,
            };
        });
        await this.prismaService.boardUsers.createMany({
            data: boardUsersData,
        });    
        return { data: 'User added to workspace' };
    }
}
