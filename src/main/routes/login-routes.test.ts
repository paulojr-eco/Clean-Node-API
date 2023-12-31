import request from 'supertest';
import app from '@/main/config/app';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { type Collection } from 'mongodb';
import { hash } from 'bcrypt';
import { waitForAppStart } from '../test/app-helper';

let accountCollection: Collection;

describe('Login Routes', () => {
  const cleanCollection = async (collectionName: string): Promise<void> => {
    accountCollection = await MongoHelper.getCollection(collectionName);
    await accountCollection.deleteMany({});
  };
  beforeAll(async () => {
    await MongoHelper.connect();

    await waitForAppStart();
    await cleanCollection('accounts');
  });

  afterAll(async () => {
    await cleanCollection('accounts');
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    await cleanCollection('accounts');
  });

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Paulo',
          email: 'paulo@mail.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(200);
    });
  });

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const password = await hash('123', 12);
      await accountCollection.insertOne({
        name: 'Paulo',
        email: 'paulo@mail.com',
        password
      });

      await request(app)
        .post('/api/login')
        .send({
          email: 'paulo@mail.com',
          password: '123'
        })
        .expect(200);
    });

    test('Should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'paulo@mail.com',
          password: '123'
        })
        .expect(401);
    });
  });
});
