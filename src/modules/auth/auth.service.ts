import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { config } from 'src/utils/config';
import { Admin } from 'src/schemas/admin.schema';
import { RegisteAdminDTO } from 'src/dto/RegisteAdminDTO';
import { LoginDTO } from 'src/dto/LoginDTO';
import { QuestionAnswer } from 'src/schemas/questionAnswer.schema';
import { Company } from 'src/schemas/company.schema';

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
        @InjectModel(Admin.name) private userModel: Model<Admin>,
        @InjectModel(Company.name) private companyModel: Model<Company>,
    ) {}

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

    public async getAnswerFormUser(email: string): Promise<QuestionAnswer[]> {
        const company: Company = await this.companyModel.findOne({ email: email }).exec();
        if (!company) {
            throw new Error('Company not found');
        }
        return company.questions;
    }

    public async postAnswerFormUser(email: string, answers: QuestionAnswer[]): Promise<void> {
        const company: Company = await this.companyModel.findOne({ email: email }).exec();
        if (!company) {
            throw new Error('Company not found');
        }
        company.questions = answers;
        await this.companyModel.replaceOne({ email: email }, company).exec();
    }

    /**
     * Update the password of a user.
     * @param email The email of the user.
     * @param password The new password.
     * @returns {Promise<boolean>} True if the password is updated, false otherwise.
     */
    public async updatePasswordAdmin(email: string, password: string): Promise<boolean> {
        const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);
        const admin = await this.userModel.findOne({ email }).exec();
        if (!admin) {
            throw new Error('admin not found');
        }
        admin.password = hashedPassword;
        admin.isPasswordUpdated = true;
        await admin.save();
        return true;
    }

    public async validatedFormUser(email: string) : Promise<boolean> {
        const company: Company = await this.companyModel.findOne({ email: email }).exec();
        for(const question of company.questions ){
            if(!question.validatedQuestion){
                return false;
            }
        }
        return true;
    }
}
