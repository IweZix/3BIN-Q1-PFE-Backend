import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Answer extends Document {
    @Prop({ required: true })
    textAnswer: string;

    @Prop({ required: true })
    comment: string;

    @Prop({ required: true })
    isNow: boolean;

    @Prop({ required: true })
    is2years: boolean;

    @Prop({ required: true })
    scoreNow: number;

    @Prop({ required: true })
    score2: number;

    @Prop({ required: true })
    template: number;
}

// export const AnswerSchema = SchemaFactory.createForClass(Answer);
