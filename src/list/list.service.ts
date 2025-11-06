import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateListDto } from 'src/dto/createListDto';
import { UpdateListDto } from 'src/dto/updateListDto';

@Injectable()
export class ListService {
    constructor(private readonly prismaService: PrismaService) {}
    async create(createListDto: CreateListDto, userId: number) {
        const { name, boardId } = createListDto;
        const board = await this.prismaService.board.findUnique({
            where: { boardId },
        });
        if (!board) throw new NotFoundException('Board not found');
        const userBoard = await this.prismaService.boardUsers.findFirst({
            where: { boardId, userId },
        });
        if (!userBoard) throw new ForbiddenException('Forbidden');
        const list = await this.prismaService.list.create({
            data: {
                name,
                board: { connect: { boardId } },
                user: { connect: { id: userId } },
            },
        });
        return {
            data: {
                listId: list.listId,
                name: list.name,
                message: 'List created successfully',
            },
        };
    }
    async delete(listId: number, userId: number) {
        const list = await this.prismaService.list.findUnique({
            where: { listId },
        });
        if (!list) throw new NotFoundException('List not found');
        const userBoard = await this.prismaService.boardUsers.findFirst({
            where: { boardId: list.boardId, userId },
        });
        if (!userBoard) throw new ForbiddenException('Forbidden');
        await this.prismaService.list.delete({
            where: { listId },
        });
        return {
            data: {
                listId: list.listId,
                name: list.name,
                message: 'List deleted successfully',
            },
        };
    }
    async update(listId: number, userId: number, updateListDto: UpdateListDto) {
        const list = await this.prismaService.list.findUnique({
            where: { listId },
        });
        if (!list) throw new NotFoundException('List not found');
        const userBoard = await this.prismaService.boardUsers.findFirst({
            where: { boardId: list.boardId, userId },
        });
        if (!userBoard) throw new ForbiddenException('Forbidden');
        await this.prismaService.list.update({
            where: { listId },
            data: updateListDto,
        });
        return {
            data: {
                listId: list.listId,
                name: list.name,
                message: 'List updated successfully',
            },
        };
    }

    async getLists(boardId: number, userId: number) {
        const board = await this.prismaService.board.findUnique({ where: { boardId } });
        if (!board) throw new NotFoundException('Board not found');
        const userBoard = await this.prismaService.boardUsers.findFirst({ where: { boardId, userId } });
        if (!userBoard) throw new ForbiddenException('Forbidden');
        const lists = await this.prismaService.list.findMany({
            where: { boardId },
            include: { cards: { select: { cardId: true, title: true, description: true, userId: true } } },
        });
        return lists.map(l => ({ listId: l.listId, name: l.name, cards: l.cards }));
    }
}
