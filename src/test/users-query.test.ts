import { expect } from 'chai';
import { User } from '../entity/User';
import { appDataSource } from '../data-source';
import { CustomError } from '../custom-error';
import { usersQueryRequest } from './helper';
import { generateToken } from '../token-generator';
import { seedDatabase } from '../seed/seeds';
import { MAX_USERS } from '../constants.json';

describe('Users query', () => {
  afterEach(async () => {
    await appDataSource.getRepository(User).clear();
  });

  it('should not fetch users due to invalid token', async () => {
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
    const response = await usersQueryRequest({ input: { maxUsers: 1 } }, invalidToken);
    const customError: CustomError = response?.data?.errors[0];

    expect(customError).to.deep.eq({
      message: 'Access denied.',
      code: 401,
      additionalInfo: 'Authentication required.',
    });
  });

  it('should not fetch user due to invalid number of users.', async () => {
    const userRepository = appDataSource.getRepository(User);

    const user = {
      birthDate: '09/11/2022',
      email: 'test@fake.com',
      name: 'test user',
      password: 'c0rr3ctp4ass',
    };

    const savedUser: User = await userRepository.save(user);
    const token = generateToken(process.env.JWT_KEY ?? '', { id: savedUser.id.toString() }, false);

    const response = await usersQueryRequest({ input: { maxUsers: -1 } }, token);
    const customError: CustomError = response?.data?.errors[0];

    expect(customError).to.deep.eq({
      message: 'The number of users is invalid.',
      code: 400,
      additionalInfo: 'The number of required users should be a positive integer.',
    });
  });

  it('should fetch one user.', async () => {
    const userRepository = appDataSource.getRepository(User);

    const user = {
      birthDate: '09/11/2022',
      email: 'test@fake.com',
      name: 'test user',
      password: 'c0rr3ctp4ass',
    };
    const savedUser: User = await userRepository.save(user);
    const userId: string = savedUser.id.toString();

    const token = generateToken(process.env.JWT_KEY ?? '', { id: userId }, false);
    const response = await usersQueryRequest({ input: { maxUsers: 1 } }, token);
    const fetchedUsers: User[] = response?.data?.data?.users;

    expect(fetchedUsers.length).to.eq(1);
    expect(fetchedUsers[0]).to.deep.eq({
      id: savedUser.id.toString(),
      name: savedUser.name,
      birthDate: savedUser.birthDate,
      email: savedUser.email,
    });
  });

  it('should fetch ten users.', async () => {
    const userRepository = appDataSource.getRepository(User);
    await seedDatabase(12);

    const maxUsers = 10;
    const token = generateToken(process.env.JWT_KEY ?? '', { id: '1' }, false);
    const response = await usersQueryRequest({ input: { maxUsers: maxUsers } }, token);
    const fetchedUsers = response?.data?.data?.users;
    const checkUsers: User[] = await userRepository.find({
      order: {
        name: 'ASC',
      },
      take: maxUsers,
    });
    const processedCheckUsers = checkUsers.map((user) => {
      return {
        birthDate: user.birthDate,
        email: user.email,
        id: user.id.toString(),
        name: user.name,
      };
    });

    expect(fetchedUsers.length).to.eq(10);
    expect(fetchedUsers).to.deep.eq(processedCheckUsers);
  });

  it('should fetch the default number of users.', async () => {
    const userRepository = appDataSource.getRepository(User);
    await seedDatabase(17);

    const token = generateToken(process.env.JWT_KEY ?? '', { id: '1' }, false);
    const response = await usersQueryRequest({}, token);
    const fetchedUsers = response?.data?.data?.users;
    const checkUsers: User[] = await userRepository.find({
      order: {
        name: 'ASC',
      },
      take: MAX_USERS,
    });
    const processedCheckUsers = checkUsers.map((user) => {
      return {
        birthDate: user.birthDate,
        email: user.email,
        id: user.id.toString(),
        name: user.name,
      };
    });

    expect(fetchedUsers).to.deep.eq(processedCheckUsers);
  });
});
