import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class RegisteAdminDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
