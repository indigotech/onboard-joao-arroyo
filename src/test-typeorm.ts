import 'reflect-metadata';
import { appDataSource } from './data-source';
import { User } from './entity/User';

appDataSource
  .initialize()
  .then(async () => {
    console.log('Inserting a new user into the database...');
    const user = new User();
    user.name = 'Joao Pedro Arroyo';
    user.password = 'secretpass';
    user.birthDate = '12/09/2004';
    user.email = 'joao.arroyo@fake.com';
    await appDataSource.manager.save(user);
    console.log('Saved a new user with id: ' + user.id);

    console.log('Loading users from the database...');
    const users = await appDataSource.manager.find(User);
    console.log('Loaded users: ', users);
  })
  .catch((error) => console.log(error));
