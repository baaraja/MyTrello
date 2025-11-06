import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateCardDto {
    @IsOptional()
    @IsString()
    readonly title?: string;
    @IsOptional()
    @IsString()
    readonly description?: string;
    @IsOptional()
    @IsNumber()
    readonly listId?: number;
    @IsOptional()
    @IsNumber()
    readonly userId?: number;
}
