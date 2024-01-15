import { expect } from 'chai';
import { User } from '../entity/User';
import { appDataSource } from '../data-source';
import { CustomError } from '../custom-error';
import { userQueryRequest } from './helper';
import { generateToken } from '../token-generator';

describe('User query', () => {
  afterEach(async () => {
    await appDataSource.getRepository(User).clear();
  });

  it('should not fetch user due to invalid token', async () => {
    const userRepository = appDataSource.getRepository(User);

    const user = {
      birthDate: '09/11/2022',
      email: 'test@fake.com',
      name: 'test user',
      password: 'c0rr3ctp4ass',
    };

    const savedUser: User = await userRepository.save(user);
    const userId: string = savedUser.id.toString();
    const invalidToken = generateToken('wrongKey', { id: userId }, false);

    const response = await userQueryRequest({ input: { id: userId } }, invalidToken);

    expect(response).to.exist;

    const customError: CustomError = response?.data?.errors[0];

    expect(customError).to.deep.eq({
      message: 'Access denied.',
      code: 401,
      additionalInfo: 'Authentication required.',
    });
  });
  it('should not fetch user due to invalid id.', async () => {
    const userRepository = appDataSource.getRepository(User);

    const user = {
      birthDate: '09/11/2022',
      email: 'test@fake.com',
      name: 'test user',
      password: 'c0rr3ctp4ass',
    };

    const savedUser: User = await userRepository.save(user);
    const wrongId: string = (savedUser.id + 1).toString();
    const token = generateToken(process.env.JWT_KEY || '', { id: savedUser.id.toString() }, false);

    const response = await userQueryRequest({ input: { id: wrongId } }, token);

    expect(response).to.exist;

    const customError: CustomError = response?.data?.errors[0];

    expect(customError).to.deep.eq({
      message: 'User Not Found',
      code: 404,
      additionalInfo: 'No user found with the provided ID.',
    });
  });

  it('should fetch the requested user.', async () => {
    const userRepository = appDataSource.getRepository(User);

    const user = {
      birthDate: '09/11/2022',
      email: 'test@fake.com',
      name: 'test user',
      password: 'c0rr3ctp4ass',
    };

    const savedUser: User = await userRepository.save(user);
    const userId: string = savedUser.id.toString();
    const token = generateToken(process.env.JWT_KEY || '', { id: userId }, false);
    const response = await userQueryRequest({ input: { id: userId } }, token);

    expect(response).to.exist;

    const fetchedUser = response?.data?.data?.user;

    expect(fetchedUser).to.deep.eq({
      id: savedUser.id.toString(),
      name: savedUser.name,
      birthDate: savedUser.birthDate,
      email: savedUser.email,
    });
  });
});
