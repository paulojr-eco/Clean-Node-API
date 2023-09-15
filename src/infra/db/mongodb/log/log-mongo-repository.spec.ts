import { type Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { LogMongoRepository } from './log-mongo-repository';

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository();
};

describe('Log Mongo Repository', () => {
  let errorCollection: Collection;

  const cleanCollection = async (collectionName: string): Promise<void> => {
    const collection = await MongoHelper.getCollection(collectionName);
    await collection.deleteMany({});
  };
  beforeAll(async () => {
    await MongoHelper.connect();
  });

  afterAll(async () => {
    await cleanCollection('errors');
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors');
    await cleanCollection('errors');
  });
  test('Should create an error log on success', async () => {
    const sut = makeSut();
    await sut.logError('any_error');
    const count = await errorCollection.countDocuments();
    expect(count).toBe(1);
  });
});
