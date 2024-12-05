import { Body, ConflictException, Controller, HttpCode, NotFoundException, Post, ValidationPipe,Get,Param,Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Admin } from 'src/schemas/admin.schema';
import { RegisteAdminDTO } from 'src/dto/RegisteAdminDTO';
import { LoginDTO } from 'src/dto/LoginDTO';
import { QuestionAnswer } from 'src/schemas/questionAnswer.schema';

/**
 * The controller for the auth module.
 * API paths: /authAdmin
 * URL: http://localhost:3000/auth
 */
@Controller('authAdmin')
export class AuthController {
    /**
     * The auth service.
     */
    private readonly userService: AuthService;

    /**
     * The constructor of the auth controller.
     * @param userService The auth service.
     */
    constructor(userService: AuthService) {
        this.userService = userService;
    }

    /**
     * Create a new admin.
     * @param user The auth to create.
     * @returns {Promise<Admin>} The created auth.
     */
    @Post('register-admin')
    @HttpCode(201)
    async registerAdmin(@Body(new ValidationPipe()) user: RegisteAdminDTO): Promise<Admin> {
        const userFound: Admin = await this.userService.getAdminByEmail(user.email);
        if (userFound) {
            throw new ConflictException('User already exists');
        }
        return this.userService.register(user);
    }

    /**
     * Login a user.
     * @param user The user to login.
     * @returns {Promise<Admin>} The logged-in user.
     */
    @Post('login-admin')
    @HttpCode(200)
    async login(@Body(new ValidationPipe()) user: LoginDTO): Promise<Admin> {
        const userFound = await this.userService.getAdminByEmail(user.email);
        if (!userFound) {
            throw new NotFoundException('User not found');
        }
        return await this.userService.login(user, userFound);
    }

    /**
     * Verify a user.
     * @param token The token to verify.
     * @returns {Promise<Admin>} The verified user.
     */
    @Post('verify-admin')
    @HttpCode(200)
    async verify(@Body('token', new ValidationPipe()) token: string): Promise<Admin> {
        return this.userService.verify(token);
    }

    /**
     * Verify password updated.
     * @param email The email of the user.
     * @returns {Promise<boolean>} True if the password is updated, false otherwise.
     */
    @Post('verify-password-updated')
    @HttpCode(200)
    async verifyPasswordUpdated(@Body('email', new ValidationPipe()) email: string): Promise<boolean> {
        const user = await this.userService.getAdminByEmail(email);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return await this.userService.verifyPasswordUpdated(user);
    }

    @Get('getAnswerFormUser')
    @HttpCode(200)
    async getAnswerFormUser(@Body('email') email: string
    ,@Headers('Authorization') token: string ): Promise<QuestionAnswer[]> {
        this.userService.verify(token);
        try{
            return this.userService.getAnswerFormUser(email);
        }catch(error){
            throw new NotFoundException('User not found');
        }
        
    }
}
