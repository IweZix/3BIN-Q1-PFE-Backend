import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Scoring, ScoringSchema } from '../../schemas/scoring.schema';
import { ScoringService } from './scoring.service';
import { ScoringController } from './scoring.controller';
import { IssueScoring, IssueScoringSchema } from '../../schemas/issueScoring.schema';
import { AuthModule } from '../auth/auth.module';
import { AuthCompanyModule } from '../authCompany/authCompany.module';
import { IssueModule } from '../issue/issue.module';
import { GroupIssueModule } from '../groupIssue/groupIssue.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Scoring.name, schema: ScoringSchema }]),
        MongooseModule.forFeature([{ name: IssueScoring.name, schema: IssueScoringSchema }]), // Correctly import IssueScoring schema
        IssueModule,
        GroupIssueModule,
        AuthModule,
        AuthCompanyModule,
    ],
    providers: [ScoringService],
    controllers: [ScoringController],
    exports: [ScoringService],
})
export class ScoringModule {}
