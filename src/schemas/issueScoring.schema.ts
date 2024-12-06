import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { QuestionAnswer } from './questionAnswer.schema';

@Schema()
export class IssueScoring extends Document {
    @Prop({ required: true })
    issue: number;

    @Prop({ required: true })
    scoreTotalNow: number;

    @Prop({ required: true })
    scoreTotal2Years: number;

    @Prop({ required: true })
    scoreTotal: number;
}

export const IssueScoringSchema = SchemaFactory.createForClass(IssueScoring);
