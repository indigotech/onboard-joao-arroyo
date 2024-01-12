import { DecodedToken } from './interfaces';
import { CustomError } from './custom-error';
import { verify } from 'jsonwebtoken';

export function authenticate(token: string) {
  const hasToken = !!token;
  if (!hasToken) {
    throw new CustomError('Access denied.', 401, 'Authentication required.');
  }

  const key = process.env.JWT_KEY;

  if (!key) {
    throw new CustomError('Internal server error', 500, 'JWT_KEY is not configured.');
  }

  try {
    const decodedToken = verify(token.replace('Bearer ', ''), key) as DecodedToken;
    return decodedToken;
  } catch (error) {
    throw new CustomError('Access denied.', 401, 'Authentication required.');
  }
}
