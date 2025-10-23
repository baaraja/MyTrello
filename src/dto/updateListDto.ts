import { IsNotEmpty } from 'class-validator';

export class UpdateListDto {
    @IsNotEmpty()
    readonly name?: string;
}
