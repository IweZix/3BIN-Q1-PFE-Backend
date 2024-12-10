import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * The template schema.
 * Used by the template module to access the template collection in the database.
 */
@Schema()
export class Template extends Document {
    @Prop({ required: true })
    templateName: string;

    @Prop({ required: true })
    _id:string;
}

export const TemplateSchema = SchemaFactory.createForClass(Template);
