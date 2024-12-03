import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * The main function that starts the NestJS application.
 */
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT ?? 3000);
    console.log(
        `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
    );
}

bootstrap();