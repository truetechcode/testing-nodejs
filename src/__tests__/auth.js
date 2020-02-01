import axios from 'axios';
import Server from '../server';
import { buildRegisterBody, noOp } from '../../test/utils';

let server;
const PORT = 8000;
beforeAll(async () => {
  server = await Server.start({ port: PORT });
});

afterAll(async () => {
  await server.close();
});

class Data {
  constructor(response) {
    this.getMetaData = function() {
      return response;
    };
    return response.data;
  }
}

const callApi = axios.create({
  baseURL: `http://localhost:${PORT}/api`,
});
callApi.interceptors.response.use(response => {
  return new Data(response);
});

describe('Authentication flow', () => {
  test('user can register and login', async () => {
    const registerBody = buildRegisterBody();
    const regResponse = await callApi.post('/auth/register', registerBody).catch(noOp);
    expect(regResponse).toEqual({
      user: {
        id: expect.any(Number),
        created: expect.any(String),
        username: registerBody.username,
        name: registerBody.name,
      },
      token: expect.any(String),
      message: expect.any(String),
    });
  });
});
