import { forbidden } from '../../presentation/helpers/http/http-helper';
import {
  type HttpRequest,
  type HttpResponse,
  type Middleware
} from '../protocols';
import { AccessDeniedError } from '../../presentation/errors/access-denied-error';
import { type LoadAccountByToken } from '../../domain/usecases/load-account-by-token';

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByToken: LoadAccountByToken) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token'];
    if (accessToken) {
      await this.loadAccountByToken.load(accessToken);
    }
    return forbidden(new AccessDeniedError());
  }
}
