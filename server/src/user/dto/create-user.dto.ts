import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDTO{
    @IsString()
    @IsNotEmpty()
    public readonly name: string;

    @IsOptional()
    @IsString()
    public access_token!:string;
}