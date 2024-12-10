import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Issue, IssueSchema } from '../../schemas/issue.schema';
import { IssueService } from './issue.service';
import { IssueController } from './issue.controller';
import { GroupIssue, GroupIssueSchema } from "../../schemas/groupIssue.schema";
import { GroupIssueModule } from "../groupIssue/groupIssue.module";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Issue.name, schema: IssueSchema }]),
        MongooseModule.forFeature([{ name: GroupIssue.name, schema: GroupIssueSchema }]),
        GroupIssueModule,
    ],
    providers: [IssueService, IssueService],
    controllers: [IssueController],
    exports: [IssueService],
})
export class IssueModule {}
