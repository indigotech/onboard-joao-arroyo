import { expect } from 'chai';
import { User } from '../entity/User';
import { appDataSource } from '../data-source';
import { CustomError } from '../custom-error';
import { usersQueryRequest } from './helper';
import { generateToken } from '../token-generator';
import { seedDatabase } from '../seed/seeds';
import { MAX_USERS } from '../constants.json';
import { QueryUsersResponse } from '../interfaces';
import { Address } from '../entity/Address';

describe('Users query', () => {
  afterEach(async () => {
    await appDataSource.createQueryBuilder().delete().from(Address).execute();
    await appDataSource.createQueryBuilder().delete().from(User).execute();
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

  it('should not fetch user due to invalid number of skipped users.', async () => {
    const userRepository = appDataSource.getRepository(User);

    const user = {
      birthDate: '09/11/2022',
      email: 'test@fake.com',
      name: 'test user',
      password: 'c0rr3ctp4ass',
    };

    const savedUser: User = await userRepository.save(user);
    const token = generateToken(process.env.JWT_KEY ?? '', { id: savedUser.id.toString() }, false);

    const response = await usersQueryRequest({ input: { skippedUsers: -1 } }, token);
    const customError: CustomError = response?.data?.errors[0];

    expect(customError).to.deep.eq({
      message: 'The number of skipped users is invalid.',
      code: 400,
      additionalInfo: 'The number of skipped users should not be negative.',
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
    const unwrappedResponse: QueryUsersResponse = response?.data?.data?.users;

    expect(unwrappedResponse.users.length).to.eq(1);
    expect(unwrappedResponse).to.deep.eq({
      isLast: true,
      isFirst: true,
      userCount: 1,
      users: [
        {
          id: savedUser.id.toString(),
          name: savedUser.name,
          birthDate: savedUser.birthDate,
          email: savedUser.email,
          addresses: [],
        },
      ],
    });
  });

  it('should fetch ten users.', async () => {
    const userRepository = appDataSource.getRepository(User);
    await seedDatabase(12);

    const maxUsers = 10;
    const token = generateToken(process.env.JWT_KEY ?? '', { id: '1' }, false);
    const response = await usersQueryRequest({ input: { maxUsers: maxUsers } }, token);
    const unwrappedResponse = response?.data?.data?.users;
    const checkUsers: User[] = await userRepository.find({
      order: {
        name: 'ASC',
      },
      take: maxUsers,
      relations: ['addresses'],
    });
    const processedCheckUsers = checkUsers.map((user) => {
      return {
        birthDate: user.birthDate,
        email: user.email,
        id: user.id.toString(),
        name: user.name,
        addresses: user.addresses,
      };
    });

    expect(unwrappedResponse).to.deep.eq({
      isLast: false,
      isFirst: true,
      userCount: 12,
      users: processedCheckUsers,
    });
  });

  it('should fetch the default number of users.', async () => {
    const userRepository = appDataSource.getRepository(User);
    await seedDatabase(17);

    const token = generateToken(process.env.JWT_KEY ?? '', { id: '1' }, false);
    const response = await usersQueryRequest({}, token);
    const unwrappedResponse = response?.data?.data?.users;
    const checkUsers: User[] = await userRepository.find({
      order: {
        name: 'ASC',
      },
      take: MAX_USERS,
      relations: ['addresses'],
    });
    const processedCheckUsers = checkUsers.map((user) => {
      return {
        birthDate: user.birthDate,
        email: user.email,
        id: user.id.toString(),
        name: user.name,
        addresses: user.addresses,
      };
    });

    expect(unwrappedResponse).to.deep.eq({
      isFirst: true,
      isLast: false,
      userCount: 17,
      users: processedCheckUsers,
    });
  });

  it('should fetch the default number of users skipping 3.', async () => {
    const userRepository = appDataSource.getRepository(User);
    await seedDatabase(18);

    const token = generateToken(process.env.JWT_KEY ?? '', { id: '1' }, false);
    const response = await usersQueryRequest({ input: { skippedUsers: 3 } }, token);
    const unwrappedResponse = response?.data?.data?.users;
    const checkUsers: User[] = await userRepository.find({
      order: {
        name: 'ASC',
      },
      skip: 3,
      take: MAX_USERS,
      relations: ['addresses'],
    });
    const processedCheckUsers = checkUsers.map((user) => {
      return {
        birthDate: user.birthDate,
        email: user.email,
        id: user.id.toString(),
        name: user.name,
        addresses: user.addresses,
      };
    });

    expect(unwrappedResponse).to.deep.eq({
      isFirst: false,
      isLast: true,
      userCount: 18,
      users: processedCheckUsers,
    });
  });

  it('should fetch 10 users skipping 2.', async () => {
    const userRepository = appDataSource.getRepository(User);
    await seedDatabase(14);

    const token = generateToken(process.env.JWT_KEY ?? '', { id: '1' }, false);
    const response = await usersQueryRequest({ input: { skippedUsers: 2, maxUsers: 10 } }, token);
    const unwrappedResponse = response?.data?.data?.users;
    const checkUsers: User[] = await userRepository.find({
      order: {
        name: 'ASC',
      },
      skip: 2,
      take: 10,
      relations: ['addresses'],
    });
    const processedCheckUsers = checkUsers.map((user) => {
      return {
        birthDate: user.birthDate,
        email: user.email,
        id: user.id.toString(),
        name: user.name,
        addresses: user.addresses,
      };
    });

    expect(unwrappedResponse).to.deep.eq({
      isFirst: false,
      isLast: false,
      userCount: 14,
      users: processedCheckUsers,
    });
  });
  it('should fetch 2 users skipping 8, despite maximum of 4.', async () => {
    const userRepository = appDataSource.getRepository(User);
    await seedDatabase(10);

    const token = generateToken(process.env.JWT_KEY ?? '', { id: '1' }, false);
    const response = await usersQueryRequest({ input: { skippedUsers: 8, maxUsers: 4 } }, token);
    const unwrappedResponse = response?.data?.data?.users;
    const checkUsers: User[] = await userRepository.find({
      order: {
        name: 'ASC',
      },
      skip: 8,
      take: 4,
      relations: ['addresses'],
    });
    const processedCheckUsers = checkUsers.map((user) => {
      return {
        birthDate: user.birthDate,
        email: user.email,
        id: user.id.toString(),
        name: user.name,
        addresses: user.addresses,
      };
    });

    expect(unwrappedResponse).to.deep.eq({
      isFirst: false,
      isLast: true,
      userCount: 10,
      users: processedCheckUsers,
    });
  });

  it('should not fetch users because skipped is bigger than user count.', async () => {
    const userRepository = appDataSource.getRepository(User);
    await seedDatabase(10);

    const token = generateToken(process.env.JWT_KEY ?? '', { id: '1' }, false);
    const response = await usersQueryRequest({ input: { skippedUsers: 10 } }, token);
    const unwrappedResponse = response?.data?.data?.users;
    const checkUsers: User[] = await userRepository.find({
      order: {
        name: 'ASC',
      },
      skip: 10,
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

    expect(unwrappedResponse).to.deep.eq({
      isFirst: false,
      isLast: true,
      userCount: 10,
      users: processedCheckUsers,
    });
  });

  it('should fetch 10 users, including one with an address.', async () => {
    const userRepository = appDataSource.getRepository(User);
    const addressRepository = appDataSource.getRepository(Address);
    await seedDatabase(9);
    const user = {
      birthDate: '09/11/2022',
      email: 'test@fake.com',
      name: 'test user',
      password: 'c0rr3ctp4ass',
    };
    const savedUser: User = await userRepository.save(user);
    const address = {
      cep: '37112-589',
      street: 'Feliciano Rua',
      streetNumber: '70571',
      complement: 'Apto. 540',
      neighborhood: 'Grant County',
      city: 'Enzo Gabriel do Sul',
      state: 'AP',
      user: savedUser,
    };
    await addressRepository.save(address);

    const token = generateToken(process.env.JWT_KEY ?? '', { id: '1' }, false);
    const response = await usersQueryRequest({}, token);
    const unwrappedResponse = response?.data?.data?.users;
    const checkUsers: User[] = await userRepository.find({
      order: {
        name: 'ASC',
      },
      take: 10,
      relations: ['addresses'],
    });
    const processedCheckUsers = checkUsers.map((user) => {
      return {
        birthDate: user.birthDate,
        email: user.email,
        id: user.id.toString(),
        name: user.name,
        addresses: user.addresses.map((address) => ({
          ...address,
          id: address.id.toString(),
        })),
      };
    });

    expect(unwrappedResponse).to.deep.eq({
      isFirst: true,
      isLast: true,
      userCount: 10,
      users: processedCheckUsers,
    });
  });
});
