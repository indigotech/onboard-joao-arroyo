import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

interface User {
  name: string;
  email: string;
  birthDate: string;
}

const typeDefs = `
  type Query {
    hello: String
  }

  type User {
    id: ID!
    name: String!
    email: String!
    birthDate: String!
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

const resolvers = {
  Query: {
    hello: (): string => {
      return 'Hello world!';
    },
  },

  Mutation: {
    createUser: (parent, args: { data: User }) => {
      const newUser = {
        id: 1,
        name: args.data.name,
        email: args.data.email,
        birthDate: args.data.birthDate,
      };
      return newUser;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  try {
    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
    });

    console.log(`Server ready at: ${url}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error starting the server: ${error.message}`);
    } else {
      console.error(`Error starting the server: ${error}`);
    }
  }
}

startServer()
  .then(() => {})
  .catch((error) => {
    console.error(`Error in execution: ${error}`);
  });
