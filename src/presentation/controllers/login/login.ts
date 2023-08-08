import { badRequest, serverError, successful } from 'presentation/helpers/http-helper';
import {
  type EmailValidator,
  type Controller,
  type HttpRequest,
  type HttpResponse
} from '../signup/signup-protocols';
import { InvalidParamError, MissingParamError } from 'presentation/errors';

export class LoginController implements Controller {
  private readonly emailValidator;
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body;
      if (!email) {
        return await new Promise((resolve) => {
          resolve(badRequest(new MissingParamError('email')));
        });
      }
      if (!password) {
        return await new Promise((resolve) => {
          resolve(badRequest(new MissingParamError('password')));
        });
      }
      const isValid = this.emailValidator.isValid(email);
      if (!isValid) {
        return await new Promise((resolve) => {
          resolve(badRequest(new InvalidParamError('email')));
        });
      }
      return await new Promise((resolve) => {
        resolve(successful(''));
      });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        return serverError(error);
      }
      return serverError(new Error('Error while handle login'));
    }
  }
}
