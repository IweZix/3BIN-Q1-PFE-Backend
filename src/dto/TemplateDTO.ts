import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TemplateDTO {
    @IsString()
    @IsNotEmpty()
    templateName: string;

    @IsNumber()
    @IsNotEmpty()
    _id: string;
}
