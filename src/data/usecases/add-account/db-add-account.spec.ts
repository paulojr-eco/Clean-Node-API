import { type AccountMongoRepository } from 'infra/db/mongodb/account/account-mongo-respoitory';
import {
  type AccountModel,
  type AddAccountModel,
  type Hasher
} from './ad-add-account-protocols';
import { DbAddAccount } from './db-add-account';

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise((resolve) => {
        resolve('hashed_password');
      });
    }
  }
  return new HasherStub();
};

const makeAccountMongoRepository = (): AccountMongoRepository => {
  class AccountMongoRepositoryStub implements AccountMongoRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {}

    async add (accountData: AddAccountModel): Promise<AccountModel> {
      return await new Promise((resolve) => {
        resolve(makeFakeAccount());
      });
    }

    async loadByEmail (email: string): Promise<AccountModel | null> {
      return await new Promise((resolve) => {
        resolve(null);
      });
    }
  }
  return new AccountMongoRepositoryStub();
};

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
});

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
});

interface SutTypes {
  sut: DbAddAccount
  hasherStub: Hasher
  accountMongoRepositoryStub: AccountMongoRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher();
  const accountMongoRepositoryStub = makeAccountMongoRepository();
  const sut = new DbAddAccount(
    hasherStub,
    accountMongoRepositoryStub
  );
  return {
    sut,
    hasherStub,
    accountMongoRepositoryStub
  };
};

describe('DBAddAccount Usecase', () => {
  test('Shoud call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut();
    const hashSpy = vi.spyOn(hasherStub, 'hash');
    await sut.add(makeFakeAccountData());
    expect(hashSpy).toHaveBeenCalledWith('valid_password');
  });

  test('Shoud throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut();
    vi.spyOn(hasherStub, 'hash').mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error());
      })
    );
    const promise = sut.add(makeFakeAccountData());
    await expect(promise).rejects.toThrow();
  });

  test('Shoud call AddAccountRepository with correct values', async () => {
    const { sut, accountMongoRepositoryStub } = makeSut();
    const addSpy = vi.spyOn(accountMongoRepositoryStub, 'add');
    await sut.add(makeFakeAccountData());
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    });
  });

  test('Shoud throw if Repository throws', async () => {
    const { sut, accountMongoRepositoryStub } = makeSut();
    vi.spyOn(accountMongoRepositoryStub, 'add').mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error());
      })
    );
    const promise = sut.add(makeFakeAccountData());
    await expect(promise).rejects.toThrow();
  });

  test('Shoud return an account on success', async () => {
    const { sut } = makeSut();
    const account = await sut.add(makeFakeAccountData());
    expect(account).toEqual(makeFakeAccount());
  });

  test('Should return null if LoadAccountByEmailRepository find an exist email', async () => {
    const { sut, accountMongoRepositoryStub } = makeSut();
    vi.spyOn(
      accountMongoRepositoryStub,
      'loadByEmail'
    ).mockReturnValueOnce(
      new Promise((resolve) => {
        resolve(makeFakeAccount());
      })
    );
    const account = await sut.add(makeFakeAccountData());
    expect(account).toBeNull();
  });

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, accountMongoRepositoryStub } = makeSut();
    const loadSpy = vi.spyOn(accountMongoRepositoryStub, 'loadByEmail');
    await sut.add(makeFakeAccountData());
    expect(loadSpy).toHaveBeenCalledWith('valid_email@mail.com');
  });
});
