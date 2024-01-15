import axios from 'axios';

export async function createUserRequest(variables, token) {
  const result = await axios.post(
    `http://localhost:${process.env.PORT}/graphql`,
    {
      query: `mutation ($input: UserInput!) {
        createUser(data: $input) {
          email
          birthDate
          name
          id
        }
      }`,
      variables: variables,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return result;
}

export async function loginRequest(variables) {
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
    variables: variables,
  });
  return result;
}
