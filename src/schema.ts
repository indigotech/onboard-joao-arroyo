export const typeDefs = `
    type Query {
      users: [User]
      findUser(id: ID!): CompleteUser
      hello: String      
    }
  
    type User {
      id: ID!
      name: String!
      email: String!
      birthDate: String!
    }

    type CompleteUser {
      id: ID!
      name: String!
      email: String!
      birthDate: String!
      password: String!
    }
  
    input UserInput {
      name: String!
      email: String!
      password: String!
      birthDate: String!
    }
  
    type Mutation {
      createUser(data: UserInput!): User
    }
  `;
