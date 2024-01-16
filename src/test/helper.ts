import axios from 'axios';
import { CreateUserInput, LoginInput, QueryUserInput, QueryUsersInput } from '../interfaces';

export async function createUserRequest(variables: { input: CreateUserInput }, token: string) {
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

export async function loginRequest(variables: { input: LoginInput }) {
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

export async function userQueryRequest(variables: { input: QueryUserInput }, token: string) {
  const result = await axios.post(
    `http://localhost:${process.env.PORT}/graphql`,
    {
      query: `query ($input: QueryUserInput!) {
        user(data: $input) {
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

export async function usersQueryRequest(variables: { input?: QueryUsersInput } | undefined, token: string) {
  const result = await axios.post(
    `http://localhost:${process.env.PORT}/graphql`,
    {
      query: `query ($input: QueryUsersInput) {
        users(data: $input) {
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
