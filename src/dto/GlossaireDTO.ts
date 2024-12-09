import { IsString, IsNotEmpty } from 'class-validator';

export class GlossaireDTO {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    definition: string;

    @IsString()
    @IsNotEmpty()
    remarque: string;

    @IsString()
    @IsNotEmpty()
    plusInfo: string;
}