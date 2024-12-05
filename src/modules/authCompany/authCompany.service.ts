import { Injectable, UnauthorizedException } from '@nestjs/common';
import { config } from '../../utils/config';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Company } from '../../schemas/company.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterCompanyDTO } from '../../dto/RegisterCompanyDTO';
import { LoginDTO } from '../../dto/LoginDTO';
import { QuestionService } from '../question/question.service';
import { QuestionAnswer } from '../../schemas/questionAnswer.schema';
import { Answer } from '../../schemas/answer.schema';

@Injectable()
export class AuthCompanyService {
    private readonly SALT_ROUNDS: number = config.BCRYPT_SALT_ROUNDS;
    private readonly JWT_SECRET: string = config.JWT_SECRET;
    private readonly JWT_LIFETIME: number = config.JWT_LIFETIME;

    public constructor(
        @InjectModel(Company.name) private companyModel: Model<Company>,
        private readonly questionService: QuestionService,
    ) {}

    /**
     * Register a company
     * @param company
     */
    public async register(company: RegisterCompanyDTO): Promise<Company> {
        company.template.push(0);
        const hashedPassword = await bcrypt.hash(company.password, this.SALT_ROUNDS);
        const newCompany = new this.companyModel({
            ...company,
            password: hashedPassword,
            questions: await this.arrangeTemplate(company),
            naQuestions: await this.inverseArrangeTemplate(company),
            isPasswordUpdated: false,
        });
        const companySaved: Company = await newCompany.save();
        const token = jwt.sign({ email: companySaved.email }, this.JWT_SECRET, {
            expiresIn: this.JWT_LIFETIME,
        });
        const { password, ...companyWithoutPassword } = companySaved.toObject();
        return { ...companyWithoutPassword, token };
    }

    public async login(company: LoginDTO, companyFound: Company): Promise<Company> {
        const isPasswordValid = await bcrypt.compare(company.password, companyFound.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }
        const token = jwt.sign({ email: companyFound.email }, this.JWT_SECRET, {
            expiresIn: this.JWT_LIFETIME,
        });
        const { password, ...companyWithoutPassword } = companyFound.toObject();
        return { ...companyWithoutPassword, token };
    }

    public async verify(token: string): Promise<Company> {
        try {
            const decoded = jwt.verify(token, this.JWT_SECRET);
            const company = await this.getCompanyByEmail(decoded.email);
            const { password, ...companyWithoutPassword } = company.toObject();
            return companyWithoutPassword;
        } catch (error) {
            throw new UnauthorizedException('Invalid token', error);
        }
    }

    public async getCompanyByEmail(email: string): Promise<Company> {
        return await this.companyModel.findOne({ email }).select('+password').exec();
    }

    /**
     * Get a user email by a token
     * @param token The token to get the userId from.
     * @returns {Promise<string>} The userId.
     */
    public async getUserByToken(token: string): Promise<string> {
        const decoded = jwt.verify(token, this.JWT_SECRET);
        return decoded.email;
    }

    public async answerForm(answerForm: QuestionAnswer[], email: string): Promise<void> {
        let company: Company = await this.companyModel.findOne({ email: email }).exec();
        if (!company) {
            throw new Error('Company not found');
        }
        company.questions = answerForm;
        console.log(answerForm);
        await this.companyModel.replaceOne({ email: email }, company).exec();
    }

    /**
     * Verify if the password is updated.
     * @param company The company.
     * @returns {Promise<boolean>} True if the password is updated, false otherwise.
     */
    public async verifyPasswordUpdated(company: Company): Promise<boolean> {
        return company.isPasswordUpdated;
    }

    /**
     * Get all questions that the company has
     * @param {RegisterCompanyDTO} company The company
     * @return {Promise<QuestionAnswer[]>} The questions that the company has
     */
    private async arrangeTemplate(company: RegisterCompanyDTO): Promise<QuestionAnswer[]> {
        let allQuestions: QuestionAnswer[] = await this.questionService.getAllQuestions();
        const allTemplateQuestions = company.template;
        for (const answerQuestion of allQuestions) {
            for (const question of answerQuestion.questionsList) {
                for (const answer of question.responsesList) {
                    if (!allTemplateQuestions.includes(Number(answer.template))) {
                        question.responsesList = question.responsesList.filter(
                            (response: Answer): Boolean => response.template !== answer.template,
                        );
                    }
                }
                question.responsesList = question.responsesList.filter(
                    (response: Answer): Boolean => response.txt_answer !== 'N/A',
                );
            }
            answerQuestion.questionsList = answerQuestion.questionsList.filter(
                question => question.responsesList.length > 0,
            );
        }

        allQuestions = allQuestions.filter(questionAnswer => questionAnswer.questionsList.length > 0);

        return allQuestions;
    }

    /**
     * find all questions that are the company does not have
     * @param {RegisterCompanyDTO} company The company
     * @return {Promise<QuestionAnswer[]>} The questions that the company does not have
     */
    private async inverseArrangeTemplate(company: RegisterCompanyDTO): Promise<QuestionAnswer[]> {
        let allNAQuestions: QuestionAnswer[] = await this.questionService.getAllQuestions();
        const allTemplateQuestions = company.template;
        for (const answerQuestion of allNAQuestions) {
            for (const question of answerQuestion.questionsList) {
                for (const answer of question.responsesList) {
                    if (allTemplateQuestions.includes(Number(answer.template))) {
                        question.responsesList = question.responsesList.filter(
                            (response: Answer): Boolean => response.template !== answer.template,
                        );
                    }
                }
                question.responsesList = question.responsesList.filter(
                    (response: Answer): Boolean => {
                        if (response.txt_answer === 'N/A') {
                            response.isNow = true;
                            return true;
                        }
                        return false;
                    },
                );
            }
            answerQuestion.questionsList = answerQuestion.questionsList.filter(
                question => question.responsesList.length > 0,
            );
        }

        allNAQuestions = allNAQuestions.filter(questionAnswer => questionAnswer.questionsList.length > 0);

        return allNAQuestions;
    }
}
