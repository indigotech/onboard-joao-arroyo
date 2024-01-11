import { appDataSource } from './data-source';
import { User } from './entity/User';
import { CustomError } from './custom-error';
import * as bcrypt from 'bcrypt';

export const resolvers = {
  Query: {
    hello: (): string => {
      return 'Hello world!';
    },
  },

  Mutation: {
    createUser: async (parent, args: { data: User }) => {
      const userRepository = appDataSource.getRepository(User);

      if (!validPassword(args.data.password)) {
        throw new CustomError(
          'Invalid password.',
          422,
          'It should be at least 6 characters long and have at least one letter and 1 digit.',
        );
      }

      if (await duplicateEmail(args.data.email)) {
        throw new CustomError('Invalid email.', 422, 'This email is already in use.');
      }

      const user = new User();
      Object.assign(user, args.data);

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(args.data.password, salt);

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
  const userRepository = appDataSource.getRepository(User);
  return !!(await userRepository.count({
    where: {
      email: email,
    },
  }));
}
