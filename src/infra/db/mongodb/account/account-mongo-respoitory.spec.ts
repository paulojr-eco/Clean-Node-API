import { ObjectId, type Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account-mongo-respoitory';
import { type AddAccountModel } from '../../../../domain/usecases/add-account';

let accountCollection: Collection;

const makeFakeAccount = (): AddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
});

describe('Account Mongo Repository', () => {
  const cleanCollection = async (collectionName: string): Promise<void> => {
    accountCollection = await MongoHelper.getCollection(collectionName);
    await accountCollection.deleteMany({});
  };

  beforeAll(async () => {
    await MongoHelper.connect();
  });

  afterAll(async () => {
    await cleanCollection('accounts');
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    await cleanCollection('accounts');
  });

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository();
  };

  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const sut = makeSut();
      const account = await sut.add(makeFakeAccount());
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe('any_name');
      expect(account.email).toBe('any_email@mail.com');
      expect(account.password).toBe('any_password');
    });
  });

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut();
      await accountCollection.insertOne(makeFakeAccount());
      const account = await sut.loadByEmail('any_email@mail.com');
      expect(account).toBeTruthy();
      expect(account?.id).toBeTruthy();
      expect(account?.name).toBe('any_name');
      expect(account?.email).toBe('any_email@mail.com');
      expect(account?.password).toBe('any_password');
    });

    test('Should return null if loadByEmail fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByEmail('any_email@mail.com');
      expect(account).toBeFalsy();
    });
  });

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut();
      await accountCollection.insertOne(makeFakeAccount());
      let res = await accountCollection.findOne(makeFakeAccount());
      let account = MongoHelper.map(res);
      expect(account.accessToken).toBeFalsy();
      await sut.updateAccessToken(account.id, 'any_token');
      res = await accountCollection.findOne({ _id: new ObjectId(account.id) });
      account = MongoHelper.map(res);
      expect(account).toBeTruthy();
      expect(account.accessToken).toBe('any_token');
    });
  });
});
