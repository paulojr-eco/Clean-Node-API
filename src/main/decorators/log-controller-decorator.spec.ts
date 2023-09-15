import {
  type HttpResponse,
  type Controller,
  type HttpRequest
} from '@/presentation/protocols';
import { LogControllerDecorator } from './log-controller-decorator';
import {
  serverError,
  successful
} from '@/presentation/helpers/http/http-helper';
import { type LogErrorRepository } from '@/data/protocols/db/log/log-error-repository';
import { mockAccountModel } from '@/domain/test';
import { mockLogErrorRepository } from '@/data/test';

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await Promise.resolve(successful(mockAccountModel()));
    }
  }
  return new ControllerStub();
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
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
};

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = mockLogErrorRepository();
  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub
  );
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  };
};

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = vi.spyOn(controllerStub, 'handle');
    await sut.handle(makeFakeRequest());
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest());
  });

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(successful(mockAccountModel()));
  });

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const fakeError = new Error();
    fakeError.stack = 'any_stack';
    const error = serverError(fakeError);
    const logPsy = vi.spyOn(logErrorRepositoryStub, 'logError');
    vi.spyOn(controllerStub, 'handle').mockReturnValueOnce(
      Promise.resolve(error)
    );
    await sut.handle(makeFakeRequest());
    expect(logPsy).toHaveBeenCalledWith('any_stack');
  });
});
