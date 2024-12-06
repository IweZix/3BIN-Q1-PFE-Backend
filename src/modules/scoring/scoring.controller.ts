import {
    Body,
    Controller,
    Get,
    Header,
    Headers,
    HttpCode, NotFoundException, Post,
    UnauthorizedException,
    ValidationPipe
} from "@nestjs/common";
import { ScoringService } from "./scoring.service";
import { AuthCompanyService } from "../authCompany/authCompany.service";

@Controller('scoring')
export class ScoringController {
    private readonly scoringService: ScoringService;
    private readonly authCompanyService: AuthCompanyService;

    public constructor(
        scoringService: ScoringService,
        authCompanyService: AuthCompanyService,
    ) {
        this.scoringService = scoringService;
        this.authCompanyService = authCompanyService;
    }

    @Post()
    @HttpCode(200)
    async calculateScore(
        @Body('email', new ValidationPipe()) email: string,
        @Headers('Authorization') token: string,
    ): Promise<any> {
        // verify token
        if (!email) {
            throw new NotFoundException('Invalid email');
        }
        return this.scoringService.calculateScore(email);
    }

    @Get()
    @HttpCode(200)
    async getScoresTotal(
        @Body('email', new ValidationPipe()) email: string,
        @Headers('Authorization') token: string,
    ): Promise<any> {
        // verify token
        if (!email) {
            throw new NotFoundException('Invalid email');
        }
        return this.scoringService.getScoresTotal(email);
    }
}