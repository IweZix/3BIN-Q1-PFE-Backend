import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GroupIssue } from '../../schemas/groupIssue.schema';
import { Model } from 'mongoose';

@Injectable()
export class GroupIssueService {
    public constructor(
        @InjectModel(GroupIssue.name)
        private GroupIssueModel: Model<GroupIssue>,
    ) {}

    public async getAllGroupIssues(): Promise<GroupIssue[]> {
        return this.GroupIssueModel.find().exec();
    }

    public async createGroupIssue(GroupIssueDto: { groupIssueName: string }): Promise<GroupIssue> {
        const newGroupIssue = new this.GroupIssueModel(GroupIssueDto);
        return newGroupIssue.save();
    }

    public async getGroupIssueByName(groupIssueName: string): Promise<GroupIssue> {
        console.log('groupIssueName', groupIssueName);
        return await this.GroupIssueModel.findOne({ groupIssueName }).exec();
    }
    public async deleteGroupIssueByName(groupIssueName: string): Promise<void> {
        await this.GroupIssueModel.deleteOne({ groupIssueName }).exec();
    }

    public async updateGroupIssueName(groupIssueName: string, newGroupIssueName: string): Promise<void> {
        await this.GroupIssueModel.updateOne({ groupIssueName }, { groupIssueName: newGroupIssueName }).exec();
    }
}
