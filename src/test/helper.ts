import axios from 'axios';

export async function createUserRequest(variables) {
  const result = await axios.post(`http://localhost:${process.env.PORT}/graphql`, {
    query: `mutation ($input: UserInput!) {
        createUser(data: $input) {
          email
          birthDate
          name
          id
        }
      }`,
    variables: variables,
  });
  return result;
}
