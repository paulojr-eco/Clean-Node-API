import { type HttpRequest, type HttpResponse, type EmailValidator, type Controller } from 'presentation/protocols';
import { MissingParamError, InvalidParamError } from 'presentation/errors';
import { badRequest, serverError } from 'presentation/helpers/http-helper';
import { type AddAccount } from 'domain/usecases/add-account';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body;
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }
      const isEmailValid = this.emailValidator.isValid(email);
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'));
      }
      this.addAccount.add({
        name,
        email,
        password
      });
      return {
        statusCode: 200,
        body: 'Successful'
      };
    } catch (error) {
      return serverError();
    }
  }
}
