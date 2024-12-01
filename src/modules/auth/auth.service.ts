import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { config } from 'src/utils/config';
import { User } from 'src/schemas/user.schema';
import { LoginDTO, UserDTO } from 'src/dto/user.dto';

/**
 * The auth service.
 */
@Injectable()
export class AuthService {
    private readonly SALT_ROUNDS: number = config.BCRYPT_SALT_ROUNDS;
    private readonly JWT_SECRET: string = config.JWT_SECRET;
    private readonly JWT_LIFETIME: number = config.JWT_LIFETIME;

    /**
     * The constructor of the auth service.
     * @param userModel The auth model.
     */
    public constructor(
        @InjectModel(User.name) private userModel: Model<User>,
    ) {}

    /**
     * Create a new auth.
     * @param user The auth to create.
     * @returns {Promise<User>} The created auth.
     */
    public async register(user: UserDTO): Promise<User> {
        const hashedPassword = await bcrypt.hash(
            user.password,
            this.SALT_ROUNDS,
        );
        const newUser = new this.userModel({
            ...user,
            password: hashedPassword,
        });
        const userSaved: User = await newUser.save();
        const token = jwt.sign({ email: userSaved.email }, this.JWT_SECRET, {
            expiresIn: this.JWT_LIFETIME,
        });
        const { password, ...userWithoutPassword } = userSaved.toObject();
        return { ...userWithoutPassword, token };
    }

    /**
     * Login a user.
     * @param user The user to login.
     * @param userFound The user found by email.
     * @returns {Promise<User>} The logged-in user.
     */
    public async login(user: LoginDTO, userFound: User): Promise<User> {
        const isPasswordValid = await bcrypt.compare(
            user.password,
            userFound.password,
        );
        if (!isPasswordValid) {
            throw new UnauthorizedException('Email or password is incorrect');
        }
        const token = jwt.sign({ email: userFound.email }, this.JWT_SECRET, {
            expiresIn: this.JWT_LIFETIME,
        });
        const { password, ...userWithoutPassword } = userFound.toObject();
        return { ...userWithoutPassword, token };
    }

    /**
     * Verify a token.
     * @param token The token to verify.
     * @returns {Promise<User>} The user.
     */
    public async verify(token: string): Promise<User> {
        console.log(token);
        try {
            const decoded = jwt.verify(token, this.JWT_SECRET);
            const user = await this.getUserByEmail(decoded.email);
            const { password, ...userWithoutPassword } = user.toObject();
            return userWithoutPassword;
        } catch (error: any) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    /**
     * Get a user by its email.
     * @param email The email of the user.
     * @returns {Promise<User>} The user.
     */
    public async getUserByEmail(email: string): Promise<User> {
        return await this.userModel
            .findOne({ email })
            .select('+password')
            .exec();
    }
}
