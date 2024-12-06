import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Scoring, ScoringSchema } from '../../schemas/scoring.schema';
import { ScoringService } from './scoring.service';
import { ScoringController } from './scoring.controller';
import { AuthCompanyModule } from '../authCompany/authCompany.module';
import { IssueScoring, IssueScoringSchema } from '../../schemas/issueScoring.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Scoring.name, schema: ScoringSchema }]),
        MongooseModule.forFeature([{ name: IssueScoring.name, schema: IssueScoringSchema }]), // Correctly import IssueScoring schema
        AuthCompanyModule,
    ],
    providers: [ScoringService],
    controllers: [ScoringController],
    exports: [ScoringService],
})
export class ScoringModule {}