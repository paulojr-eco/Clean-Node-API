import { type HttpRequest, type HttpResponse } from 'presentation/protocols/http';
import { MissingParamError } from 'presentation/errors/missing-param-error';
import { badRequest } from 'presentation/helpers/http-helper';
import { type Controller } from 'presentation/protocols/controller';
import { type EmailValidator } from 'presentation/protocols/email-validator';
import { InvalidParamError } from 'presentation/errors/invalid-param-error';
import { ServerError } from 'presentation/errors/server-error';

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
      const isEmailValid = this.emailValidator.isValid(httpRequest.body.email);
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'));
      }
      return {
        statusCode: 200,
        body: 'Successful'
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: new ServerError()
      };
    }
  }
}
