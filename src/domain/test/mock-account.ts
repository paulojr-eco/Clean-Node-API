import { type AccountModel } from '../models/account';
import { type AddAccountParams } from '../usecases/account/add-account';
import { type AuthenticationParams } from '../usecases/account/authentication';

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
});

export const mockAccountModel = (): AccountModel =>
  Object.assign({}, mockAddAccountParams(), {
    id: 'any_id'
  });

export const mockAuthentication = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_password'
});
