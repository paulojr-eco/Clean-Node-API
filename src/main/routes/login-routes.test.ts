import request from 'supertest';
import app from 'main/config/app';
import { MongoHelper } from 'infra/db/mongodb/helpers/mongo-helper';

describe('Login Routes', () => {
  const cleanCollection = async (collectionName: string): Promise<void> => {
    const collection = await MongoHelper.getCollection(collectionName);
    await collection.deleteMany({});
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

  describe('/POST signup', () => {
    test('Should return 200 on signup', async () => {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      setTimeout(async () => {
        await request(app)
          .post('/api/signup')
          .send({
            name: 'Paulo',
            email: 'paulo@mail.com',
            password: '123',
            passwordConfirmation: '123'
          })
          .expect(200);
      }, 3000);
    });
  });
});
