import {
  type AccountModel,
  type AddAccountModel,
  type Encrypter,
  type AddAccountRepository
} from './ad-add-account-protocols';
import { DbAddAccount } from './db-add-account';

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

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password'
      };
      return await new Promise((resolve) => {
        resolve(fakeAccount);
      });
    }
  }
  return new AddAccountRepositoryStub();
};

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
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
    vi.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error());
      })
    );
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    };
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  test('Shoud call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = vi.spyOn(addAccountRepositoryStub, 'add');
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    };
    await sut.add(accountData);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    });
  });

  test('Shoud throw if Repository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    vi.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error());
      })
    );
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    };
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });
});
