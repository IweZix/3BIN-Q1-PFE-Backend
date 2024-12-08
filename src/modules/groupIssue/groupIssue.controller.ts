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
} from '@nestjs/common';
import { GroupIssueService } from './groupIssue.service';
import { GroupIssue } from '../../schemas/groupIssue.schema';
import { ValidationPipe } from '@nestjs/common';

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
    async createOneGroupIssue(
        @Body(new ValidationPipe()) GroupIssueDTO: { groupIssueName: string },
    ): Promise<GroupIssue> {
        const existingGroupIssue: GroupIssue = await this.groupIssueService.getGroupIssueByName(
            GroupIssueDTO.groupIssueName,
        );
        if (existingGroupIssue) {
            throw new ConflictException('GroupIssue already exists');
        }
        return this.groupIssueService.createGroupIssue(GroupIssueDTO);
    }

    @Delete('delete-groupIssue')
    @HttpCode(204)
    async deleteGroupIssue(@Body(new ValidationPipe()) IssueDto: { groupIssueName: string }): Promise<void> {
        const existingIssue: GroupIssue = await this.groupIssueService.getGroupIssueByName(IssueDto.groupIssueName);
        if (!existingIssue) {
            throw new NotFoundException('issue not found');
        }
        await this.groupIssueService.deleteGroupIssueByName(IssueDto.groupIssueName);
    }

    @Patch('patch-groupIssueName')
    @HttpCode(200)
    async updateGroupIssueName(
        @Body('groupIssueName') groupIssueName: string,
        @Body(new ValidationPipe()) updateDto: { newGroupIssueName: string },
    ): Promise<GroupIssue> {
        const existingIssue: GroupIssue = await this.groupIssueService.getGroupIssueByName(groupIssueName);
        if (!existingIssue) {
            throw new NotFoundException('groupIssue not found');
        }

        const duplicateIssue: GroupIssue = await this.groupIssueService.getGroupIssueByName(
            updateDto.newGroupIssueName,
        );
        if (duplicateIssue) {
            throw new ConflictException('A groupIssue with the new name already exists');
        }

        return this.groupIssueService.updateGroupIssueName(groupIssueName, updateDto.newGroupIssueName);
    }
}
