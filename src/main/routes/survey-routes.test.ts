import request from 'supertest';
import app from 'main/config/app';
import { MongoHelper } from 'infra/db/mongodb/helpers/mongo-helper';
import { type Collection } from 'mongodb';
import { sign } from 'jsonwebtoken';
import env from 'main/config/env';

let surveyCollection: Collection;
let accountCollection: Collection;

describe('Survey Routes', () => {
  const resetCollections = async (): Promise<void> => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    accountCollection = await MongoHelper.getCollection('accounts');
    await surveyCollection.deleteMany({});
    await accountCollection.deleteMany({});
  };
  beforeAll(async () => {
    await MongoHelper.connect();
  });

  afterAll(async () => {
    await resetCollections();
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    await resetCollections();
  });

  describe('POST /surveys', () => {
    test.concurrent(
      'Should return 403 on add survey without accessToken',
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 5000));
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
      },
      10000
    );

    test('Should return 204 on add survey with valid accessToken', async () => {
      const res = await accountCollection.insertOne({
        name: 'Paulo',
        email: 'paulo@mail.com',
        password: '123',
        role: 'admin'
      });
      const id = res.insertedId;
      console.log('id:', id);
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
});
