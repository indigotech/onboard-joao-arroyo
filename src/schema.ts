export const typeDefs = `
    type Query {
      hello: String
      user(data: queryUserInput!): User      
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

    input queryUserInput {
      id: ID!
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
