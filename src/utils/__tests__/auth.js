import { isValidPassword, hashPassword, comparePassword, jwtSign, jwtVerify, buildUserResponse } from '../auth';
import { buildUser } from '../../../test/utils';

describe('Test auth utilities module', () => {
  test('isValidPassword takes only passwords greater than 5 length', () => {
    expect(isValidPassword('abc')).toBe(false);
    expect(isValidPassword('abc123')).toBe(true);
  });

  // hashPassword

  test('comparePassword validates password against a hashed password', async () => {
    const password = 'abc123';
    const hashed = '$2a$10$4ZoiugORb5z698zjfTg0FOcqD68BR6.ZAEDpYNVQ7YuNbnsSrNKTO';
    const isValid = await comparePassword(password, hashed);
    const isNotValid = await comparePassword(password, hashed.slice(hashed.slice(0, hashed.length - 1)) + 'x');

    expect(isValid).toBe(true);
    expect(isNotValid).not.toBe(true);
  });

  test('jwtSign & jwtDecode sign and decode jwt', async () => {
    const user = buildUser();
    const token = jwtSign(user);
    const decoded = await jwtVerify(token).catch(() => {});

    const { iat, exp, ...decodedUser } = decoded;
    const { getPassword, ...userObject } = user;

    expect(decodedUser).toEqual(userObject);
  });

  test('buildUserResponse builds valid user json with token', () => {
    const user = buildUser();

    expect(buildUserResponse(user)).toEqual({
      user,
      token: expect.any(String),
    });
  });
});
