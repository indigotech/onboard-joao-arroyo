import axios from 'axios';
import { expect } from 'chai';
import { appDataSource } from '../data-source';
import { User } from '../entity/User';
import * as bcrypt from 'bcrypt';

describe('Create User Mutation', () => {
  after(async () => {
    await appDataSource.getRepository(User).clear();
  });

  it('should return no users at the beginning', async () => {
    const result = await axios.post(`http://localhost:${process.env.PORT}/graphql`, {
      query: `query {
            users {
              id
              name
              email
              birthDate
            }
          }`,
    });

    expect(result.data?.data.users).to.be.empty;
  });

  it('should not register an user due to a weak password', async () => {
    const newUser = {
      password: 'example_user',
      email: 'first@example.com',
      birthDate: '12/09/2004',
      name: 'user 1',
    };

    const result = await axios.post(`http://localhost:${process.env.PORT}/graphql`, {
      query: `mutation ($input: UserInput!) {
    createUser(data: $input) {
      email
      birthDate
      name
      id
    }
  }`,
      variables: {
        input: newUser,
      },
    });

    expect(result.data?.errors[0].message).to.equal(
      'Password is not strong enough: should be at least 6 characters long and have at least one letter and 1 digit.',
    );
  });

  it('should register an user', async () => {
    const newUser = {
      password: 'ex4mpleus3r',
      email: 'first@example.com',
      birthDate: '12/09/2004',
      name: 'user 1',
    };

    const createResult = await axios.post(`http://localhost:${process.env.PORT}/graphql`, {
      query: `mutation ($input: UserInput!) {
    createUser(data: $input) {
      email
      birthDate
      name
      id
    }
  }`,
      variables: {
        input: newUser,
      },
    });

    expect(createResult.data?.data?.createUser).to.exist;

    const createdUser: User = createResult.data?.data?.createUser;

    // check that the object returned from mutation is the one defined by the input
    expect(createdUser.id).to.exist;
    expect(createdUser.id).to.match(/^\d+$/);
    expect(createdUser.email).to.equal(newUser.email);
    expect(createdUser.birthDate).to.equal(newUser.birthDate);
    expect(createdUser.name).to.equal(newUser.name);

    const fetchedResult = await axios.post(`http://localhost:${process.env.PORT}/graphql`, {
      query: `query FindUser($findUserId: ID!) {
        findUser(id: $findUserId) {
            birthDate
            name
            id
            email
            password
        }
        }`,
      variables: {
        findUserId: createdUser.id,
      },
    });

    expect(fetchedResult.data?.data?.findUser).to.exist;

    const fetchedUser: User = fetchedResult.data?.data?.findUser;

    // check that the object returned from database query is the same as the initially assigned
    expect(fetchedUser.id).to.exist;
    expect(fetchedUser.id).to.match(/^\d+$/);
    expect(fetchedUser.email).to.equal(newUser.email);
    expect(fetchedUser.birthDate).to.equal(newUser.birthDate);
    expect(fetchedUser.name).to.equal(newUser.name);
    expect(fetchedUser.password).to.have.string('$2b$10$');
    const matchedPasswords = await bcrypt.compare(newUser.password, fetchedUser.password);
    expect(matchedPasswords).to.be.true;
  });
});
