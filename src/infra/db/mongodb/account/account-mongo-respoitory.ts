import { type AddAccountModel } from 'domain/usecases/add-account';
import { type AddAccountRepository } from 'data/protocols/db/account/add-account-repository';
import { type AccountModel } from 'domain/models/account';
import { MongoHelper } from '../helpers/mongo-helper';
import { type LoadAccountByEmailRepository, type UpdateAccessTokenRepository } from 'data/usecases/authenticantion/db-authentication-protocols';
import { ObjectId } from 'mongodb';

export class AccountMongoRepository
implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository {
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

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const userId = new ObjectId(id);
    await accountCollection.updateOne(
      {
        _id: userId
      },
      {
        $set: {
          accessToken: token
        }
      }
    );
  }
}