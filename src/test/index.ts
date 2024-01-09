import { before, describe, it } from 'mocha';
import axios from 'axios';
import { setup } from '../server';

before(async () => {
  await setup();
});

describe('Test Query Hello', () => {
  it('should return "Hello world!"', async () => {
    const response = await axios.post('http://localhost:4000/graphql', {
      query: 'query { hello }',
    });

    console.log('Query response:', response.data);
  });
});
