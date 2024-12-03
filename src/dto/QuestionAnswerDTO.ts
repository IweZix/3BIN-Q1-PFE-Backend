import { IsString, IsNotEmpty, IsArray } from "class-validator";

export class QuestionAnswerDTO {
    @IsArray()
    @IsNotEmpty()
    listAnswerNow: number[];

    @IsArray()
    @IsNotEmpty()
    listAnswerInTwoYears: number[];

    @IsString()
    @IsNotEmpty()
    comment: string;
}
