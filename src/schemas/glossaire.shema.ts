import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * The glossaire schema.
 * Used by the glossaire module to access the glossaire collection in the database.
 */
@Schema()
export class Glossaire extends Document {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    definition: string;

    @Prop({ required: false })
    remarque: string;

    @Prop({ required: false })
    plusInfo: string;
}

export const GlossaireSchema = SchemaFactory.createForClass(Glossaire);