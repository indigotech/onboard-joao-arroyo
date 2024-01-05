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

async function iniciarServidor() {
  try {
    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
    });

    console.log(`Server ready at: ${url}`);
  } catch (erro) {
    if (erro instanceof Error) {
      console.error(`Erro ao iniciar o servidor: ${erro.message}`);
    } else {
      console.error(`Erro ao iniciar o servidor: ${erro}`);
    }
  }
}

iniciarServidor()
  .then(() => {})
  .catch((erro) => {
    console.error(`Erro durante a execução: ${erro}`);
  });
