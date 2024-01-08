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
      const userRepository = AppDataSource.getRepository(User);

      if (!validPassword(args.data.password)) {
        throw new Error(
          'Password is not strong enough: should be at least 6 characters long and have at least one letter and 1 digit.',
        );
      }

      if (await duplicateEmail(args.data.email)) {
        throw new Error('Email already in use.');
      }

      const user = new User();
      Object.assign(user, args.data);

      const savedUser = await userRepository.save(user);

      return {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        birthDate: savedUser.birthDate,
      };
    },
  },
};

function validPassword(password: string): boolean {
  const regex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
  return regex.test(password);
}

async function duplicateEmail(email: string) {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.find({
    where: {
      email: email,
    },
  });
  return user.length;
}
