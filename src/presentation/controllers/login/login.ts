import {
  badRequest,
  serverError,
  successful,
  unauthorized
} from '../../helpers/http/http-helper';
import {
  type Controller,
  type HttpRequest,
  type HttpResponse,
  type Authentication,
  type Validation
} from './login-protocols';

export class LoginController implements Controller {
  private readonly validation;
  private readonly authentication;
  constructor (authentication: Authentication, validation: Validation) {
    this.validation = validation;
    this.authentication = authentication;
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }
      const { email, password } = httpRequest.body;
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
