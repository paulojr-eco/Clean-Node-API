import { DbAuthentication } from './db-authentication';
import {
  type LoadAccountByEmailRepository,
  type AccountModel,
  type AuthenticationModel,
  type HashComparer,
  type TokenGenerator,
  type UpdateAccessTokenRepository
} from './db-authentication-protocols';

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
});

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
  implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      return await new Promise((resolve) => {
        resolve(makeFakeAccount());
      });
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return await new Promise((resolve) => {
        resolve(true);
      });
    }
  }
  return new HashComparerStub();
};

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (id: string): Promise<string> {
      return await new Promise((resolve) => {
        resolve('any_token');
      });
    }
  }
  return new TokenGeneratorStub();
};

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdatedAccessTokenRepositoryStub
  implements UpdateAccessTokenRepository {
    async update (id: string, token: string): Promise<void> {
      await new Promise<void>((resolve) => {
        resolve();
      });
    }
  }
  return new UpdatedAccessTokenRepositoryStub();
};

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
});

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  tokenGeneratorStub: TokenGenerator
  updatedAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashComparerStub = makeHashComparer();
  const tokenGeneratorStub = makeTokenGenerator();
  const updatedAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updatedAccessTokenRepositoryStub
  );
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updatedAccessTokenRepositoryStub
  };
};

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = vi.spyOn(loadAccountByEmailRepositoryStub, 'load');
    await sut.auth(makeFakeAuthentication());
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    vi.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(
      Promise.reject(new Error())
    );
    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    vi.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(
      Promise.resolve(null)
    );
    const acessToken = await sut.auth(makeFakeAuthentication());
    expect(acessToken).toBeNull();
  });

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut();
    const compareSpy = vi.spyOn(hashComparerStub, 'compare');
    await sut.auth(makeFakeAuthentication());
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password');
  });

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut();
    vi.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
      Promise.reject(new Error())
    );
    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut();
    vi.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
      Promise.resolve(false)
    );
    const acessToken = await sut.auth(makeFakeAuthentication());
    expect(acessToken).toBeNull();
  });

  test('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    const generateSpy = vi.spyOn(tokenGeneratorStub, 'generate');
    await sut.auth(makeFakeAuthentication());
    expect(generateSpy).toHaveBeenCalledWith('any_id');
  });

  test('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    vi.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(
      Promise.reject(new Error())
    );
    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });

  test('Should call TokenGenerator with correct id', async () => {
    const { sut } = makeSut();
    const accessToken = await sut.auth(makeFakeAuthentication());
    expect(accessToken).toBe('any_token');
  });

  test('Should call UpdateAcessTokenRepository with correct values', async () => {
    const { sut, updatedAccessTokenRepositoryStub } = makeSut();
    const updateSpy = vi.spyOn(updatedAccessTokenRepositoryStub, 'update');
    await sut.auth(makeFakeAuthentication());
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token');
  });

  test('Should throw if UpdateAcessTokenRepository throws', async () => {
    const { sut, updatedAccessTokenRepositoryStub } = makeSut();
    vi.spyOn(updatedAccessTokenRepositoryStub, 'update').mockReturnValueOnce(
      Promise.reject(new Error())
    );
    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });
});
