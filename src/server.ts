import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './type-defs';
import { resolvers } from './resolvers';
import { initializeDataSource } from './data-source';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function connectedDb() {
  await initializeDataSource();
}

async function setupServer() {
  try {
    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
    });

    console.log(`Server running on: ${url}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error starting the server: ${error.message}`);
    } else {
      console.error(`Error starting the server: ${error}`);
    }
  }
}

export async function setup() {
  await connectedDb();
  await setupServer();
}

if (require.main === module) {
  setup().catch((error) => console.log(error));
}
