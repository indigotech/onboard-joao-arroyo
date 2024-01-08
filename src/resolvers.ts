import { AppDataSource } from './data-source';
import { User } from './entity/User';

export const resolvers = {
  Query: {
    hello: (): string => {
      return 'Hello world!';
    },
  },

  Mutation: {
    createUser: async (parent, args: { data: User }) => {
      const user = new User();
      Object.assign(user, args.data);
      await AppDataSource.manager.save(user);

      return {
        id: user.id,
        name: args.data.name,
        email: args.data.email,
        birthDate: args.data.birthDate,
      };
    },
  },
};
