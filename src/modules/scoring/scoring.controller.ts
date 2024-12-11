import {
    Body,
    Controller,
    Get,
    Headers,
    HttpCode,
    NotFoundException,
    Post,
    ValidationPipe,
    Param,
} from '@nestjs/common';
import { ScoringService } from './scoring.service';
import { AuthService } from '../auth/auth.service';

@Controller('scoring')
export class ScoringController {
    private readonly scoringService: ScoringService;
    private readonly authservice: AuthService;

    public constructor(scoringService: ScoringService, authservice: AuthService) {
        this.scoringService = scoringService;
        this.authservice = authservice;
    }

    @Post()
    @HttpCode(200)
    async calculateScore(
        @Body('email', new ValidationPipe()) email: string,
        @Headers('Authorization') token: string,
    ): Promise<any> {
        this.authservice.verify(token);
        if (!email) {
            throw new NotFoundException('Invalid email');
        }
        return this.scoringService.calculateScore(email);
    }

    @Get(':email') // Capture dynamique de l'email dans l'URL
    @HttpCode(200)
    async getScoresTotal(@Param('email') email: string, @Headers('Authorization') token: string): Promise<any> {
        this.authservice.verify(token);

        if (!email) {
            throw new NotFoundException('Email is required');
        }

        return this.scoringService.getScoresTotal(email);
    }
}
