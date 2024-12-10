import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * The group issue schema.
 * Used by the issue module to access the group issue collection in the database.
 */
@Schema()
export class GroupIssue extends Document {
    @Prop({ required: true })
    groupIssueName: string;

    @Prop({ required: false })
    _id: number;
}

export const GroupIssueSchema = SchemaFactory.createForClass(GroupIssue);
