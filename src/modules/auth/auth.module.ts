import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'src/schemas/admin.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { QuestionAnswer, QuestionAnswerSchema } from 'src/schemas/questionAnswer.schema';
import { Company, CompanySchema } from 'src/schemas/company.schema';

/**
 * The AuthModule is a feature module that encapsulates all the auth-related features.
 */
@Module({
    imports: [
        /**
         * MongooseModule.forFeature() declares a schema that is used by the AuthModule.
         * Schema name is translated to a collection name by Mongoose. (remove capital letter and add an 's' at the end)
         */
        MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
        MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
        MongooseModule.forFeature([{ name: QuestionAnswer.name, schema: QuestionAnswerSchema }]),
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
