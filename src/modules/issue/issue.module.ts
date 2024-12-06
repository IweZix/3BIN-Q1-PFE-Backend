import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Issue, IssueSchema } from '../../schemas/issue.schema';
import { IssueService } from './issue.service';
import { IssueController } from './issue.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: Issue.name, schema: IssueSchema }])],
    providers: [IssueService, IssueService],
    controllers: [IssueController],
    exports: [IssueService],
})
export class IssueModule {}
