import { User } from './type-defs';

export const resolvers = {
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
