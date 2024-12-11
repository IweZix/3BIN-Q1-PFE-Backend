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
import { GroupIssueService } from '../groupIssue/groupIssue.service';
import { IssueService } from '../issue/issue.service';
import { GroupIssue } from 'src/schemas/groupIssue.schema';
import { Issue } from 'src/schemas/issue.schema';
import { log } from 'console';

@Injectable()
export class ScoringService {
    public constructor(
        @InjectModel(Scoring.name) private ScoringModel: Model<Scoring>,
        @InjectModel(IssueScoring.name) private IssueScoringModel: Model<IssueScoring>,
        private readonly issueService: IssueService,
        private readonly groupIssueService: GroupIssueService,
        private readonly authCompanyService: AuthCompanyService,
    ) {}

    public async getScoresTotal(email: string): Promise<Scoring[]> {
        return this.ScoringModel.find({ companyEmail: email }).exec();
    }

    public async calculateScore(email: string): Promise<Scoring> {
        const company: Company = await this.authCompanyService.getCompanyByEmail(email);
        const QuestionAnswer: QuestionAnswer[] = company.questions;
        const naQuestions: QuestionAnswer[] = company.naQuestions;
        let totalScoreNow = 0;
        let totalScore2Years = 0;
        let totalTotal = 0;
        let scoring = new this.ScoringModel();
        scoring.companyEmail = company.email;
        scoring.issuesList = [];
        scoring.percentNow = 0.7;


        for (const questionAnswer of QuestionAnswer) {
            let issueScoring = new this.IssueScoringModel();
            const [scoreNow, score2Years, scoreTotal] = this.calculateFromIssue(questionAnswer.questionsList);
            let scoreTotalNA = this.calculateNAScoreFromIssue(naQuestions, questionAnswer.issue_id);

            issueScoring.issue = questionAnswer.issue_id;
            issueScoring.scoreTotalNow = parseFloat((scoreNow + scoreTotalNA).toFixed(2));
            issueScoring.scoreTotal2Years = parseFloat((score2Years).toFixed(2));
            issueScoring.scoreTotal = parseFloat((scoreTotal +scoreTotalNA ).toFixed(2));
            scoring.issuesList.push(issueScoring);
            if (scoreTotal < scoreNow) {
                totalTotal = scoreNow;
            }
            totalScoreNow += scoreNow;
            totalScore2Years += score2Years;
        }
        scoring.scoreTotalNow = totalScoreNow;
        scoring.scoreTotal2Years = totalScore2Years;
        scoring.totalTotal = await this.calculateScoreTotalByGroupIssue(scoring.issuesList);
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

    private calculateNAScoreFromIssue(questionAnswers: QuestionAnswer[], idIssue: number): number {
        let scoreTotal = 0;
        for (const questions of questionAnswers) {
            if (questions.issue_id === idIssue) {
                for (const question of questions.questionsList) {
                    scoreTotal += question.scoreTotal;
                }
            }
        }
        return scoreTotal;
    }

    private async  calculateScoreTotalByGroupIssue(issues: IssueScoring[]): Promise<number> {
        const listGroup : GroupIssue[] = await this.groupIssueService.getAllGroupIssues();//On récup la liste des groupissues
        const listIssue: Issue[]  = await this.issueService.getAllIssues();//On récup la liste des issues
        let total: number[]=[];
        const percentNow = 0.7;
        let compteur=0; 
        let compteurIssue = 0;
        for(const groupIssue of listGroup){
            total[compteur]=0;
            
            for(const issue of listIssue){
                if(groupIssue.groupIssueName===issue.group_name){
                    for(const issueScoring of issues){                       
                        if(issueScoring.issue === Number(issue._id)){
                            compteurIssue++;
                             if(issueScoring.scoreTotal!=0){
                            total[compteur]+= Number(Number((issueScoring.scoreTotalNow * percentNow + issueScoring.scoreTotal2Years * (1 - percentNow))/issueScoring.scoreTotal).toFixed(2));
                             }
                           }
                    }
                }
            }
            total[compteur] = (total[compteur]/compteurIssue) * 0,3 ;
            compteur++;
        }        
        return total.reduce((a, b) => a + b);
    }
}
