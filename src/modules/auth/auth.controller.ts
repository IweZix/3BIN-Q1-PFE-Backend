import {
    Body,
    Controller,
    HttpCode,
    NotFoundException,
    Post,
    ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/schemas/user.schema';
import { UserDTO, LoginDTO } from 'src/dto/user.dto';

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
     * Create a new auth.
     * @param user The auth to create.
     * @returns {Promise<User>} The created auth.
     */
    @Post('register')
    @HttpCode(201)
    async register(@Body(new ValidationPipe()) user: UserDTO): Promise<User> {
        const userFound: User = await this.userService.getUserByEmail(user.email);
        if (userFound) {
            throw new NotFoundException('User already exists');
        }
        return this.userService.register(user);
    }

    /**
     * Login a user.
     * @param user The user to login.
     * @returns {Promise<User>} The logged-in user.
     */
    @Post('login')
    @HttpCode(200)
    async login(@Body(new ValidationPipe()) user: LoginDTO): Promise<User> {
        const userFound = await this.userService.getUserByEmail(user.email);
        if (!userFound) {
            throw new NotFoundException('User not found');
        }
        return await this.userService.login(user, userFound);
    }

    @Post('verify')
    @HttpCode(200)
    async verify(@Body('token', new ValidationPipe()) token: string): Promise<User> {
        return this.userService.verify(token);
    }
}
