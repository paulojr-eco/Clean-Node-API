import { type AccountMongoRepository } from 'infra/db/mongodb/account/account-mongo-respoitory';
import {
  type AddAccount,
  type AddAccountModel,
  type AccountModel,
  type Hasher
} from './ad-add-account-protocols';

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly accountRepository: AccountMongoRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<AccountModel | null> {
    const account = await this.accountRepository.loadByEmail(
      accountData.email
    );
    if (!account) {
      const hashedPassword = await this.hasher.hash(accountData.password);
      const newAccount = await this.accountRepository.add({
        ...accountData,
        password: hashedPassword
      });
      return newAccount;
    }
    return null;
  }
}
