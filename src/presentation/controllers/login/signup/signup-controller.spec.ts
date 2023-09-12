import { SignUpController } from './signup-controller';
import { EmailInUseError, MissingParamError, ServerError } from '@/presentation/errors';
import {
  type AddAccount,
  type AddAccountModel,
  type AccountModel,
  type HttpRequest,
  type Validation,
  type Authentication,
  type AuthenticationModel
} from './signup-controller-protocols';
import { badRequest, forbidden, serverError } from '@/presentation/helpers/http/http-helper';

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      };
      return await new Promise((resolve) => {
        resolve(fakeAccount);
      });
    }
  }
  return new AddAccountStub();
};

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return await new Promise((resolve) => {
        resolve('any_token');
      });
    }
  }
  return new AuthenticationStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null;
    }
  }
  return new ValidationStub();
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
});

type SutTypes = {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
};

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();
  const authenticationStub = makeAuthentication();
  const sut = new SignUpController(
    addAccountStub,
    validationStub,
    authenticationStub
  );
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  };
};

describe('SignUp Controller', () => {
  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut();
    vi.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await Promise.reject(new Error());
    });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test('Should throw a generic error if throws an error that is not a instance of Error', async () => {
    const { sut, addAccountStub } = makeSut();
    vi.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      // eslint-disable-next-line prefer-promise-reject-errors
      return await Promise.reject(null);
    });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse.statusCode).toEqual(500);
    expect(httpResponse.body).toEqual(
      new ServerError('Error while handle signup')
    );
  });

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = vi.spyOn(addAccountStub, 'add');
    await sut.handle(makeFakeRequest());
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    });
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      accessToken: 'any_token'
    });
  });

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut();
    vi.spyOn(addAccountStub, 'add').mockReturnValueOnce(
      new Promise((resolve) => { resolve(null); })
    );
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
  });

  test('Should call Vialidation with correct value', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = vi.spyOn(validationStub, 'validate');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('Should return 400 if Validation returns a error', async () => {
    const { sut, validationStub } = makeSut();
    vi.spyOn(validationStub, 'validate').mockReturnValueOnce(
      new MissingParamError('any_field')
    );
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('any_field'))
    );
  });

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = vi.spyOn(authenticationStub, 'auth');
    await sut.handle(makeFakeRequest());
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password'
    });
  });

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut();
    vi.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error());
      })
    );
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
