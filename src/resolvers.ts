import { appDataSource } from './data-source';
import { User } from './entity/User';
import { CustomError } from './custom-error';
import * as bcrypt from 'bcrypt';
import { hashPassword, validEmail, validPassword } from './utils';
import { generateToken } from './token-generator';
import { LoginInput } from 'interfaces';
import { authenticate } from './authenticate';

export const resolvers = {
  Query: {
    hello: (): string => {
      return 'Hello world!';
    },
  },

  Mutation: {
    createUser: async (_: unknown, args: { data: User }, context: { token: string }) => {
      authenticate(context.token);

      const userRepository = appDataSource.getRepository(User);

      if (!validEmail(args.data.email)) {
        throw new CustomError('Invalid email.', 400, 'The provided email does not correspond to a valid email.');
      }

      if (!validPassword(args.data.password)) {
        throw new CustomError(
          'Invalid password.',
          400,
          'It should be at least 6 characters long and have at least one letter and 1 digit.',
        );
      }

      if (await duplicateEmail(args.data.email)) {
        throw new CustomError('Invalid email.', 409, 'This email is already in use.');
      }

      const user = new User();
      Object.assign(user, args.data);

      user.password = await hashPassword(args.data.password);

      const savedUser = await userRepository.save(user);

      return {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        birthDate: savedUser.birthDate,
      };
    },
    login: async (_: unknown, args: { data: LoginInput }) => {
      const userRepository = appDataSource.getRepository(User);

      if (!validEmail(args.data.email)) {
        throw new CustomError('Invalid email.', 400, 'The provided email does not correspond to a valid email.');
      }

      const users: User[] = await userRepository.find({
        where: {
          email: args.data.email,
        },
      });

      if (users.length == 0) {
        throw new CustomError('Invalid email.', 404, 'No user was found with the corresponding email.');
      }

      const user = users[0];

      const password: string = args.data.password;
      const correctPassword = await bcrypt.compare(password, user.password);

      if (!correctPassword) {
        throw new CustomError('Invalid password.', 401, 'Incorrect password for the given email.');
      }

      const rememberMe = args.data.rememberMe === true;
      const token = generateToken({ id: user.id.toString() }, rememberMe);

      return { user: user, token: token };
    },
  },
};

async function duplicateEmail(email: string) {
  const userRepository = appDataSource.getRepository(User);
  return !!(await userRepository.count({
    where: {
      email: email,
    },
  }));
}
