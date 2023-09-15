import { AccessDeniedError } from '@/presentation/errors/access-denied-error';
import {
  forbidden,
  serverError,
  successful
} from 'presentation/helpers/http/http-helper';
import { AuthMiddleware } from './auth-middleware';
import {
  type LoadAccountByToken,
  type HttpRequest
} from './auth-middleware-protocols';
import { throwError } from '@/domain/test';
import { mockLoadAccountByToken } from '../test';

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  }
});

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
};

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = mockLoadAccountByToken();
  const sut = new AuthMiddleware(loadAccountByTokenStub, role);
  return {
    sut,
    loadAccountByTokenStub
  };
};

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const role = 'any_role';
    const { sut, loadAccountByTokenStub } = makeSut(role);
    const loadSpy = vi.spyOn(loadAccountByTokenStub, 'load');
    await sut.handle(makeFakeRequest());
    expect(loadSpy).toHaveBeenCalledWith('any_token', role);
  });

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    vi.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(
      Promise.resolve(null)
    );
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(successful({ accountId: 'any_id' }));
  });

  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    vi.spyOn(loadAccountByTokenStub, 'load').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should throw a generic error if LoadAccountByTokenStub throws an error that is not a instance of Error', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    vi.spyOn(loadAccountByTokenStub, 'load').mockImplementationOnce(
      async () => {
        // eslint-disable-next-line prefer-promise-reject-errors
        return await Promise.reject(null);
      }
    );
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(
      serverError(new Error('Error while handle auth middleware'))
    );
  });
});
