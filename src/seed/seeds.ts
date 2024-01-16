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

async function generateRandomData(index: number) {
  const birthDate = fakerPT_BR.date.birthdate();
  const password = await hashPassword(fakerPT_BR.internet.password());
  const [firstName, lastName] = [fakerPT_BR.person.firstName(), fakerPT_BR.person.lastName()];
  return {
    password: password,
    name: firstName + ' ' + lastName,
    email: `user${index}@test.com`,
    birthDate: birthDate.getDay() + '/' + birthDate.getMonth() + '/' + birthDate.getFullYear(),
  };
}

export async function seedDatabase(maxUsers = 50) {
  const userRepository = appDataSource.getRepository(User);
  const users = [];
  for (let i = 0; i < maxUsers; i++) {
    const newUser: CreateUserInput = await generateRandomData(i);
    users.push(newUser);
  }
  await userRepository.save(users);
}

async function executeScript() {
  await startConnection();
  await seedDatabase();
  console.log('Succesfully added 50 users to the local database.');
}

if (require.main === module) {
  executeScript().catch((error) => console.log(error));
}
