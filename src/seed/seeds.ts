import { config } from 'dotenv';
import { fakerPT_BR } from '@faker-js/faker';
import { appDataSource } from '../data-source';
import { connectedDb } from '../setup';
import { CreateUserInput } from '../interfaces';
import { User } from '../entity/User';
import { hashPassword } from '../utils';

async function startConnection() {
  config();
  console.info('Initiating setup...');
  await connectedDb();
}

async function generateRandomData() {
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

async function seedDatabase() {
  await startConnection();
  const userRepository = appDataSource.getRepository(User);
  const users = [];
  for (let i = 0; i < 50; i++) {
    const newUser: CreateUserInput = await generateRandomData();
    users.push(newUser);
  }
  await userRepository.save(users);
  console.log('Succesfully added 50 users to the local database.');
}

seedDatabase().catch((error) => console.log(error));
