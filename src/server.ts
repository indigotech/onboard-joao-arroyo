import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = `#graphql  
  type Query {    
    hello: String
  }  
`;

const resolvers = {
  Query: {
    hello: (): string => {
      return 'Hello world!';
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
