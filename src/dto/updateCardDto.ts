import { IsNotEmpty } from 'class-validator';

export class UpdateCardDto {
    @IsNotEmpty()
    readonly title?: string;
    readonly description?: string;
}
