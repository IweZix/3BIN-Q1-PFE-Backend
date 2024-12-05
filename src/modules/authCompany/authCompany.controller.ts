import { Body, ConflictException, Controller, HttpCode, NotFoundException, Patch, Post, ValidationPipe, UnauthorizedException } from '@nestjs/common';
import { AuthCompanyService } from './authCompany.service';
import { RegisterCompanyDTO } from '../../dto/RegisterCompanyDTO';
import { Company } from '../../schemas/company.schema';
import { QuestionAnswer } from '../../schemas/questionAnswer.schema';
import { LoginDTO } from '../../dto/LoginDTO';

@Controller('authCompany')
export class AuthCompanyController {
    private readonly authCompanyService: AuthCompanyService;

    public constructor(authCompanyService: AuthCompanyService) {
        this.authCompanyService = authCompanyService;
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
    async verify(@Body('token', new ValidationPipe()) token: string): Promise<Company> {
        return this.authCompanyService.verify(token);
    }

    @Post('answerForm')
    @HttpCode(201)
    async answerForm(
        @Body('listQuestions') question: QuestionAnswer[],
        @Body('token', new ValidationPipe()) token: string,
    ): Promise<void> {
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
    @Patch('update-password')
    @HttpCode(200)
    async updatePasswordCompany(
        @Body('password', new ValidationPipe()) password: string,
        @Body('token', new ValidationPipe()) token: string,
    ): Promise<{ success: boolean; message: string }> {
        const decoded = await this.authCompanyService.verify(token);
        const email = decoded.email;

        await this.authCompanyService.updatePassword(email, password);

        return {
            success: true,
            message: 'Password updated successfully',
        };
    }



}
