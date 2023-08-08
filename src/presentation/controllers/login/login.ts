import { badRequest } from 'presentation/helpers/http-helper';
import {
  type Controller,
  type HttpRequest,
  type HttpResponse
} from '../signup/signup-protocols';
import { MissingParamError } from 'presentation/errors';

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return await new Promise((resolve) => {
      resolve(badRequest(new MissingParamError('email')));
    });
  }
}
