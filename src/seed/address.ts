import { config } from 'dotenv';
import { fakerPT_BR } from '@faker-js/faker';
import { appDataSource } from '../data-source';
import { connectedDb } from '../setup';
import { CreateUserInput } from '../interfaces';
import { User } from '../entity/User';
import { Address } from '../entity/Address';
import { hashPassword } from '../utils';

async function startConnection() {
  config();
  console.info('Initiating setup...');
  await connectedDb();
}

async function generateRandomUserData() {
  const birthDate = fakerPT_BR.date.birthdate();
  const password = await hashPassword(fakerPT_BR.internet.password());
  const [firstName, lastName] = [fakerPT_BR.person.firstName(), fakerPT_BR.person.lastName()];
  return {
    password: password,
    name: firstName + ' ' + lastName,
    email: fakerPT_BR.internet.email({ firstName: firstName, lastName: lastName }),
    birthDate: birthDate.getDay() + '/' + birthDate.getMonth() + '/' + birthDate.getFullYear(),
  };
}

function generateRandomAddressData() {
  return {
    cep: fakerPT_BR.location.zipCode(),
    street: fakerPT_BR.location.street(),
    streetNumber: fakerPT_BR.location.buildingNumber(),
    complement: fakerPT_BR.location.secondaryAddress(),
    neighborhood: fakerPT_BR.location.county(),
    city: fakerPT_BR.location.city(),
    state: fakerPT_BR.location.state({ abbreviated: true }),
  };
}

export async function seedDatabase() {
  const userRepository = appDataSource.getRepository(User);
  const addressRepository = appDataSource.getRepository(Address);

  const userWithOneAddressData: CreateUserInput = await generateRandomUserData();
  const userWithOneAddress = await userRepository.save(userWithOneAddressData);

  const addressDataForUserWithOneAddress = generateRandomAddressData();
  await addressRepository.save({
    ...addressDataForUserWithOneAddress,
    user: userWithOneAddress,
  });

  const userWithTwoAddressesData: CreateUserInput = await generateRandomUserData();
  const userWithTwoAddresses = await userRepository.save(userWithTwoAddressesData);

  const addressDataForUserWithTwoAddresses1 = generateRandomAddressData();
  const addressDataForUserWithTwoAddresses2 = generateRandomAddressData();

  await addressRepository.save({
    ...addressDataForUserWithTwoAddresses1,
    user: userWithTwoAddresses,
  });

  await addressRepository.save({
    ...addressDataForUserWithTwoAddresses2,
    user: userWithTwoAddresses,
  });

  console.log('Successfully added users and addresses to the local database.');
}

async function executeScript() {
  await startConnection();
  await seedDatabase();
}

if (require.main === module) {
  executeScript().catch((error) => console.log(error));
}
