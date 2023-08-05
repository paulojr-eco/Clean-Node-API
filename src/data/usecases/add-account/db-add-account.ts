import {
  type AddAccount,
  type AddAccountModel,
  type AccountModel,
  type Encrypter
} from './ad-add-account-protocols';

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter;
  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter;
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password);
    return await new Promise((resolve) => {
      resolve({ id: '', name: '', email: '', password: '' });
    });
  }
}