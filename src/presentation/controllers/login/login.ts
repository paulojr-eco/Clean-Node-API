import { badRequest, successful } from 'presentation/helpers/http-helper';
import {
  type EmailValidator,
  type Controller,
  type HttpRequest,
  type HttpResponse
} from '../signup/signup-protocols';
import { MissingParamError } from 'presentation/errors';

export class LoginController implements Controller {
  private readonly emailValidator;
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

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
    this.emailValidator.isValid(httpRequest.body.email);
    return await new Promise((resolve) => {
      resolve(successful(''));
    });
  }
}
