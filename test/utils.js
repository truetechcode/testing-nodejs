import faker from 'faker';
import { User } from '../src/db/users';

export function noOp(e) {
  return e;
}

export function buildUser(overrides = {}) {
  return new User({
    username: faker.name.firstName(),
    name: faker.name.findName(),
    ...overrides,
  });
}

export function buildRegisterBody(overrides = {}) {
  return {
    username: faker.name.firstName(),
    password: faker.internet.password(),
    name: faker.name.findName(),
    ...overrides,
  };
}

export function buildRequest(overrides = {}) {
  return {
    params: {},
    query: {},
    body: {},
    user: buildUser(),
    headers: {},
    ...overrides,
  };
}

export function buildResponse(overrides = {}) {
  return {
    json: jest.fn(() => this).mockName('json'),
    status: jest.fn(() => this).mockName('status'),
    ...overrides,
  };
}

export function buildNext(fn) {
  return jest.fn(fn).mockName('next');
}
