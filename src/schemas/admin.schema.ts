import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * The auth schema.
 * Used by the auth module to access the auth collection in the database.
 */
@Schema()
export class Admin extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    isPasswordUpdated: boolean;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
