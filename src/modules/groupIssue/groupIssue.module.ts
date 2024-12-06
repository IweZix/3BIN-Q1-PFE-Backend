import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupIssue, GroupIssueSchema } from '../../schemas/groupIssue.schema';
import { GroupIssueService } from './groupIssue.service';
import { GroupIssueController } from './groupIssue.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: GroupIssue.name, schema: GroupIssueSchema }])],
    providers: [GroupIssueService, GroupIssueService],
    controllers: [GroupIssueController],
    exports: [GroupIssueService],
})
export class GroupIssueModule {}
