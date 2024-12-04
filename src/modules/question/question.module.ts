import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
    QuestionAnswer,
    QuestionAnswerSchema,
} from '../../schemas/questionAnswer.schema';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: QuestionAnswer.name, schema: QuestionAnswerSchema },
        ]),
    ],
    providers: [QuestionService],
    controllers: [QuestionController],
    exports: [QuestionService],
})
export class QuestionModule {}
