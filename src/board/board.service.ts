import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBoardDto } from 'src/dto/createBoardDto';
import { UpdateBoardDto } from 'src/dto/updateBoardDto';
import { AddUserDto } from 'src/dto/addUserDto';

@Injectable()
export class BoardService {
    async getBoards(userId: number) {
        const boards = await this.prismaService.boardUsers.findMany({
            where: { userId },
            include: {
                board: {
                    select: {
                        boardId: true,
                        name: true,
                        description: true,
                    },
                },
            },
        });
        return boards.map(b => ({
            boardId: b.board.boardId,
            name: b.board.name,
            description: b.board.description,
        }));
    }
    constructor(private readonly prismaService: PrismaService) {}
    async create(createBoardDto: CreateBoardDto, userId: number) {
        const { name, description, workspaceId } = createBoardDto;
        const workspace = await this.prismaService.workspace.findUnique({
            where: { workspaceId },
        });
        if (!workspace) throw new NotFoundException('Workspace not found');
        const user = await this.prismaService.workspaceUsers.findFirst({
            where: {
                workspaceId,
                userId,
            },
        });
        if (!user) throw new ForbiddenException('Forbidden');
        const board = await this.prismaService.board.create({
            data: { name, description, workspaceId },
        });
        const workspaceUsers = await this.prismaService.workspaceUsers.findMany({
            where: { workspaceId },
        });
        const boardUsersData = workspaceUsers.map(workspaceUser => ({
            boardId: board.boardId,
            userId: workspaceUser.userId,
        }));
        await this.prismaService.boardUsers.createMany({
            data: boardUsersData,
        });
        return {
            data: {
                boardId: board.boardId,
                name: board.name,
                description: board.description,
                message: 'Board created successfully',
            },
        };
    }
    async update(boardId: number, userId: number, updateBoardDto: UpdateBoardDto) {
        const board = await this.prismaService.board.findUnique({
            where: { boardId },
        });
        if (!board) throw new NotFoundException('Board not found');
        const userBoard = await this.prismaService.boardUsers.findFirst({
            where: { boardId, userId },
        });
        if (!userBoard) throw new ForbiddenException('Forbidden');
        await this.prismaService.board.update({
            where: { boardId },
            data: updateBoardDto,
        });
        return {
            data: {
                boardId: board.boardId,
                name: board.name,
                description: board.description,
                message: 'Board updated successfully',
            },
        };
    }
    async delete(boardId: number, userId: number) {
        const board = await this.prismaService.board.findUnique({
            where: { boardId },
        });
        if (!board) throw new NotFoundException('Board not found');
        const userBoard = await this.prismaService.boardUsers.findFirst({
            where: { boardId, userId },
        });
        if (!userBoard) throw new ForbiddenException('Forbidden');
        await this.prismaService.board.delete({
            where: { boardId },
        });
        return {
            data: {
                boardId: board.boardId,
                name: board.name,
                description: board.description,
                message: 'Board deleted successfully',
            },
        };
    }
    // Add a user to a single board (called from BoardController)
    async addUser(boardId: number, userId: number, addUserDto: AddUserDto) {
        const board = await this.prismaService.board.findUnique({ where: { boardId } });
        if (!board) throw new NotFoundException('Board not found');
        // requester must be a member of the board
        const requester = await this.prismaService.boardUsers.findFirst({ where: { boardId, userId } });
        if (!requester) throw new ForbiddenException('Forbidden');
        const target = await this.prismaService.user.findUnique({ where: { id: addUserDto.userId } });
        if (!target) throw new NotFoundException('User not found');
        const existing = await this.prismaService.boardUsers.findFirst({ where: { boardId, userId: addUserDto.userId } });
        if (existing) throw new ForbiddenException('User already a member of the board');
        await this.prismaService.boardUsers.create({ data: { boardId, userId: addUserDto.userId } });
        return { data: 'User added to board' };
    }

    async removeUser(boardId: number, userId: number, addUserDto: AddUserDto) {
        const board = await this.prismaService.board.findUnique({ where: { boardId } });
        if (!board) throw new NotFoundException('Board not found');
        const requester = await this.prismaService.boardUsers.findFirst({ where: { boardId, userId } });
        if (!requester) throw new ForbiddenException('Forbidden');
        const target = await this.prismaService.user.findUnique({ where: { id: addUserDto.userId } });
        if (!target) throw new NotFoundException('User not found');
        const targetRelation = await this.prismaService.boardUsers.findFirst({ where: { boardId, userId: addUserDto.userId } });
        if (!targetRelation) throw new NotFoundException('User not a member of the board');
        await this.prismaService.boardUsers.deleteMany({ where: { boardId, userId: addUserDto.userId } });
        return { data: 'User removed from board' };
    }

    async getMembers(boardId: number, userId: number) {
        const board = await this.prismaService.board.findUnique({ where: { boardId } });
        if (!board) throw new NotFoundException('Board not found');
        const userBoard = await this.prismaService.boardUsers.findFirst({ where: { boardId, userId } });
        if (!userBoard) throw new ForbiddenException('Forbidden');
        const members = await this.prismaService.boardUsers.findMany({
            where: { boardId },
            include: { user: { select: { id: true, username: true, email: true } } },
        });
        return members.map(m => ({ id: m.user.id, username: m.user.username, email: m.user.email }));
    }
}
