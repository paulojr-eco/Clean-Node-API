import { type Decrypter } from 'data/protocols/criptography/decrypter';
import { DbLoadAccountByToken } from './db-load-account-by-token';

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
}

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    decrypt (value: string): string {
      return 'any_value';
    }
  }
  return new DecrypterStub();
};

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter();
  const sut = new DbLoadAccountByToken(decrypterStub);
  return {
    sut,
    decrypterStub
  };
};

describe('DbLoadAccountByToken Usecase', () => {
  test('Shoudl call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut();
    const decryptSpy = vi.spyOn(decrypterStub, 'decrypt');
    await sut.load('any_token', 'any_role');
    expect(decryptSpy).toHaveBeenCalledWith('any_token');
  });

  test('Shoudl return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut();
    vi.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(
      await Promise.resolve(null)
    );
    const account = await sut.load('any_token');
    expect(account).toBeNull();
  });
});
