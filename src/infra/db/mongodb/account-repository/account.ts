import { type AddAccountModel } from 'domain/usecases/add-account';
import { type AddAccountRepository } from 'data/protocols/add-account-repository';
import { type AccountModel } from 'domain/models/account';
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.insertOne(accountData);
    const account = await accountCollection.findOne(accountData);
    if (account) {
      return MongoHelper.map(account);
    } else {
      throw new Error();
    }
  }
}
