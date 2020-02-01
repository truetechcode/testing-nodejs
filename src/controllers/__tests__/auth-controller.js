import AuthController from '../auth-controller';
import DB from '../../db';
import { noOp, buildRequest, buildResponse, buildRegisterBody, buildUser, buildNext } from '../../../test/utils';
import { BadRequestError, UnauthorizedError } from '../../utils/errors';
import { isValidPassword, jwtSign, jwtVerify } from '../../utils/auth';

jest.mock('../../utils/auth');
jest.mock('../../db');

afterEach(() => {
  jest.clearAllMocks();
});

async function setupAndFireController({ body = {}, user = {}, headers = {}, controller }) {
  const req = buildRequest({ user, body, headers });
  const res = buildResponse();
  const next = buildNext();

  const result = await controller(req, res, next).catch(noOp);

  return { req, res, next, result };
}

describe('AuthController.register', () => {
  test('empty username', async () => {
    const { result } = await setupAndFireController({
      controller: AuthController.register,
      user: null,
      body: { username: '' },
    });

    expect(result).toBeInstanceOf(BadRequestError);
    expect(result).toMatchInlineSnapshot(`[Error: Bad Request: Please provide a username]`);
  });

  test('empty password', async () => {
    const { result } = await setupAndFireController({
      controller: AuthController.register,
      user: null,
      body: { ...buildRegisterBody(), password: '' },
    });

    expect(result).toBeInstanceOf(BadRequestError);
    expect(result).toMatchInlineSnapshot(`[Error: Bad Request: Please provide a password]`);
  });

  test('invalid password length', async () => {
    isValidPassword.mockReturnValue(false);

    const { result } = await setupAndFireController({
      controller: AuthController.register,
      user: null,
      body: { ...buildRegisterBody(), password: 'abc' },
    });

    expect(isValidPassword).toHaveBeenCalledTimes(1);
    expect(result).toBeInstanceOf(BadRequestError);
    expect(result).toMatchInlineSnapshot(`[Error: Bad Request: Password is too short]`);
  });

  test('user exists', async () => {
    const body = buildRegisterBody();

    isValidPassword.mockReturnValue(true);
    DB.users.findByUserName.mockResolvedValueOnce({ ...buildUser(), ...body });

    const { result } = await setupAndFireController({
      controller: AuthController.register,
      user: null,
      body,
    });

    expect(isValidPassword).toHaveBeenCalledTimes(1);
    expect(result).toBeInstanceOf(BadRequestError);
    expect(result).toMatchInlineSnapshot(`[Error: Bad Request: Username already exists! Try Login?]`);
  });

  test('user is created successfully!', async () => {
    const body = buildRegisterBody();
    const user = buildUser();

    isValidPassword.mockReturnValue(true);
    DB.users.findByUserName.mockResolvedValueOnce(null);
    DB.users.create.mockResolvedValueOnce(user);

    const { res } = await setupAndFireController({
      controller: AuthController.register,
      user,
      body,
    });

    expect(isValidPassword).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});

describe('AuthController.verifyAuthentication Middleware', () => {
  test('no auth token', async () => {
    const { result } = await setupAndFireController({
      controller: AuthController.verifyAuthentication,
    });

    expect(result).toBeInstanceOf(UnauthorizedError);
    expect(result).toMatchInlineSnapshot(`[Error: No Authorization Token Provided]`);
  });

  test('invalid auth token', async () => {
    jwtVerify.mockResolvedValue(null);
    const { result } = await setupAndFireController({
      controller: AuthController.verifyAuthentication,
      headers: { Authorization: 'INVALID_AUTH' },
    });

    expect(result).toBeInstanceOf(UnauthorizedError);
    expect(result).toMatchInlineSnapshot(`[Error: Invalid Authorization Token]`);
  });

  test('middleware calls next on valid auth', async () => {
    const user = buildUser();
    jwtVerify.mockResolvedValue(user);

    const { next, req } = await setupAndFireController({
      controller: AuthController.verifyAuthentication,
      headers: { Authorization: 'VALID_AUTH_HEADER' },
    });

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user).toBe(user);
  });
});
