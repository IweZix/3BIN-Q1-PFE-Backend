import {
    Controller,
    Get,
    Post,
    HttpCode,
    Body,
    Param,
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

    @Delete('delete-groupIssue/:groupIssueName')
    @HttpCode(204)
    async deleteGroupIssue(@Param('groupIssueName') groupIssueName: string) {
        const existingIssue: GroupIssue = await this.groupIssueService.getGroupIssueByName(groupIssueName);
        if (!existingIssue) {
            throw new NotFoundException('issue not found');
        }
        await this.groupIssueService.deleteGroupIssueByName(groupIssueName);
    }

    @Patch('patch-groupIssueName/:groupIssueName')
    @HttpCode(200)
    async updateGroupIssueName(
        @Param('groupIssueName') groupIssueName: string,
        @Body(new ValidationPipe()) updateDto: { newGroupIssueName: string },
    ): Promise<void> {
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

        await this.groupIssueService.updateGroupIssueName(groupIssueName, updateDto.newGroupIssueName);
    }
}
