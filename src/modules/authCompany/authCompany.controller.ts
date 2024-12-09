import {
    Body,
    ConflictException,
    Controller,
    HttpCode,
    NotFoundException,
    Patch,
    Post,
    Get,
    ValidationPipe,
    UnauthorizedException,
    Headers,
} from '@nestjs/common';
import { AuthCompanyService } from './authCompany.service';
import { RegisterCompanyDTO } from '../../dto/RegisterCompanyDTO';
import { Company } from '../../schemas/company.schema';
import { QuestionAnswer } from '../../schemas/questionAnswer.schema';
import { LoginDTO } from '../../dto/LoginDTO';
import { AuthService } from '../auth/auth.service';

@Controller('authCompany')
export class AuthCompanyController {
    private readonly authCompanyService: AuthCompanyService;
    private readonly authservice: AuthService;

    public constructor(authCompanyService: AuthCompanyService, authservice: AuthService) {
        this.authCompanyService = authCompanyService;
        this.authservice = authservice;
    }

    @Post('register-company')
    @HttpCode(201)
    async registerCompany(@Body(new ValidationPipe()) company: RegisterCompanyDTO): Promise<Company> {
        const companyFound: Company = await this.authCompanyService.getCompanyByEmail(company.email);
        if (companyFound) {
            throw new ConflictException('Company already exists');
        }
        return this.authCompanyService.register(company);
    }

    @Post('login-company')
    @HttpCode(200)
    async login(@Body(new ValidationPipe()) company: LoginDTO): Promise<Company> {
        const companyFound = await this.authCompanyService.getCompanyByEmail(company.email);
        if (!companyFound) {
            throw new ConflictException('Company not found');
        }
        return this.authCompanyService.login(company, companyFound);
    }

    @Post('verify-company')
    @HttpCode(200)
    async verify(@Headers('Authorization') token: string): Promise<Company> {
        return this.authCompanyService.verify(token);
    }

    @Post('answerForm')
    @HttpCode(201)
    async answerForm(
        @Body('listQuestions') question: QuestionAnswer[],
        @Headers('Authorization') token: string,
    ): Promise<void> {
        console.log(question);
        const email = await this.authCompanyService.getUserByToken(token);
        if (!email) {
            throw new NotFoundException('Company not found');
        }
        this.authCompanyService.answerForm(question, email);
    }

    /**
     * Verify password updated.
     * @param email The email of the company.
     * @returns {Promise<boolean>} True if the password is updated, false otherwise.
     */
    @Post('verify-password-updated')
    @HttpCode(200)
    async verifyPasswordUpdated(@Body('email', new ValidationPipe()) email: string): Promise<boolean> {
        const company = await this.authCompanyService.getCompanyByEmail(email);
        if (!company) {
            throw new NotFoundException('Company not found');
        }
        return await this.authCompanyService.verifyPasswordUpdated(company);
    }

    /**
     * Update the password of a company.
     * @param password The new password.
     * @param token The token of the company.
     * @returns {Promise<{success: boolean, message: string}>} The result of the update.
     */
    @Patch('updatePassword')
    @HttpCode(200)
    async updatePasswordCompany(
        @Body('password', new ValidationPipe()) password: string,
        @Headers('Authorization') token: string,
    ): Promise<boolean> {
        try{
        const decoded = await this.authCompanyService.verify(token);
        const email = decoded.email;
       
        

        await this.authCompanyService.updatePassword(email, password);
    }catch(e){
        return false;
    }
        return true;
    }

    /**
     * Get all companies
     * @param {string} token The token of the company
     * @return {Promise<Company[]>} All companies
     */
    @Get('all')
    @HttpCode(200)
    async getAllCompanies(@Headers('Authorization') token: string): Promise<Company[]> {
        const decoded = await this.authservice.verify(token);
        if (!decoded) {
            throw new UnauthorizedException('Unauthorized');
        }
        return this.authCompanyService.getAllCompanies();
    }

    @Post('answerFormCompleted')
    @HttpCode(201)
    async answerFormCompleted(
        @Body('listQuestions') question: QuestionAnswer[],
        @Headers('Authorization') token: string,
    ): Promise<void> {
        console.log(question);
        const email = await this.authCompanyService.getUserByToken(token);
        if (!email) {
            throw new NotFoundException('Company not found');
        }
        this.authCompanyService.answerFormCompleted(question, email);
    }

    /**
     * Get all companies
     * @param {string} token The token of the company
     * @return {Promise<Company[]>} All companies
     */
    @Get('formCompleted')
    @HttpCode(200)
    async getFormCompleted(@Headers('Authorization') token: string): Promise<boolean> {
        const company = await this.authCompanyService.verify(token);
        if (!company) {
            throw new UnauthorizedException('Unauthorized');
        }
        return company.formIsComplete;
    }

    @Get('answerForm')
    @HttpCode(200)
    async getAnswerForm(@Headers('Authorization') token: string): Promise<QuestionAnswer[]> {
        const email = await this.authCompanyService.getUserByToken(token);
        if (!email) {
            throw new NotFoundException('Company not found');
        }
        return await this.authCompanyService.getAnswerForm(email);
    }

    @Get('NAForm')
    @HttpCode(200)
    async getNAForm(@Headers('Authorization') token: string): Promise<QuestionAnswer[]> {
        const email = await this.authCompanyService.getUserByToken(token);
        if (!email) {
            throw new NotFoundException('Company not found');
        }
        return await this.authCompanyService.getNAForm(email);
    }
}
