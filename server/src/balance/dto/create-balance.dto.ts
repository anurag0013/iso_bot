import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBalanceDTO{
  @IsOptional()
    public readonly number: string;

    // @IsOptional()
    // @IsString()
    // public name:string;

    // @IsOptional()
    // @IsString()
    // public balance: string;
}