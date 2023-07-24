import { type HttpRequest, type HttpResponse, type EmailValidator, type Controller } from 'presentation/protocols';
import { MissingParamError, InvalidParamError } from 'presentation/errors';
import { badRequest, serverError } from 'presentation/helpers/http-helper';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      if (httpRequest.body.password !== httpRequest.body.passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }
      const isEmailValid = this.emailValidator.isValid(httpRequest.body.email);
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'));
      }
      return {
        statusCode: 200,
        body: 'Successful'
      };
    } catch (error) {
      return serverError();
    }
  }
}
