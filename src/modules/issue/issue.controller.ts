import { Controller, Get, Post, HttpCode, Body, ConflictException } from '@nestjs/common';
import { IssueService } from './issue.service';
import { Issue } from '../../schemas/issue.schema';
import { ValidationPipe } from '@nestjs/common';

@Controller('issue')
export class IssueController {
    private readonly issueService: IssueService;

    public constructor(issueService: IssueService) {
        this.issueService = issueService;
    }

    @Get()
    @HttpCode(200)
    async getAllIssues(): Promise<Issue[]> {
        return this.issueService.getAllIssues();
    }

    @Post('create-issue')
    @HttpCode(201)
    async createOneIssue(@Body(new ValidationPipe()) IssueDto: { issueName: string }): Promise<Issue> {
        const existingIssue: Issue = await this.issueService.getIssueByName(IssueDto.issueName);
        if (existingIssue) {
            throw new ConflictException('Issue already exists');
        }
        return this.issueService.createIssue(IssueDto);
    }
}
