import { IsString, IsNotEmpty, IsNumber, IsArray } from 'class-validator';

export class QuestionDTO {
    @IsNumber()
    @IsNotEmpty()
    issueGroup: number;

    @IsNumber()
    @IsNotEmpty()
    issue: number;

    @IsArray()
    @IsNotEmpty()
    template: number[];

    @IsString()
    @IsNotEmpty()
    textQuestion: string;

    @IsArray()
    @IsNotEmpty()
    answer: string[];

    @IsNumber()
    @IsNotEmpty()
    score: number;
}
