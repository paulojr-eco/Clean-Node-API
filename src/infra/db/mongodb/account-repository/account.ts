import { type AddAccountModel } from 'domain/usecases/add-account';
import { type AddAccountRepository } from 'data/protocols/db/add-account-repository';
import { type AccountModel } from 'domain/models/account';
import { MongoHelper } from '../helpers/mongo-helper';
import { type LoadAccountByEmailRepository } from 'data/protocols/db/load-account-by-email-repository';

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.insertOne(accountData);
    const account = await accountCollection.findOne(accountData);
    return MongoHelper.map(account);
  }

  async loadByEmail (email: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne({ email });
    return account && MongoHelper.map(account);
  }
}
