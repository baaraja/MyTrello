import { IsNotEmpty } from "class-validator";

export class CreateListDto {
    @IsNotEmpty()
    readonly name: string;
    @IsNotEmpty()
    readonly boardId: number;
}
