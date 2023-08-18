import jwt from 'jsonwebtoken';
import { JwtAdapter } from './jwt-adapter';

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret');
};

describe('Jwt Adapter', () => {
  test('Should call sign with correct values', () => {
    const sut = makeSut();
    const signSpy = vi.spyOn(jwt, 'sign');
    sut.encrypt('any_id');
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret');
  });

  test('Should return a token on sign success', () => {
    const sut = makeSut();
    vi.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      return 'any_token';
    });
    const accessToken = sut.encrypt('any_id');
    expect(accessToken).toBe('any_token');
  });

  test('Should throw if sign throws', async () => {
    const sut = makeSut();
    vi.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error();
    });
    const encryptCall = (): string => sut.encrypt('any_id');
    expect(encryptCall).toThrowError();
  });
});