import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { config } from 'src/utils/config';
import { Admin } from 'src/schemas/admin.schema';
import { RegisteAdminDTO } from 'src/dto/RegisteAdminDTO';
import { LoginDTO } from 'src/dto/LoginDTO';

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
    public constructor(@InjectModel(Admin.name) private userModel: Model<Admin>) {}

    /**
     * Create a new admin.
     * @param user The auth to create.
     * @returns {Promise<Admin>} The created auth.
     */
    public async register(user: RegisteAdminDTO): Promise<Admin> {
        const hashedPassword = await bcrypt.hash(user.password, this.SALT_ROUNDS);
        const newUser = new this.userModel({
            ...user,
            password: hashedPassword,
            isPasswordUpdated: false,
        });
        const userSaved: Admin = await newUser.save();
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
     * @returns {Promise<Admin>} The logged-in user.
     */
    public async login(user: LoginDTO, userFound: Admin): Promise<Admin> {
        const isPasswordValid = await bcrypt.compare(user.password, userFound.password);
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
     * @returns {Promise<Admin>} The user.
     */
    public async verify(token: string): Promise<Admin> {
        try {
            const decoded = jwt.verify(token, this.JWT_SECRET);
            const user = await this.getAdminByEmail(decoded.email);
            const { password, ...userWithoutPassword } = user.toObject();
            return userWithoutPassword;
        } catch (error: any) {
            throw new UnauthorizedException('Invalid token', error.message);
        }
    }

    /**
     * Get a user by its email.
     * @param email The email of the user.
     * @returns {Promise<Admin>} The user.
     */
    public async getAdminByEmail(email: string): Promise<Admin> {
        return await this.userModel.findOne({ email }).select('+password').exec();
    }

    /**
     * Verify if the password is updated.
     * @param user The user.
     * @returns {Promise<boolean>} True if the password is updated, false otherwise.
     */
    public async verifyPasswordUpdated(user: Admin): Promise<boolean> {
        return user.isPasswordUpdated;
    }
}
