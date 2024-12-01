import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from '../../utils/config';

/**
 * The DatabaseModule is a global module that encapsulates the database connection.
 */
@Module({
    imports: [
        /**
         * MongooseModule.forRoot() connects to the MongoDB database.
         */
        MongooseModule.forRoot(
            `mongodb://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_HOST}`,
            {
                dbName: 'PFE',
            },
        ),
    ],
    exports: [MongooseModule], // Exporte MongooseModule pour qu'il soit accessible dans d'autres modules
})
export class DatabaseModule {}
