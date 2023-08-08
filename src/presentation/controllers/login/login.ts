import { badRequest, successful } from 'presentation/helpers/http-helper';
import {
  type Controller,
  type HttpRequest,
  type HttpResponse
} from '../signup/signup-protocols';
import { MissingParamError } from 'presentation/errors';

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return await new Promise((resolve) => {
        resolve(badRequest(new MissingParamError('email')));
      });
    }
    if (!httpRequest.body.password) {
      return await new Promise((resolve) => {
        resolve(badRequest(new MissingParamError('password')));
      });
    }
    return await new Promise((resolve) => {
      resolve(successful(''));
    });
  }
}
