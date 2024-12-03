import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class AnswerDTO {
    @IsString()
    @IsNotEmpty()
    textAnswer: string;

    @IsNumber()
    @IsNotEmpty()
    template: number;

    @IsNumber()
    @IsNotEmpty()
    score: number;

    @IsNumber()
    @IsNotEmpty()
    scoreEngagement: number;
}
