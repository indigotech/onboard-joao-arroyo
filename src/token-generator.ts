import { sign } from 'jsonwebtoken';

export const generateToken = (key: string, tokenParams: { id: string }, rememberMe: boolean): string => {
  const tokenOptions = { expiresIn: rememberMe ? '7d' : '10m' };
  const token: string = sign(tokenParams, key, tokenOptions);
  return token;
};
