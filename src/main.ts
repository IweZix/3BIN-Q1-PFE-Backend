import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

/**
 * The main function that starts the NestJS application.
 */
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cors());
    await app.listen(process.env.PORT ?? 3000);
    console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
}

bootstrap();
