import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'k2hf504mcxw78kdfy439dhgcfew6';

export function isValidPassword(password) {
  return password.length > 6;
}

export async function hashPassword(password = '') {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password = '', hash = '') {
  return await bcrypt.compare(password, hash); // => (Boolean)
}

export function jwtSign(data = {}) {
  return jwt.sign(data, JWT_SECRET, {
    expiresIn: '1 hour',
  });
}

export function jwtVerify(token = '') {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) return reject(err);
      return resolve(decoded);
    });
  });
}

export function buildUserResponse(userData) {
  return { user: userData, token: jwtSign({ ...userData }) };
}
