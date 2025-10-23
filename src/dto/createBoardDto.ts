import { IsNotEmpty } from "class-validator";

export class CreateBoardDto {
    @IsNotEmpty()
    readonly name: string;
    readonly description?: string;
    @IsNotEmpty()
    readonly workspaceId: number;
}
