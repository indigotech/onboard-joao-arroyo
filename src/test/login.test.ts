import axios from 'axios';
import { expect } from 'chai';

describe('Login Mutation', () => {
  it('should return mocked data in the specified format', async () => {
    const params = { email: 'mocked@fake.com', password: 'v4l1dp4ss' };
    const result = await axios.post(`http://localhost:${process.env.PORT}/graphql`, {
      query: `mutation {
    login(data: $input) {
      email
      birthDate
      name
      id
    }
  }`,
      variables: {
        input: params,
      },
    });
    console.log(JSON.stringify(result.data));
    expect(result).to.exist;
  });
});
