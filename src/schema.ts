import { MAX_USERS } from './constants.json';

export const typeDefs = `
    type Query {
      hello: String
      user(data: QueryUserInput!): User
      users(data: QueryUsersInput = { maxUsers: ${MAX_USERS} }): [User]
    }
      
    type User {
      id: ID!
      name: String!
      email: String!
      birthDate: String!
    }

    type LoginResponse {
      user: User!,            
      token: String!
    }

    input QueryUserInput {
      id: ID!
    }

    input QueryUsersInput {
      maxUsers: Int = ${MAX_USERS}
    }

    input LoginInput {
      email: String!
      password: String!
      rememberMe: Boolean
    }
  
    input UserInput {
      name: String!
      email: String!
      password: String!
      birthDate: String!
    }
  
    type Mutation {      
      login(data: LoginInput!): LoginResponse
      createUser(data: UserInput!): User
    }
  `;
