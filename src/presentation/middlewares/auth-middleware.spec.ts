import { AccessDeniedError } from 'presentation/errors/access-denied-error';
import { forbidden } from 'presentation/helpers/http/http-helper';
import { AuthMiddleware } from './auth-middleware';

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const sut = new AuthMiddleware();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });
});
