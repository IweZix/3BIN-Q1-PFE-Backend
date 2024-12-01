import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

/**
 * The AuthModule is a feature module that encapsulates all the auth-related features.
 */
@Module({
    imports: [
        /**
         * MongooseModule.forFeature() declares a schema that is used by the AuthModule.
         * Schema name is translated to a collection name by Mongoose. (remove capital letter and add an 's' at the end)
         */
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
