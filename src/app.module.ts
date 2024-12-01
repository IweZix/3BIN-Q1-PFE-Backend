/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/db.module';

/**
 * The AppModule is the root module of the application.
 */
@Module({
    imports: [DatabaseModule, AuthModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
