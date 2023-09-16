import request from 'supertest';
import app from '@/main/config/app';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { type Collection } from 'mongodb';
import { sign } from 'jsonwebtoken';
import env from '@/main/config/env';
import { waitForAppStart } from '../test/app-helper';

let surveyCollection: Collection;
let accountCollection: Collection;

const makeAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Paulo',
    email: 'paulo@mail.com',
    password: '123',
    role: 'admin'
  });
  const id = res.insertedId;
  const accessToken = sign({ id }, env.jwtSecret);
  await accountCollection.updateOne(
    {
      _id: id
    },
    {
      $set: {
        accessToken
      }
    }
  );
  return accessToken;
};

describe('Survey Routes', () => {
  const resetCollections = async (): Promise<void> => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    accountCollection = await MongoHelper.getCollection('accounts');
    await surveyCollection.deleteMany({});
    await accountCollection.deleteMany({});
  };
  beforeAll(async () => {
    await MongoHelper.connect();

    await waitForAppStart();
  });

  afterAll(async () => {
    await resetCollections();
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    await resetCollections();

    await waitForAppStart();
  });

  describe('POST /surveys', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [
            {
              answer: 'Answer 1',
              image: 'http://image-name.com'
            },
            {
              answer: 'Answer 2'
            }
          ]
        })
        .expect(403);
    });

    test('Should return 204 on add survey with valid accessToken', async () => {
      const accessToken = await makeAccessToken();
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [
            {
              answer: 'Answer 1',
              image: 'http://image-name.com'
            },
            {
              answer: 'Answer 2'
            }
          ]
        })
        .expect(204);
    });
  });

  describe('GET /surveys', () => {
    test('Should return 403 on load survey without accessToken', async () => {
      await request(app).get('/api/surveys').expect(403);
    });

    test('Should return 204 on load surveys with valid accessToken', async () => {
      const accessToken = await makeAccessToken();
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(204);
    });
  });
});
