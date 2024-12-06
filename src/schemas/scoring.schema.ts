import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IssueScoring } from './issueScoring.schema';

@Schema()
export class Scoring extends Document {
    @Prop({ required: true })
    companyEmail: string;

    @Prop({ required: true })
    issuesList: IssueScoring[];

    @Prop({ required: true })
    scoreTotalNow: number;

    @Prop({ required: true })
    scoreTotal2Years: number;

    @Prop({ required: true })
    totalTotal: number;

    @Prop({ required: true })
    percentNow: number;
}

export const ScoringSchema = SchemaFactory.createForClass(Scoring);
