import jwt from 'jsonwebtoken';
import { JwtAdapter } from './jwt-adapter';

describe('Jwt Adapter', () => {
  test('Should call sign with correct values', async () => {
    const sut = new JwtAdapter('secret');
    const signSpy = vi.spyOn(jwt, 'sign');
    sut.encrypt('any_id');
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret');
  });
});
