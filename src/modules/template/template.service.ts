import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Template } from '../../schemas/template.schema';
import { Model } from 'mongoose';

@Injectable()
export class TemplateService {
    public constructor(
        @InjectModel(Template.name)
        private TemplateModel: Model<Template>,
    ) {}

    public async getAllTemplates(): Promise<Template[]> {
        return this.TemplateModel.find().exec();
    }

    public async createTemplate(TemplateDto: { templateName: string }): Promise<Template> {
        const newTemplate = new this.TemplateModel(TemplateDto);
        return newTemplate.save();
    }

    public async getTemplateByName(templateName: string): Promise<Template> {
        return await this.TemplateModel.findOne({ templateName }).exec();
    }

    public async getTemplateById(templateId: string): Promise<Template> {
        return await this.TemplateModel.findById(templateId).exec();
    }

    public async deleteTemplateByName(templateName: string): Promise<void> {
        await this.TemplateModel.deleteOne({ templateName }).exec();
    }

    public async updateTemplateName(templateId: string, newTemplateName: string): Promise<void> {
        await this.TemplateModel.updateOne({ _id: templateId }, { templateName: newTemplateName }).exec();
    }
}
