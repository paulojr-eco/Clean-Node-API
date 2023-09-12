import { type Decrypter, type AccountModel, type LoadAccountByTokenRepository } from './db-load-account-by-token-protocols';
import { DbLoadAccountByToken } from './db-load-account-by-token';

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    decrypt (value: string): string {
      return 'any_value';
    }
  }
  return new DecrypterStub();
};

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
});

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub
  implements LoadAccountByTokenRepository {
    async loadByToken (
      token: string,
      role?: string | undefined
    ): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount());
    }
  }
  return new LoadAccountByTokenRepositoryStub();
};

type SutTypes = {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
};

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter();
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository();
  const sut = new DbLoadAccountByToken(
    decrypterStub,
    loadAccountByTokenRepositoryStub
  );
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub
  };
};

describe('DbLoadAccountByToken Usecase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut();
    const decryptSpy = vi.spyOn(decrypterStub, 'decrypt');
    await sut.load('any_token', 'any_role');
    expect(decryptSpy).toHaveBeenCalledWith('any_token');
  });

  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut();
    vi.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(
      await Promise.resolve(null)
    );
    const account = await sut.load('any_token');
    expect(account).toBeNull();
  });

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    const loadByTokenSpy = vi.spyOn(
      loadAccountByTokenRepositoryStub,
      'loadByToken'
    );
    await sut.load('any_token', 'any_role');
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role');
  });

  test('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    vi.spyOn(
      loadAccountByTokenRepositoryStub,
      'loadByToken'
    ).mockReturnValueOnce(
      new Promise((resolve) => {
        resolve(null);
      })
    );
    const account = await sut.load('any_token', 'any_role');
    expect(account).toBeNull();
  });

  test('Should return an account on success', async () => {
    const { sut } = makeSut();
    const account = await sut.load('any_token', 'any_role');
    expect(account).toEqual(makeFakeAccount());
  });

  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut();
    vi.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.load('any_token', 'any_role');
    await expect(promise).rejects.toThrow();
  });

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    vi.spyOn(
      loadAccountByTokenRepositoryStub,
      'loadByToken'
    ).mockReturnValueOnce(
      new Promise((resolve, reject) => { reject(new Error()); })
    );
    const promise = sut.load('any_token', 'any_role');
    await expect(promise).rejects.toThrow();
  });
});
