import { Controller, Get, Post, HttpCode, Body, ConflictException } from '@nestjs/common';
import { TemplateService } from './template.services';
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
}
