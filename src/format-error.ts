import { unwrapResolverError } from '@apollo/server/errors';
import { CustomError } from './custom-error';
import { GraphQLFormattedError } from 'graphql';

function wrapError(error: CustomError) {
  return {
    message: error.message,
    code: error.code,
    additionalInfo: error.additionalInfo,
  };
}

export function formatError(e: GraphQLFormattedError, error: unknown): GraphQLFormattedError {
  const unwrappedError = unwrapResolverError(error);

  if (unwrappedError instanceof CustomError) {
    return wrapError(unwrappedError);
  }

  return wrapError(new CustomError('Internal server error', 500, 'Unknown error'));
}
