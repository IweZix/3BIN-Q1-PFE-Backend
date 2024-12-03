import {
    Body,
    Controller,
    HttpCode,
    NotFoundException,
    Post,
    ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Admin } from 'src/schemas/admin.schema';
import { RegisterAdminDTO } from 'src/dto/RegisterAdminDTO';
import { LoginDTO } from 'src/dto/LoginDTO';

/**
 * The controller for the auth module.
 * API paths: /auth
 * URL: http://localhost:3000/auth
 */
@Controller('auth')
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
    async registerAdmin(@Body(new ValidationPipe()) user: RegisterAdminDTO): Promise<Admin> {
        const userFound: Admin = await this.userService.getAdminByEmail(
            user.email,
        );
        if (userFound) {
            throw new NotFoundException('User already exists');
        }
        return this.userService.register(user);
    }

    /**
     * Login a user.
     * @param user The user to login.
     * @returns {Promise<Admin>} The logged-in user.
     */
    @Post('login')
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
    @Post('verify')
    @HttpCode(200)
    async verify(@Body('token', new ValidationPipe()) token: string): Promise<Admin> {
        return this.userService.verify(token);
    }
}
