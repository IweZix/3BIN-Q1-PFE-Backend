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
}
