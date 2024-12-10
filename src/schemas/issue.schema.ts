import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from "mongoose";

/**
 * The issue schema.
 * Used by the issue module to access the issue collection in the database.
 */
@Schema()
export class Issue extends Document {
    @Prop({ required: true })
    issueName: string;

    @Prop({ required: true })
    group_id: Types.ObjectId;
}

export const IssueSchema = SchemaFactory.createForClass(Issue);
