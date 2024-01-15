import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { appDataSource } from './data-source';
import { formatError } from './format-error';

async function connectedDb() {
  await appDataSource.setOptions({ url: process.env.DATABASE_URL }).initialize();
  console.info('DB connected!');
}

async function setupServer() {
  try {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      formatError,
    });

    const { url } = await startStandaloneServer(server, {
      listen: { port: +process.env.PORT },
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
