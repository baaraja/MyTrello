import { IsNotEmpty } from 'class-validator';

export class UpdateWorkspaceDto {
    @IsNotEmpty()
    readonly name?: string;
    readonly description?: string;
}
