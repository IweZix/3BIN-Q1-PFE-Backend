import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/db.module';
import { AuthCompanyModule } from './modules/authCompany/authCompany.module';
import { QuestionModule } from './modules/question/question.module';
import { TemplateModule } from './modules/template/template.module';

/**
 * The AppModule is the root module of the application.
 */
@Module({
    imports: [DatabaseModule, AuthModule, AuthCompanyModule, QuestionModule, TemplateModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
