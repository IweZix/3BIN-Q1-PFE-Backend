import * as dotenv from 'dotenv';

dotenv.config();

const {
    BCRYPT_SALT_ROUNDS,

    JWT_SECRET,
    JWT_LIFETIME,

    MONGO_USER,
    MONGO_PASSWORD,
    MONGO_HOST
} = process.env;

if (
    !BCRYPT_SALT_ROUNDS ||
    !JWT_SECRET ||
    !JWT_LIFETIME ||
    !MONGO_USER ||
    !MONGO_PASSWORD ||
    !MONGO_HOST
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
};
