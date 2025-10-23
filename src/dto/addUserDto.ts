import { IsNotEmpty } from "class-validator";

export class AddUserDto {
    @IsNotEmpty()
    readonly userId: number;
}
