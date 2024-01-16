import { MAX_USERS } from './constants.json';

export const typeDefs = `
    type Query {
      hello: String
      user(data: QueryUserInput!): User
      users(data: QueryUsersInput = { skippedUsers: 0, maxUsers: ${MAX_USERS} }): UsersResponse
    }              
    
    type Address {
      id: ID!
      cep: String!
      street: String!
      streetNumber: String!
      complement: String
      neighborhood: String!
      city: String!
      state: String!
    }

    type SimplifiedUser {
      id: ID!
      name: String!
      email: String!
      birthDate: String!
    }

    type User {
      id: ID!
      name: String!
      email: String!
      birthDate: String!
      addresses: [Address]!
    }
    type UsersResponse {
      users: [User]!
      userCount: Int!
      isLast: Boolean!
      isFirst: Boolean!
    }

    type LoginResponse {
      user: SimplifiedUser!,            
      token: String!
    }

    input QueryUserInput {
      id: ID!
    }
    
    input QueryUsersInput {
      skippedUsers: Int = 0,
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
