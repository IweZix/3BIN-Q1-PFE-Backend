import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Scoring } from '../../schemas/scoring.schema';
import { Model } from 'mongoose';
import { AuthCompanyService } from '../authCompany/authCompany.service';
import { QuestionAnswer } from '../../schemas/questionAnswer.schema';
import { Company } from '../../schemas/company.schema';
import { Answer } from '../../schemas/answer.schema';
import { Question } from '../../schemas/question.schema';
import { IssueScoring } from '../../schemas/issueScoring.schema';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ScoringService {
    public constructor(
        @InjectModel(Scoring.name) private ScoringModel: Model<Scoring>,
        @InjectModel(IssueScoring.name) private IssueScoringModel: Model<IssueScoring>,
        private readonly authservice: AuthService,
        private readonly authCompanyService: AuthCompanyService,
    ) {}

    public async getScoresTotal(email: string): Promise<Scoring[]> {
        return this.ScoringModel.find({ companyEmail: email }).exec();
    }

    public async calculateScore(email: string): Promise<Scoring> {
        const company: Company = await this.authCompanyService.getCompanyByEmail(email);
        const QuestionAnswer: QuestionAnswer[] = company.questions;

        let scoring = new this.ScoringModel();
        scoring.companyEmail = company.email;
        scoring.issuesList = [];
        scoring.percentNow = 0.7;

        let totalScoreNow = 0;
        let totalScore2Years = 0;
        let totalTotal = 0;
        for (const questionAnswer of QuestionAnswer) {
            let issueScoring = new this.IssueScoringModel();
            const [scoreNow, score2Years, scoreTotal] = this.calculateFromIssue(questionAnswer.questionsList);

            issueScoring.issue = questionAnswer.issueId;
            issueScoring.scoreTotalNow = scoreNow;
            issueScoring.scoreTotal2Years = score2Years;
            issueScoring.scoreTotal = scoreTotal;
            scoring.issuesList.push(issueScoring);

            if (scoreTotal < scoreNow) {
                totalTotal = scoreNow;
            }
            totalScoreNow += scoreNow;
            totalScore2Years += score2Years;
        }

        scoring.scoreTotalNow = totalScoreNow;
        scoring.scoreTotal2Years = totalScore2Years;
        scoring.totalTotal = totalScoreNow * scoring.percentNow + totalScore2Years * (1 - scoring.percentNow);
        return this.ScoringModel.create(scoring);
    }

    private calculateScoreFromAnswers(answers: Answer[]): [number, number] {
        let score = 0;
        let score2Years = 0;
        for (const answer of answers) {
            if (answer.isNow) {
                score += answer.scoreNow;
            }
            if (answer.is2years) {
                score2Years += answer.score2;
            }
        }
        return [score, score2Years];
    }

    private calculateTotalFromQuestion(question: Question): [number, number, number] {
        let scoreTotal = question.scoreTotal;
        let [score, score2Years] = this.calculateScoreFromAnswers(question.responsesList);

        return [score, score2Years, scoreTotal];
    }

    private calculateFromIssue(questions: Question[]): [number, number, number] {
        let scoreTotalIssue = 0;
        let scoreNowIssue = 0;
        let score2YearsIssue = 0;
        for (const question of questions) {
            const [score, score2Years, scoreTotal] = this.calculateTotalFromQuestion(question);
            scoreNowIssue += score;
            score2YearsIssue += score2Years;
            scoreTotalIssue += scoreTotal;
        }
        scoreTotalIssue = parseFloat(scoreTotalIssue.toFixed(2));
        return [scoreNowIssue, score2YearsIssue, scoreTotalIssue];
    }
}
