import * as dotenv from 'dotenv';

dotenv.config();

const {
    BCRYPT_SALT_ROUNDS,

    JWT_SECRET,
    JWT_LIFETIME,

    MONGO_USER,
    MONGO_PASSWORD,
    MONGO_HOST,

    MONGO_USER_PROD,
    MONGO_PASSWORD_PROD,
    MONGO_HOST_PROD,
} = process.env;

if (
    !BCRYPT_SALT_ROUNDS ||
    !JWT_SECRET ||
    !JWT_LIFETIME ||
    !MONGO_USER ||
    !MONGO_PASSWORD ||
    !MONGO_HOST ||
    !MONGO_USER_PROD ||
    !MONGO_PASSWORD_PROD ||
    !MONGO_HOST_PROD
) {
    throw new Error('Some environment variables are missing');
}

export const config = {
    BCRYPT_SALT_ROUNDS: parseInt(BCRYPT_SALT_ROUNDS),
    JWT_SECRET,
    JWT_LIFETIME: parseInt(JWT_LIFETIME),
    MONGO_USER,
    MONGO_PASSWORD,
    MONGO_HOST,
    MONGO_USER_PROD,
    MONGO_PASSWORD_PROD,
    MONGO_HOST_PROD,
};
