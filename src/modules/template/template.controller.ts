import {
    Controller,
    Get,
    Post,
    HttpCode,
    Body,
    ConflictException,
    Delete,
    Param,
    NotFoundException,
    Patch,
    Put,
} from '@nestjs/common';
import { TemplateService } from './template.service';
import { Template } from '../../schemas/template.schema';
import { ValidationPipe } from '@nestjs/common';

@Controller('template')
export class TemplateController {
    private readonly templateService: TemplateService;

    public constructor(templateService: TemplateService) {
        this.templateService = templateService;
    }

    @Get()
    @HttpCode(200)
    async getAllTemplates(): Promise<Template[]> {
        return this.templateService.getAllTemplates();
    }

    @Post('create-template')
    @HttpCode(201)
    async createOneTemplate(@Body(new ValidationPipe()) TemplateDto: { templateName: string }): Promise<Template> {
        const existingTemplate: Template = await this.templateService.getTemplateByName(TemplateDto.templateName);
        if (existingTemplate) {
            throw new ConflictException('Template already exists');
        }
        return this.templateService.createTemplate(TemplateDto);
    }

    @Delete('delete-template/:templateName')
    @HttpCode(204)
    async deleteTemplate(@Param('templateName') templateName: string): Promise<void> {
        const existingTemplate: Template = await this.templateService.getTemplateByName(templateName);
        if (!existingTemplate) {
            throw new NotFoundException('Template not found');
        }
        await this.templateService.deleteTemplateByName(templateName);
    }

    @Put('patch-templateName/:id')
    @HttpCode(200)
    async updateTemplateName(
        @Param('id') templateId: string,
        @Body(new ValidationPipe()) updateDto: { newTemplateName: string },
    ): Promise<void> {
        const existingTemplate: Template = await this.templateService.getTemplateById(templateId);
        if (!existingTemplate) {
            throw new NotFoundException('Template not found');
        }

        const duplicateTemplate: Template = await this.templateService.getTemplateByName(updateDto.newTemplateName);
        if (duplicateTemplate) {
            throw new ConflictException('A template with the new name already exists');
        }

        await this.templateService.updateTemplateName(templateId, updateDto.newTemplateName);
    }
}
