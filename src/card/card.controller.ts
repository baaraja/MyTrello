import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CardService } from 'src/card/card.service';
import { CreateCardDto } from 'src/dto/createCardDto';
import { UpdateCardDto } from 'src/dto/updateCardDto';
import { Request } from 'express';

@Controller('c')
export class CardController {
    constructor(private readonly cardService: CardService) {}
    @UseGuards(AuthGuard('jwt'))
    @Post('create')
    create(@Body() createCardDto: CreateCardDto, @Req() request : Request) {
        const userId = request.user['userId'];
        return this.cardService.create(createCardDto, userId);
    }
    @UseGuards(AuthGuard('jwt'))
    @Delete('delete/:id')
    delete(@Param('id', ParseIntPipe) cardId: number, @Req() request : Request) {
        const userId = request.user['userId'];
        return this.cardService.delete(cardId, userId);
    }
    @UseGuards(AuthGuard('jwt'))
    @Put('update/:id')
    update(@Param('id', ParseIntPipe) cardId: number, @Body() updateCardDto : UpdateCardDto, @Req() request : Request) {
        const userId = request.user['userId'];
        return this.cardService.update(cardId, userId, updateCardDto);
    }
}
