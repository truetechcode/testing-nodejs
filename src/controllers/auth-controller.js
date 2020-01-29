import DB from '../db';

import { isValidPassword, hashPassword, buildUserResponse, comparePassword, jwtVerify } from '../utils/auth';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../utils/errors';

export default {
  async register(req, res) {
    const { username, password, name } = req.body;
    if (!username) throw new BadRequestError('Please provide a username');
    if (!password) throw new BadRequestError('Please provide a password');
    if (!isValidPassword(password)) throw new BadRequestError('Password is too short');

    const existingUser = await DB.users.findByUserName(username);
    if (existingUser) throw new BadRequestError(`Username already exists! Try Login?`);

    const user = await DB.users.create({
      username,
      name,
      password: await hashPassword(password),
    });

    return res.json({ ...buildUserResponse(user), message: 'Regitered Succesfully!' });
  },

  async login(req, res) {
    const { username, password } = req.body;
    if (!username) throw new BadRequestError('Please enter a username');
    if (!password) throw new BadRequestError('Please enter a pasword');

    const user = await DB.users.findByUserName(username);
    if (!user) throw new NotFoundError('User not found!');

    const isCorrectPassword = await comparePassword(password, user.getPassword());
    if (!isCorrectPassword) {
      throw new UnauthorizedError('Incorrect Password!');
    }

    return res.json({ ...buildUserResponse(user), message: 'Login Successful!' });
  },

  async getMe(req, res, next) {
    const { id } = req.user;
    const user = await DB.users.findById(id);
    return res.json(buildUserResponse(user));
  },

  // Middleware
  async verifyAuthentication(req, res, next) {
    const token = (req.headers['Authorization'] || req.headers['authorization'] || '').replace(/bearer\s+/i, '');
    if (!token) throw new UnauthorizedError('No Authorization Token Provided');
    const decodedUser = await jwtVerify(token).catch(() => null);
    if (!decodedUser) throw new UnauthorizedError('Invalid Authorization Token');
    req.user = decodedUser;
    // const user = await DB.users.findById(decodedUser.id);
    // if (!user) throw new UnauthorizedError('Token has been revoked. Please login');
    // req.user = user;
    return next();
  },
};
