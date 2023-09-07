import request from 'supertest';
import app from 'main/config/app';
import { MongoHelper } from 'infra/db/mongodb/helpers/mongo-helper';
import { type Collection } from 'mongodb';

let surveyCollection: Collection;

describe('Survey Routes', () => {
  const cleanCollection = async (collectionName: string): Promise<void> => {
    surveyCollection = await MongoHelper.getCollection(collectionName);
    await surveyCollection.deleteMany({});
  };
  beforeAll(async () => {
    await MongoHelper.connect();
  });

  afterAll(async () => {
    await cleanCollection('surveys');
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    await cleanCollection('surveys');
  });

  describe('POST /surveys', () => {
    test.concurrent(
      'Should return 204 on add survey success',
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await request(app)
          .post('/api/surveys')
          .send({
            question: 'Question',
            answers: [{
              answer: 'Answer 1',
              image: 'http://image-name.com'
            }, {
              answer: 'Answer 2'
            }]
          })
          .expect(204);
      },
      10000
    );
  });
});
