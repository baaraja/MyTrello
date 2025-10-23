import { IsNotEmpty } from 'class-validator';

export class UpdateBoardDto {
    @IsNotEmpty()
    readonly name?: string;
    readonly description?: string;
    readonly workspaceId?: number;
}
