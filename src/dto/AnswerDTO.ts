import { IsString, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export class AnswerDTO {
    @IsString()
    @IsNotEmpty()
    textAnswer: string;

    @IsString()
    @IsNotEmpty()
    comment: string;

    @IsBoolean()
    @IsNotEmpty()
    isNow: boolean;

    @IsBoolean()
    @IsNotEmpty()
    is2years: boolean;

    @IsNumber()
    @IsNotEmpty()
    scoreNow: number;

    @IsNumber()
    @IsNotEmpty()
    score2: number;

    @IsNumber()
    @IsNotEmpty()
    template: number;
}
