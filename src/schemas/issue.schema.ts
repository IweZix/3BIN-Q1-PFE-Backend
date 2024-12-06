import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * The issue schema.
 * Used by the issue module to access the issue collection in the database.
 */
@Schema()
export class Issue extends Document {
    @Prop({ required: true })
    issueName: string;
}

export const IssueSchema = SchemaFactory.createForClass(Issue);
