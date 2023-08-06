import { ServerError } from '../../presentation/errors';
import { type HttpResponse } from '../../presentation/protocols/http';

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
});

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError()
});

export const successful = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
});
