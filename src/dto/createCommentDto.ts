import { IsNotEmpty } from "class-validator";

export class CreateCommentDto {
    @IsNotEmpty()
    readonly postId: number;
    @IsNotEmpty()
    readonly content: string;
}
