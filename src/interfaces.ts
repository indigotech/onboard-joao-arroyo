export interface DecodedToken {
  email: string;
  id: string;
  iat: number;
  exp: number;
}

export interface LoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}
