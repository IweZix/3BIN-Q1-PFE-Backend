import { IsString, IsEmail, IsNotEmpty, IsArray } from 'class-validator';

export class RegisterCompanyDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsArray()
    @IsNotEmpty()
    template: number[];
}
