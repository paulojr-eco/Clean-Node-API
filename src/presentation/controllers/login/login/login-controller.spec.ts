import { LoginController } from './login-controller';
import {
  badRequest,
  serverError,
  successful,
  unauthorized
} from '@/presentation/helpers/http/http-helper';
import { MissingParamError, ServerError } from '@/presentation/errors';
import { mockAuthentication, mockValidation } from '@/presentation/test';
import {
  type HttpRequest,
  type Authentication,
  type Validation
} from './login-controller-protocols';
import { throwError } from '@/domain/test';

const mockRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
});

type SutTypes = {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
};

const makeSut = (): SutTypes => {
  const authenticationStub = mockAuthentication();
  const validationStub = mockValidation();
  const sut = new LoginController(authenticationStub, validationStub);
  return { sut, authenticationStub, validationStub };
};

describe('Login Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = vi.spyOn(authenticationStub, 'auth');
    await sut.handle(mockRequest());
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password'
    });
  });

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut();
    vi.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
      Promise.resolve(null)
    );
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(unauthorized());
  });

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut();
    vi.spyOn(authenticationStub, 'auth').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 200 if valid credential are provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(successful({ accessToken: 'any_token' }));
  });

  test('Should call Vialidation with correct value', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = vi.spyOn(validationStub, 'validate');
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('Should return 400 if Validation returns a error', async () => {
    const { sut, validationStub } = makeSut();
    vi.spyOn(validationStub, 'validate').mockReturnValueOnce(
      new MissingParamError('any_field')
    );
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('any_field'))
    );
  });

  test('Should throw a generic error if LoginController throws an error that is not a instance of Error', async () => {
    const { sut, authenticationStub } = makeSut();
    vi.spyOn(authenticationStub, 'auth').mockImplementationOnce(async () => {
      // eslint-disable-next-line prefer-promise-reject-errors
      return await Promise.reject(null);
    });
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse.statusCode).toEqual(500);
    expect(httpResponse.body).toEqual(
      new ServerError('Error while handle login')
    );
  });
});
