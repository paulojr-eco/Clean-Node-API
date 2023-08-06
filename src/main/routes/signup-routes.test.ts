import request from 'supertest';
import app from 'main/config/app';
import { MongoHelper } from 'infra/db/mongodb/helpers/mongo-helper';

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect();
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  test('Should return an account on success', async () => {
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
