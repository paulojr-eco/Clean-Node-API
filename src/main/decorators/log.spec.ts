import {
  type HttpResponse,
  type Controller,
  type HttpRequest
} from 'presentation/protocols';
import { LogControllerDecorator } from './log';

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    class ControllerStub implements Controller {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse: HttpResponse = {
          statusCode: 200,
          body: {}
        };
        return await new Promise((resolve) => {
          resolve(httpResponse);
        });
      }
    }
    const controllerStub = new ControllerStub();
    const handleSpy = vi.spyOn(controllerStub, 'handle');
    const sut = new LogControllerDecorator(controllerStub);
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });
});
