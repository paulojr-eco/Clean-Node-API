import { mockAccountModel } from '@/domain/test';
import { type AddAccountRepository } from '../protocols/db/account/add-account-repository';
import {
  type AddAccount,
  type AccountModel,
  type AddAccountParams,
  type LoadAccountByEmailRepository
} from '../usecases/account/add-account/db-add-account-protocols';
import { type LoadAccountByTokenRepository } from '../protocols/db/account/load-account-by-token-repository';
import { type UpdateAccessTokenRepository } from '../protocols/db/account/update-access-token-repository';

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountParams): Promise<AccountModel> {
      return await new Promise((resolve) => {
        resolve(mockAccountModel());
      });
    }
  }
  return new AddAccountRepositoryStub();
};

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return await new Promise((resolve) => {
        resolve(mockAccountModel());
      });
    }
  }
  return new AddAccountStub();
};

export const mockLoadAccountByEmailRepository =
  (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
      async loadByEmail (email: string): Promise<AccountModel> {
        return await new Promise((resolve) => {
          resolve(mockAccountModel());
        });
      }
    }
    return new LoadAccountByEmailRepositoryStub();
  };

export const mockLoadAccountByTokenRepository =
  (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub
    implements LoadAccountByTokenRepository {
      async loadByToken (
        token: string,
        role?: string | undefined
      ): Promise<AccountModel> {
        return await Promise.resolve(mockAccountModel());
      }
    }
    return new LoadAccountByTokenRepositoryStub();
  };

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdatedAccessTokenRepositoryStub
  implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {
      await new Promise<void>((resolve) => {
        resolve();
      });
    }
  }
  return new UpdatedAccessTokenRepositoryStub();
};
