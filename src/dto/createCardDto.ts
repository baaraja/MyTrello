import { IsNotEmpty } from "class-validator";

export class CreateCardDto {
    @IsNotEmpty()
    readonly title: string;
    readonly description?: string;
    @IsNotEmpty()
    readonly listId: number;
}
