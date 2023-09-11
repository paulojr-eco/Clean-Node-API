import {
  forbidden,
  serverError,
  successful
} from '@/presentation/helpers/http/http-helper';
import {
  type HttpRequest,
  type HttpResponse,
  type Middleware
} from '../protocols';
import { AccessDeniedError } from '@/presentation/errors/access-denied-error';
import { type LoadAccountByToken } from './auth-middleware-protocols';

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token'];
      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken, this.role);
        if (account) {
          return successful({ accountId: account.id });
        }
      }
      return forbidden(new AccessDeniedError());
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        return serverError(error);
      }
      return serverError(new Error('Error while handle auth middleware'));
    }
  }
}
