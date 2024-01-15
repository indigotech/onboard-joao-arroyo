import { sign } from 'jsonwebtoken';

export const generateToken = (tokenParams: { id: string }): string => {
  const secretKey = process.env.JWT_KEY;
  const tokenOptions = { expiresIn: '10m' };
  const token: string = sign(tokenParams, secretKey, tokenOptions);
  return token;
};
