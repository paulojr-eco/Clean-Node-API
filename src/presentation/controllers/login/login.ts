import {
  badRequest,
  serverError,
  successful,
  unauthorized
} from 'presentation/helpers/http-helper';
import {
  type EmailValidator,
  type Controller,
  type HttpRequest,
  type HttpResponse,
  type Authentication
} from './login-protocols';
import { InvalidParamError, MissingParamError } from 'presentation/errors';

export class LoginController implements Controller {
  private readonly emailValidator;
  private readonly authentication;
  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator;
    this.authentication = authentication;
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredField = ['email', 'password'];
      for (const field of requiredField) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const { email, password } = httpRequest.body;
      const isValid = this.emailValidator.isValid(email);
      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }
      const accessToken = await this.authentication.auth(email, password);
      if (!accessToken) {
        return unauthorized();
      }
      return successful({ accessToken });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        return serverError(error);
      }
      return serverError(new Error('Error while handle login'));
    }
  }
}
