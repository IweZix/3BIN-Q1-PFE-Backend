import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { QuestionAnswer } from './questionAnswer.schema';

@Schema()
export class Company extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    template: number[];

    @Prop({ required: false })
    questions: QuestionAnswer[];
}

export const CompanySchema = SchemaFactory.createForClass(Company);
