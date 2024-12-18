import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from 'src/schemas/company.schema';
import { AuthCompanyController } from './authCompany.controller';
import { AuthCompanyService } from './authCompany.service';
import { QuestionModule } from '../question/question.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]), QuestionModule, AuthModule],
    providers: [AuthCompanyService],
    controllers: [AuthCompanyController],
    exports: [AuthCompanyService],
})
export class AuthCompanyModule {}
