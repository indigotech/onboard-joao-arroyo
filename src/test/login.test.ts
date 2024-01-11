import axios from 'axios';
import { expect } from 'chai';
import { User } from '../entity/User';

describe('Login Mutation', () => {
  it('should return mocked data in the specified format', async () => {
    const params = { email: 'mocked@fake.com', password: 'v4l1dp4ss' };
    const result = await axios.post(`http://localhost:${process.env.PORT}/graphql`, {
      query: `mutation ($input: LoginInput!) {
    login(data: $input) {          
      user {
        id
        name
        email
        birthDate
      }
      token    
    }
  }`,
      variables: {
        input: params,
      },
    });

    expect(result).to.exist;

    const unwrappedResponse: { user: User; token: string } = result?.data?.data?.login;
    expect(unwrappedResponse.token).to.be.a('string');
    expect(unwrappedResponse.user.id).to.match(/^\d+$/);
    expect(unwrappedResponse.user.email).to.equal(params.email);
    expect(unwrappedResponse.user.birthDate).to.be.a('string');
    expect(unwrappedResponse.user.name).to.be.a('string');
  });
});
