import { type AddAccountRepository } from '@/data/protocols/db/account/add-account-repository';
import { type AddAccountParams } from '@/domain/usecases/account/add-account';
import { type AccountModel } from '@/domain/models/account';
import {
  type LoadAccountByEmailRepository,
  type UpdateAccessTokenRepository
} from '@/data/usecases/account/authenticantion/db-authentication-protocols';
import { MongoHelper } from '../helpers/mongo-helper';
import { ObjectId } from 'mongodb';
import { type LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository';

export class AccountMongoRepository
implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository,
    LoadAccountByTokenRepository {
  async add (accountData: AddAccountParams): Promise<AccountModel> {
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

  async loadByToken (
    token: string,
    role?: string | undefined
  ): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne({
      accessToken: token,
      $or: [{
        role
      }, {
        role: 'admin'
      }]
    });
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
