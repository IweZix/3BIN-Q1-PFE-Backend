import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Exclude } from 'class-transformer';

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

    @Exclude()
    @Prop({ required: true })
    scoreNow: number;

    @Exclude()
    @Prop({ required: true })
    score2: number;

    @Prop({ required: true })
    template: string;

    @Prop({ required: true, type: Boolean, default: false })
    isValidated: boolean;
}
