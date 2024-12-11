import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Question } from './question.schema';

@Schema()
export class QuestionAnswer extends Document {
    @Prop({ required: true })
    issue_id: number;

    @Prop({ required: true })
    questionsList: Question[];

    @Prop({ required: false })
    validatedQuestion: boolean;
}

export const QuestionAnswerSchema = SchemaFactory.createForClass(QuestionAnswer);
