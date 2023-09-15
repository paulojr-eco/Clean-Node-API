import {
  type Authentication,
  type AuthenticationParams
} from '@/domain/usecases/account/authentication';
import { type AccountModel, type LoadAccountByToken } from '../middlewares/auth-middleware-protocols';
import { mockAccountModel } from '@/domain/test';

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationParams): Promise<string> {
      return await new Promise((resolve) => {
        resolve('any_token');
      });
    }
  }
  return new AuthenticationStub();
};

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (
      accessToken: string,
      role?: string | undefined
    ): Promise<AccountModel | null> {
      return await new Promise((resolve) => {
        resolve(mockAccountModel());
      });
    }
  }
  return new LoadAccountByTokenStub();
};
