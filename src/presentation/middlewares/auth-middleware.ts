import { forbidden } from 'presentation/helpers/http/http-helper';
import {
  type HttpRequest,
  type HttpResponse,
  type Middleware
} from '../protocols';
import { AccessDeniedError } from 'presentation/errors/access-denied-error';

export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = forbidden(new AccessDeniedError());
    return await new Promise((resolve) => {
      resolve(error);
    });
  }
}
