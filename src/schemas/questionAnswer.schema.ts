import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Question } from './question.schema';

@Schema()
export class QuestionAnswer extends Document {
    @Prop({ required: true })
    issueId: number;

    @Prop({ required: true })
    questionsList: Question[];
}

export const QuestionAnswerSchema = SchemaFactory.createForClass(QuestionAnswer);
