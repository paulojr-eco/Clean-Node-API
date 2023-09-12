import { type Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { SurveyResultMongoRepository } from './survey-result-mongo-repository';
import { type SurveyModel } from '@/domain/models/survey';
import { type AccountModel } from '@/domain/models/account';

let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository();
};

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      },
      {
        answer: 'other_answer'
      }
    ],
    date: new Date()
  }
  );
  const survey = await surveyCollection.findOne({ _id: res.insertedId });
  return MongoHelper.map(survey);
};

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  });
  const account = await accountCollection.findOne({ _id: res.insertedId });
  return MongoHelper.map(account);
};

describe('Survey Mongo Repository', () => {
  const cleanCollections = async (): Promise<void> => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});
    surveyResultCollection = await MongoHelper.getCollection('surveyResults');
    await surveyResultCollection.deleteMany({});
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  };

  beforeAll(async () => {
    await MongoHelper.connect();
  });

  afterAll(async () => {
    await cleanCollections();
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    await cleanCollections();
  });

  describe('save()', () => {
    test('Should add a survey if its new', async () => {
      const sut = makeSut();
      const survey = await makeSurvey();
      const account = await makeAccount();
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      });
      expect(surveyResult).toBeTruthy();
      expect(surveyResult.id).toBeTruthy();
      expect(surveyResult.answer).toBe(survey.answers[0].answer);
    });
  });
});
