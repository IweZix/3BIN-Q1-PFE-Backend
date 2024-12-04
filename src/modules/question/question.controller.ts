import { Controller, Get, HttpCode } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionAnswer } from '../../schemas/questionAnswer.schema';

@Controller('question')
export class QuestionController {
    private readonly questionService: QuestionService;

    public constructor(questionService: QuestionService) {
        this.questionService = questionService;
    }

    @Get()
    @HttpCode(200)
    async getAllQuestions(): Promise<QuestionAnswer[]> {
        return this.questionService.getAllQuestions();
    }
}
