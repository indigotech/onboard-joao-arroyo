import { expect } from 'chai';
import { User } from '../entity/User';
import { loginRequest } from './helper';
import { appDataSource } from '../data-source';
import { CustomError } from '../custom-error';
import { hashPassword } from '../utils';
import { generateToken } from '../token-generator';
import { verify } from 'jsonwebtoken';

async function createUser(user: { name: string; password: string; birthDate: string; email: string }) {
  const userRepository = appDataSource.getRepository(User);
  user.password = await hashPassword(user.password);
  return userRepository.save(user);
}

describe('Login Mutation', () => {
  afterEach(async () => {
    await appDataSource.getRepository(User).clear();
  });

  it('should not complete login due to email not found', async () => {
    const user = {
      birthDate: '09/11/2022',
      email: 'test@fake.com',
      name: 'test user',
      password: 'c0rr3ctp4ass',
    };
    await createUser(user);

    const loginParams = { email: 'wrong@fake.com', password: 'v4l1dp4ss' };
    const response = await loginRequest({ input: loginParams });
    const customError: CustomError = response?.data?.errors[0];

    expect(customError).to.deep.eq({
      message: 'Invalid email.',
      code: 404,
      additionalInfo: 'No user was found with the corresponding email.',
    });
  });

  it('should not complete login due to incorrect password', async () => {
    const user = {
      birthDate: '09/11/2022',
      email: 'test@fake.com',
      name: 'test user',
      password: 'c0rr3ctp4ass',
    };
    await createUser(user);

    const loginParams = { email: 'test@fake.com', password: '1nc0rrectp4ass' };
    const response = await loginRequest({ input: loginParams });
    const customError = response?.data?.errors[0];

    expect(customError).to.deep.eq({
      message: 'Invalid password.',
      code: 401,
      additionalInfo: 'Incorrect password for the given email.',
    });
  });

  it('should not complete login due to an invalid email.', async () => {
    const user = {
      birthDate: '09/11/2022',
      email: 'test@fake.com',
      name: 'test user',
      password: 'c0rr3ctp4ass',
    };
    await createUser(user);

    const loginParams = { email: 'testfake.com', password: '1nc0rrectp4ass' };
    const response = await loginRequest({ input: loginParams });
    const customError = response?.data?.errors[0];

    expect(customError).to.deep.eq({
      message: 'Invalid email.',
      code: 400,
      additionalInfo: 'The provided email does not correspond to a valid email.',
    });
  });

  it('should complete login', async () => {
    const user = {
      birthDate: '09/11/2022',
      email: 'test@fake.com',
      name: 'test user',
      password: 'c0rr3ctp4ass',
    };
    const createdUser = await createUser(user);

    const loginParams = { email: 'test@fake.com', password: 'c0rr3ctp4ass' };
    const response = await loginRequest({ input: loginParams });
    const loginResponse = response?.data?.data?.login;
    const checkToken = generateToken(process.env.JWT_KEY || '', { id: createdUser.id.toString() }, false);

    expect(loginResponse).to.deep.eq({
      token: checkToken,
      user: {
        id: createdUser.id.toString(),
        email: createdUser.email,
        birthDate: createdUser.birthDate,
        name: createdUser.name,
      },
    });
  });

  it('should complete login with remember me', async () => {
    const user = {
      birthDate: '09/11/2022',
      email: 'test@fake.com',
      name: 'test user',
      password: 'c0rr3ctp4ass',
    };
    const createdUser = await createUser(user);

    const loginParams = { email: 'test@fake.com', password: 'c0rr3ctp4ass', rememberMe: true };

    const response = await loginRequest({ input: loginParams });

    const loginResponse = response?.data?.data?.login;

    const checkToken = generateToken(process.env.JWT_KEY || '', { id: createdUser.id.toString() }, true);

    expect(loginResponse).to.deep.eq({
      token: checkToken,
      user: {
        id: createdUser.id.toString(),
        email: createdUser.email,
        birthDate: createdUser.birthDate,
        name: createdUser.name,
      },
    });

    const token: string = loginResponse.token;
    const key: string = process.env.JWT_KEY || ' ';

    const decodedToken = verify(token, key) as { email: string; iat: number; id: string; exp: number };
    const expirationInDays = (decodedToken.exp - decodedToken.iat) / (60 * 60 * 24);
    expect(expirationInDays).to.equal(7);
  });
});
