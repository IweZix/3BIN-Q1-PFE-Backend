import { Controller, Get, Post, HttpCode, Body, ConflictException } from '@nestjs/common';
import { GroupIssueService } from './groupIssue.service';
import { GroupIssue } from '../../schemas/groupIssue.schema';
import { ValidationPipe } from '@nestjs/common';
import { GroupIssueDTO } from 'src/dto/GroupIssueDTO';

@Controller('groupIssue')
export class GroupIssueController {
    private readonly groupIssueService: GroupIssueService;

    public constructor(groupIssueService: GroupIssueService) {
        this.groupIssueService = groupIssueService;
    }

    @Get()
    @HttpCode(200)
    async getAllGroupIssues(): Promise<GroupIssue[]> {
        return this.groupIssueService.getAllGroupIssues();
    }

    @Post('create-groupIssue')
    @HttpCode(201)
    async createOneGroupIssue(@Body(new ValidationPipe()) GroupIssueDTO: { groupIssueName: string }): Promise<GroupIssue> {
        const existingGroupIssue: GroupIssue = await this.groupIssueService.getGroupIssueByName(GroupIssueDTO.groupIssueName);
        if (existingGroupIssue) {
            throw new ConflictException('GroupIssue already exists');
        }
        return this.groupIssueService.createGroupIssue(GroupIssueDTO);
    }
}
