import { expect } from 'chai';
import { User } from '../entity/User';
import { loginRequest, createUserRequest } from './helper';
import { appDataSource } from '../data-source';
import { CustomError } from '../custom-error';

describe('Login Mutation', () => {
  afterEach(async () => {
    await appDataSource.getRepository(User).clear();
  });

  it('should return mocked data in the specified format', async () => {
    const user = {
      birthDate: '09/11/2022',
      email: 'test@fake.com',
      name: 'test user',
      password: 'c0rr3ctp4ass',
    };
    let response = await createUserRequest({ input: user });
    const createdUser: User = response.data?.data?.createUser;
    expect(createdUser.birthDate).to.equal(user.birthDate);
    expect(createdUser.email).to.equal(user.email);
    expect(createdUser.name).to.equal(user.name);
    expect(createdUser.id).to.match(/^\d+$/);

    let loginParams = { email: 'wrong@fake.com', password: 'v4l1dp4ss' };

    response = await loginRequest({ input: loginParams });

    expect(response).to.exist;

    let customError: CustomError = response?.data?.errors[0];

    expect(customError.message).to.equal('Invalid email.');
    expect(customError.code).to.equal(422);
    expect(customError.additionalInfo).to.equal('No user was found with the corresponding email.');

    loginParams = { email: 'test@fake.com', password: '1nc0rrectp4ass' };

    response = await loginRequest({ input: loginParams });

    customError = response?.data?.errors[0];

    expect(customError.message).to.equal('Invalid password.');
    expect(customError.code).to.equal(422);
    expect(customError.additionalInfo).to.equal('Incorrect password for the given email.');

    loginParams = { email: 'test@fake.com', password: 'c0rr3ctp4ass' };

    response = await loginRequest({ input: loginParams });

    const loginResponse = response?.data?.data?.login;

    expect(loginResponse.token).to.be.a('string');
    expect(loginResponse.user.id).to.match(/^\d+$/);
    expect(loginResponse.user.email).to.equal(user.email);
    expect(loginResponse.user.birthDate).to.equal(user.birthDate);
    expect(loginResponse.user.name).to.be.equal(user.name);
  });
});
