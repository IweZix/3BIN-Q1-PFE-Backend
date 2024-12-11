import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CompanyDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsBoolean()
    @IsNotEmpty()
    formIsComplete: boolean;

    @IsBoolean()
    @IsNotEmpty()
    isValidated: boolean;
}
