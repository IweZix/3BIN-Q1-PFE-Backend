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

    @Prop({ required: false })
    naQuestions: QuestionAnswer[];

    @Prop({ required: true })
    isPasswordUpdated: boolean;

    @Prop({ required: false, default: false })
    formIsComplete: boolean;

    @Prop({ required: false, default: false })
    isValidated: boolean;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
