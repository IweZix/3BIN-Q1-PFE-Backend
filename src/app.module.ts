/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/db.module';
import { AuthCompanyModule } from "./modules/authCompany/authCompany.module";

/**
 * The AppModule is the root module of the application.
 */
@Module({
    imports: [DatabaseModule, AuthModule, AuthCompanyModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
