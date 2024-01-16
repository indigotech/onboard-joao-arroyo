import { createUserRequest } from './helper';
import { expect } from 'chai';
import { appDataSource } from '../data-source';
import { User } from '../entity/User';
import * as bcrypt from 'bcrypt';
import { generateToken } from '../token-generator';
import { CustomError } from '../custom-error';

describe('Create User Mutation', () => {
  afterEach(async () => {
    await appDataSource.getRepository(User).clear();
  });

  it('should return no users at the beginning', async () => {
    const userRepository = appDataSource.getRepository(User);
    const result = await userRepository.count();

    expect(result).to.equal(0);
  });

  it('should not authenticate due to missing token', async () => {
    const newUser = {
      password: 'example_user',
      email: 'first@example.com',
      birthDate: '12/09/2004',
      name: 'user 1',
    };

    const result = await createUserRequest({ input: newUser }, '');

    const customError: CustomError = result?.data?.errors[0];

    expect(customError).to.deep.eq({
      message: 'Access denied.',
      code: 401,
      additionalInfo: 'Authentication required.',
    });
  });

  it('should not authenticate due to token generated with incorrect key', async () => {
    const newUser = {
      password: 'example_user',
      email: 'first@example.com',
      birthDate: '12/09/2004',
      name: 'user 1',
    };

    const token = generateToken('wrongkey', { id: '1' }, false);

    const result = await createUserRequest({ input: newUser }, token);

    const customError: CustomError = result?.data?.errors[0];

    expect(customError).to.deep.eq({
      message: 'Access denied.',
      code: 401,
      additionalInfo: 'Authentication required.',
    });
  });

  it('should not register an user due to a weak password', async () => {
    const newUser = {
      password: 'example_user',
      email: 'first@example.com',
      birthDate: '12/09/2004',
      name: 'user 1',
    };

    const token = generateToken(process.env.JWT_KEY ?? ' ', { id: '1' }, false);

    const result = await createUserRequest({ input: newUser }, token);

    expect(result?.data?.errors[0].message).to.equal('Invalid password.');
    expect(result?.data?.errors[0].code).to.equal(400);
    expect(result?.data?.errors[0].additionalInfo).to.equal(
      'It should be at least 6 characters long and have at least one letter and 1 digit.',
    );
  });

  it('should register an user', async () => {
    const userRepository = appDataSource.getRepository(User);
    const newUser = {
      password: 'ex4mpleus3r',
      email: 'first@example.com',
      birthDate: '12/09/2004',
      name: 'user 1',
    };

    const token = generateToken(process.env.JWT_KEY ?? '', { id: '1' }, false);
    const createResult = await createUserRequest({ input: newUser }, token);
    const createdUser: User = createResult.data?.data?.createUser;

    expect(createdUser.id).to.exist;
    expect(createdUser.id).to.match(/^\d+$/);
    expect(createdUser.email).to.equal(newUser.email);
    expect(createdUser.birthDate).to.equal(newUser.birthDate);
    expect(createdUser.name).to.equal(newUser.name);

    const fetchedUser = await userRepository.findOne({
      where: {
        id: createdUser.id,
      },
    });
    const hashedPassword = fetchedUser?.password ?? '';
    const matchedPasswords = await bcrypt.compare(newUser.password, hashedPassword);

    expect(fetchedUser?.id).to.exist;
    expect(fetchedUser?.id).to.match(/^\d+$/);
    expect(fetchedUser?.email).to.equal(newUser.email);
    expect(fetchedUser?.birthDate).to.equal(newUser.birthDate);
    expect(fetchedUser?.name).to.equal(newUser.name);
    expect(fetchedUser?.password).to.have.string('$2b$10$');
    expect(matchedPasswords).to.be.true;
  });

  it('should not register an user due to repeated email', async () => {
    const userRepository = appDataSource.getRepository(User);
    const newUser = {
      password: 'v4lidp4ass',
      email: 'first@example.com',
      birthDate: '09/12/2004',
      name: 'user 1',
    };
    const copyUser = { ...newUser };
    await userRepository.save(newUser);

    const token = generateToken(process.env.JWT_KEY ?? '', { id: '1' }, false);
    const result = await createUserRequest({ input: copyUser }, token);

    expect(result?.data?.errors[0].message).to.equal('Invalid email.');
    expect(result?.data?.errors[0].code).to.equal(409);
    expect(result?.data?.errors[0].additionalInfo).to.equal('This email is already in use.');
    expect(await userRepository.count()).to.equal(1);
  });

  it('should not register due to an invalid email.', async () => {
    const newUser = {
      password: 'v4lidp4ass',
      email: 'notAnEmail',
      birthDate: '09/12/2004',
      name: 'user 1',
    };

    const token = generateToken(process.env.JWT_KEY ?? '', { id: '1' }, false);
    const result = await createUserRequest({ input: newUser }, token);

    expect(result?.data?.errors[0]).to.deep.eq({
      message: 'Invalid email.',
      code: 400,
      additionalInfo: 'The provided email does not correspond to a valid email.',
    });
  });
});
