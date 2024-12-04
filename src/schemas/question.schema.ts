import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Answer } from './answer.schema';
import { Exclude } from "class-transformer";

@Schema()
export class Question extends Document {
    @Prop({ required: true })
    textQuestion: string;

    @Prop({ required: true })
    answer: Answer[];

    @Exclude()
    @Prop({ required: true })
    scoreTotal: number;
}

// export const QuestionSchema = SchemaFactory.createForClass(Question);
