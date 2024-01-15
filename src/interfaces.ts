export interface DecodedToken {
  email: string;
  id: string;
  iat: number;
  exp: number;
}

export interface CreateUserInput {
  password: string;
  email: string;
  birthDate: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}
export interface QueryUserInput {
  id: string;
}

export interface QueryUsersInput {
  skipedUsers?: number;
  maxUsers: number;
}
