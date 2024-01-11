export const typeDefs = `
    type Query {
      hello: String
    }
      
    type User {
      id: ID!
      name: String!
      email: String!
      birthDate: String!
    }

    type LoginResponse {
      {
        id: ID!
        name: String!
        email: String!
        birthDate: String!
      } 
      token: String!
    }

    input LoginInput {
      email: String!
      password: String!
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
