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
      const savedUser = await AppDataSource.manager.save(user);

      return {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        birthDate: savedUser.birthDate,
      };
    },
  },
};
