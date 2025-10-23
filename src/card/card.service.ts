import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCardDto } from 'src/dto/createCardDto';
import { UpdateCardDto } from 'src/dto/updateCardDto';

@Injectable()
export class CardService {
    constructor(private readonly prismaService: PrismaService) {}
    async create(createCardDto: CreateCardDto, userId: number) {
        const { title, description, listId } = createCardDto;
        const list = await this.prismaService.list.findUnique({
            where: { listId },
        });
        if (!list) throw new NotFoundException('List not found');
        const userBoard = await this.prismaService.boardUsers.findFirst({
            where: { boardId: list.boardId, userId },
        });
        if (!userBoard) throw new ForbiddenException('Forbidden');
        const card = await this.prismaService.card.create({
            data: {
                title,
                description,
                list: { connect: { listId } },
                user: { connect: { id: userId } },
            },
        });
        return {
            data: {
                cardId: card.cardId,
                title: card.title,
                description: card.description,
                message: 'Card created successfully',
            },
        };
    }
    async delete(cardId: number, userId: number) {
        const card = await this.prismaService.card.findUnique({
            where: { cardId },
            include: { list: true },
        });
        if (!card) throw new NotFoundException('Card not found');
        const userBoard = await this.prismaService.boardUsers.findFirst({
            where: { boardId: card.list.boardId, userId },
        });
        if (!userBoard) throw new ForbiddenException('Forbidden');
        await this.prismaService.card.delete({
            where: { cardId },
        });
        return {
            data: {
                cardId: card.cardId,
                title: card.title,
                description: card.description,
                message: 'Card deleted successfully',
            },
        };
    }
    async update(cardId: number, userId: number, updateCardDto: UpdateCardDto) {
        const card = await this.prismaService.card.findUnique({
            where: { cardId },
            include: { list: true },
        });
        if (!card) throw new NotFoundException('Card not found');
        const userBoard = await this.prismaService.boardUsers.findFirst({
            where: { boardId: card.list.boardId, userId },
        });
        if (!userBoard) throw new ForbiddenException('Forbidden');
        await this.prismaService.card.update({
            where: { cardId },
            data: updateCardDto,
        });
        return {
            data: {
                cardId: card.cardId,
                title: card.title,
                description: card.description,
                message: 'Card updated successfully',
            },
        };
    }
}
