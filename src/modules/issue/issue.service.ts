import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Issue } from '../../schemas/issue.schema';
import { Model } from 'mongoose';

@Injectable()
export class IssueService {
    public constructor(
        @InjectModel(Issue.name)
        private IssueModel: Model<Issue>,
    ) {}

    public async getAllIssues(): Promise<Issue[]> {
        return this.IssueModel.find().exec();
    }

    public async createIssue(IssueDto: { issueName: string }): Promise<Issue> {
        const newIssue = new this.IssueModel(IssueDto);
        return newIssue.save();
    }

    public async getIssueByName(issueName: string): Promise<Issue> {
        return await this.IssueModel.findOne({ issueName }).exec();
    }
    public async deleteIssueByName(issueName: string): Promise<void> {
        await this.IssueModel.deleteOne({ issueName }).exec();
    }

    public async updateIssueName(issueName: string, newIssueName: string): Promise<Issue> {
        return this.IssueModel.findOneAndUpdate(
            { issueName },
            { issueName: newIssueName },
            { new: true }, // Return the updated document
        ).exec();
    }
}
