import { Controller, Get, Post, HttpCode, Body, ConflictException, Delete, Patch, NotFoundException} from '@nestjs/common';
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

    @Delete('delete-issue')
    @HttpCode(204)
    async deleteIssue(@Body(new ValidationPipe()) IssueDto: { issueName: string }): Promise<void> {
        const existingIssue: Issue = await this.issueService.getIssueByName(IssueDto.issueName);
        if (!existingIssue) {
            throw new NotFoundException('issue not found');
        }
        await this.issueService.deleteIssueByName(IssueDto.issueName);
    }

    @Patch('patch-issueName')
    @HttpCode(200)
    async updateIssueName(
        @Body('issueName') issueName: string,
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
