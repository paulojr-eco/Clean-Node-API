import { type Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { SurveyMongoRepository } from './survey-mongo-repository';
import { mockAddSurveyParams } from '@/domain/test/mock-survey';

let surveyCollection: Collection;

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository();
};

describe('Survey Mongo Repository', () => {
  const cleanCollection = async (collectionName: string): Promise<void> => {
    surveyCollection = await MongoHelper.getCollection(collectionName);
    await surveyCollection.deleteMany({});
  };

  beforeAll(async () => {
    await MongoHelper.connect();

    await cleanCollection('surveys');
  });

  afterAll(async () => {
    await cleanCollection('surveys');
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    await cleanCollection('surveys');
  });

  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut();
      await sut.add(mockAddSurveyParams());
      const survey = await surveyCollection.findOne({
        question: 'any_question'
      });
      expect(survey).toBeTruthy();
    });
  });

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      await surveyCollection.insertMany([
        {
          question: 'any_question',
          answers: [
            {
              image: 'any_image',
              answer: 'any_answer'
            }
          ],
          date: new Date()
        },
        {
          question: 'other_question',
          answers: [
            {
              image: 'other_image',
              answer: 'other_answer'
            }
          ],
          date: new Date()
        }
      ]);
      const sut = makeSut();
      const surveys = await sut.loadAll();
      expect(surveys.length).toBe(2);
      expect(surveys[0].id).toBeTruthy();
      expect(surveys[0].question).toBe('any_question');
      expect(surveys[1].question).toBe('other_question');
    });

    test('Should load empty list', async () => {
      const sut = makeSut();
      const surveys = await sut.loadAll();
      expect(surveys.length).toBe(0);
    });
  });

  describe('loadById()', () => {
    test('Should load survey by id on success', async () => {
      const res = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer'
          }
        ],
        date: new Date()
      });
      const sut = makeSut();
      const survey = await sut.loadById(res.insertedId.toString());
      expect(survey).toBeTruthy();
    });

    test('Should return null if survey id does not exists ', async () => {
      const invalidId = '000000000000000000000000';
      const sut = makeSut();
      const survey = await sut.loadById(invalidId);
      expect(survey).toBeNull();
    });
  });
});
