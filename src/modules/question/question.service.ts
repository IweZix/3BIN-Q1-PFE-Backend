import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QuestionAnswer } from '../../schemas/questionAnswer.schema';
import { Model } from "mongoose";

@Injectable()
export class QuestionService {
    public constructor(
        @InjectModel(QuestionAnswer.name)
        private questionAnswerModel: Model<QuestionAnswer>,
    ) {}

    public async getAllQuestions(): Promise<QuestionAnswer[]> {
        return this.questionAnswerModel.find().exec();
    }
}
