import jwt from 'jsonwebtoken';
import { JwtAdapter } from './jwt-adapter';

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret');
};

describe('Jwt Adapter', () => {
  describe('sign()', () => {
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

  describe('verify()', () => {
    test('Should call verify with correct values', () => {
      const sut = makeSut();
      const verifySpy = vi.spyOn(jwt, 'verify').mockImplementationOnce((): string | null => {
        return 'any_value';
      });
      sut.decrypt('any_token');
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret');
    });

    test('Should return a value on verify success', () => {
      const sut = makeSut();
      vi.spyOn(jwt, 'verify').mockImplementationOnce((): string | null => {
        return 'any_value';
      });
      const value = sut.decrypt('any_token');
      expect(value).toBe('any_value');
    });

    test('Should throw if verify throws', async () => {
      const sut = makeSut();
      vi.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error();
      });
      const decryptCall = (): string | null => sut.decrypt('any_token');
      expect(decryptCall).toThrowError();
    });
  });
});
