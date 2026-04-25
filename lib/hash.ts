import crypto from 'crypto';

const SALT = process.env.PASSWORD_SALT || 'vicmart-default-salt';

export function hashPassword(password: string) {
  return crypto
    .pbkdf2Sync(password, SALT, 10000, 64, 'sha512')
    .toString('hex');
}

export function comparePassword(password: string, digest: string) {
  return hashPassword(password) === digest;
}
