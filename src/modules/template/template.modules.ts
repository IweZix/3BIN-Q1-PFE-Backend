import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Template, TemplateSchema } from '../../schemas/template.schema';
import { TemplateService } from './template.services';
import { TemplateController } from './Template.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: Template.name, schema: TemplateSchema }])],
    providers: [TemplateService, TemplateService],
    controllers: [TemplateController],
    exports: [TemplateService],
})
export class TemplateModule {}
