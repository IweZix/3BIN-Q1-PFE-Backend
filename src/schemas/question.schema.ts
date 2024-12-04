import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Answer } from './answer.schema';

@Schema()
export class Question extends Document {
    @Prop({ required: true })
    textQuestion: string;

    @Prop({ required: true })
    answer: Answer[];

    @Prop({ required: true })
    scoreTotal: number;
}

// export const QuestionSchema = SchemaFactory.createForClass(Question);
