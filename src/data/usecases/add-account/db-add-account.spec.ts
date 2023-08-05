import { type Encrypter } from './ad-add-account-protocols';
import { DbAddAccount } from './db-add-account';

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise((resolve) => {
        resolve('hashed_password');
      });
    }
  }
  return new EncrypterStub();
};

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const sut = new DbAddAccount(encrypterStub);
  return {
    sut,
    encrypterStub
  };
};

describe('DBAddAccount Usecase', () => {
  test('Shoud call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = vi.spyOn(encrypterStub, 'encrypt');
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    };
    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });

  test('Shoud throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();
    vi.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()); }));
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    };
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });
});