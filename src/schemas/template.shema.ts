import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * The auth schema.
 * Used by the auth module to access the auth collection in the database.
 */
@Schema()
export class template extends Document {
    @Prop({ required: true })
    name: string;

}

export const TemplateSchema = SchemaFactory.createForClass(Template);
