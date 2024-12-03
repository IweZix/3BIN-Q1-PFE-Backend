import { IsNotEmpty, IsString } from 'class-validator';

export class TemplateDTO {
    @IsString()
    @IsNotEmpty()
    templateName: string;
}
