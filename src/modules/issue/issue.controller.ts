import {
    Controller,
    Get,
    Post,
    HttpCode,
    Body,
    ConflictException,
    Delete,
    Patch,
    NotFoundException,
    Param,
} from '@nestjs/common';
import { IssueService } from './issue.service';
import { Issue } from '../../schemas/issue.schema';
import { ValidationPipe } from '@nestjs/common';
import { GroupIssue } from '../../schemas/groupIssue.schema';
import { GroupIssueService } from '../groupIssue/groupIssue.service';

@Controller('issue')
export class IssueController {
    private readonly issueService: IssueService;
    private readonly groupIssueService: GroupIssueService;

    public constructor(issueService: IssueService, groupIssueService: GroupIssueService) {
        this.issueService = issueService;
        this.groupIssueService = groupIssueService;
    }

    @Get()
    @HttpCode(200)
    async getAllIssues(): Promise<Issue[]> {
        return this.issueService.getAllIssues();
    }

    @Post('create-issue')
    @HttpCode(201)
    async createOneIssue(
        @Body(new ValidationPipe())
        { issueName, issueGroupName }: { issueName: string; issueGroupName: string },
    ): Promise<Issue> {
        const existingIssue = await this.issueService.getIssueByName(issueName);
        if (existingIssue) {
            throw new ConflictException('Issue already exists');
        }
    
        const existingIssueGroupName = await this.groupIssueService.getGroupIssueByName(issueGroupName);
        if (!existingIssueGroupName) {
            throw new NotFoundException('Group issue not found');
        }
    
        return this.issueService.createIssue(issueName, existingIssueGroupName.groupIssueName);
    }
    

    @Delete('delete-issue/:issueName')
    @HttpCode(204)
    async deleteIssue(@Param('issueName', new ValidationPipe()) issueName: string): Promise<void> {
        const existingIssue: Issue = await this.issueService.getIssueByName(issueName);
        if (!existingIssue) {
            throw new NotFoundException('issue not found');
        }
        await this.issueService.deleteIssueByName(issueName);
    }

    @Patch('patch-issueName/:issueName')
    @HttpCode(200)
    async updateIssueName(
        @Param('issueName', new ValidationPipe()) issueName: string,
        @Body(new ValidationPipe()) updateDto: { newIssueName: string },
    ): Promise<Issue> {
        const existingIssue: Issue = await this.issueService.getIssueByName(issueName);
        if (!existingIssue) {
            throw new NotFoundException('issue not found');
        }
        const duplicateIssue: Issue = await this.issueService.getIssueByName(updateDto.newIssueName);
        if (duplicateIssue) {
            throw new ConflictException('A issue with the new name already exists');
        }

        return this.issueService.updateIssueName(issueName, updateDto.newIssueName);
    }
}
