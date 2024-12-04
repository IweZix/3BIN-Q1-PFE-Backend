import {
    Body,
    ConflictException,
    Controller,
    HttpCode,
    Post,
    ValidationPipe,
} from '@nestjs/common';
import { AuthCompanyService } from './authCompany.service';
import { RegisterCompanyDTO } from '../../dto/RegisterCompanyDTO';
import { Company } from '../../schemas/company.schema';
import {  QuestionAnswer } from '../../schemas/questionAnswer.schema';
import { LoginDTO } from '../../dto/LoginDTO';

@Controller('authCompany')
export class AuthCompanyController {
    private readonly authCompanyService: AuthCompanyService;

    public constructor(authCompanyService: AuthCompanyService) {
        this.authCompanyService = authCompanyService;
    }

    @Post('register-company')
    @HttpCode(201)
    async registerCompany(
        @Body(new ValidationPipe()) company: RegisterCompanyDTO,
    ): Promise<Company> {
        const companyFound: Company =
            await this.authCompanyService.getCompanyByEmail(company.email);
        if (companyFound) {
            throw new ConflictException('Company already exists');
        }
        return this.authCompanyService.register(company);
    }

    @Post('login-company')
    @HttpCode(200)
    async login(
        @Body(new ValidationPipe()) company: LoginDTO,
    ): Promise<Company> {
        const companyFound = await this.authCompanyService.getCompanyByEmail(
            company.email,
        );
        if (!companyFound) {
            throw new ConflictException('Company not found');
        }
        return this.authCompanyService.login(company, companyFound);
    }

    @Post('verify-company')
    @HttpCode(200)
    async verify(
        @Body('token', new ValidationPipe()) token: string,
    ): Promise<Company> {
        return this.authCompanyService.verify(token);
    }

    @Post('/answerForm')
    @HttpCode(201)
    async answerForm(@Body('answerForm') answerForm : QuestionAnswer[],
    @Body('token', new ValidationPipe() )token:string ): Promise<void> {
        const email=await this.authCompanyService.getUserByToken(token);
        this.authCompanyService.answerForm(answerForm,email);
    }
}
