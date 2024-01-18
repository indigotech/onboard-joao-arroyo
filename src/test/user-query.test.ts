import { expect } from 'chai';
import { User } from '../entity/User';
import { Address } from '../entity/Address';
import { appDataSource } from '../data-source';
import { CustomError } from '../custom-error';
import { userQueryRequest } from './helper';
import { generateToken } from '../token-generator';

describe('User query', () => {
  afterEach(async () => {
    await appDataSource.createQueryBuilder().delete().from(Address).execute();
    await appDataSource.createQueryBuilder().delete().from(User).execute();
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
    const token = generateToken(process.env.JWT_KEY ?? '', { id: savedUser.id.toString() }, false);

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
    const token = generateToken(process.env.JWT_KEY ?? '', { id: userId }, false);
    const response = await userQueryRequest({ input: { id: userId } }, token);
    const fetchedUser = response?.data?.data?.user;

    expect(fetchedUser).to.deep.eq({
      id: savedUser.id.toString(),
      name: savedUser.name,
      birthDate: savedUser.birthDate,
      email: savedUser.email,
      addresses: [],
    });
  });

  it('should fetch the requested user and its addresses.', async () => {
    const userRepository = appDataSource.getRepository(User);
    const addressRepository = appDataSource.getRepository(Address);
    const user = {
      birthDate: '09/11/2022',
      email: 'test@fake.com',
      name: 'test user',
      password: 'c0rr3ctp4ass',
    };
    const savedUser: User = await userRepository.save(user);
    const userId: string = savedUser.id.toString();
    const address1 = {
      cep: '37112-589',
      street: 'Feliciano Rua',
      streetNumber: '70571',
      complement: 'Apto. 540',
      neighborhood: 'Grant County',
      city: 'Enzo Gabriel do Sul',
      state: 'AP',
      user: savedUser,
    };
    const address2 = {
      cep: '40344-200',
      street: 'Leonardo Alameda',
      streetNumber: '87491',
      complement: 'Casa 6',
      neighborhood: 'Durham',
      city: 'Raul do Sul',
      state: 'SE',
      user: savedUser,
    };
    const savedAddress1 = await addressRepository.save(address1);
    const savedAddress2 = await addressRepository.save(address2);

    const token = generateToken(process.env.JWT_KEY ?? '', { id: userId }, false);
    const response = await userQueryRequest({ input: { id: userId } }, token);
    const processedAddress1 = {
      cep: savedAddress1.cep,
      city: savedAddress1.city,
      complement: savedAddress1.complement,
      id: savedAddress1.id.toString(),
      neighborhood: savedAddress1.neighborhood,
      state: savedAddress1.state,
      street: savedAddress1.street,
      streetNumber: savedAddress1.streetNumber,
    };

    const processedAddress2 = {
      cep: savedAddress2.cep,
      city: savedAddress2.city,
      complement: savedAddress2.complement,
      id: savedAddress2.id.toString(),
      neighborhood: savedAddress2.neighborhood,
      state: savedAddress2.state,
      street: savedAddress2.street,
      streetNumber: savedAddress2.streetNumber,
    };

    const fetchedUser = response?.data?.data?.user;

    expect(fetchedUser).to.deep.eq({
      id: savedUser.id.toString(),
      name: savedUser.name,
      birthDate: savedUser.birthDate,
      email: savedUser.email,
      addresses: [processedAddress1, processedAddress2],
    });
  });
});
