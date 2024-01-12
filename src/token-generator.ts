import { sign } from 'jsonwebtoken';

export const generateToken = (tokenParams: { id: string }, rememberMe: boolean): string => {
  const secretKey = process.env.JWT_KEY;
  const tokenOptions = { expiresIn: rememberMe ? '7d' : '10m' };
  const token: string = sign(tokenParams, secretKey, tokenOptions);
  return token;
};

export const generateInvalidToken = (tokenParams: { email: string; id: string }, rememberMe: boolean): string => {
  const wrongKey = 'incorrectKey';
  const tokenOptions = { expiresIn: rememberMe ? '7d' : '10m' };
  const token: string = sign(tokenParams, wrongKey, tokenOptions);
  return token;
};
