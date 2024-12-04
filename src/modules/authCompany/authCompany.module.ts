import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from 'src/schemas/company.schema';
import { AuthCompanyController } from './authCompany.controller';
import { AuthCompanyService } from './authCompany.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Company.name, schema: CompanySchema },
        ]),
    ],
    providers: [AuthCompanyService],
    controllers: [AuthCompanyController],
    exports: [AuthCompanyService],
})
export class AuthCompanyModule {}
