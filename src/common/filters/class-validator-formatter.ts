// this function gonna take exception on the global filter and if its coming from class validator it gonna format it
// as the rest of exceptions with TError and TResponse

import { TResponse } from '../types/TResponse';

export const classValidatorFormatter = (exception: any, path: string) => {
  const message = exception.response?.message;
  if (!message) return false;

  if (!exception.response?.message) {
    return false;
  }

  if (!Array.isArray(message)) {
    return false;
  }

  const response: TResponse = {
    data: null,
    error: message.concat().join(', '),
    message: message[0],
    statusCode: 400,
    success: false,
    timestamp: new Date(),
    path,
  };

  return response;
};
