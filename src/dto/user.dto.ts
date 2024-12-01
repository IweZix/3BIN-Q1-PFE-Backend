import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class UserDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class LoginDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
