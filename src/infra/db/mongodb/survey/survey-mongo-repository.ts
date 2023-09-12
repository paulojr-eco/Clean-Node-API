import { type SurveyModel } from '@/domain/models/survey';
import {
  type AddSurveyModel,
  type AddSurveyRepository
} from '@/data/usecases/survey/add-survey/db-add-survey-protocols';
import { MongoHelper } from '../helpers/mongo-helper';
import { type LoadSurveysRepository } from '@/data/usecases/survey/load-surveys/db-load-surveys-protocols';
import { type LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository';
import { ObjectId } from 'mongodb';

export class SurveyMongoRepository
implements
    AddSurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.insertOne(surveyData);
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const surveys = await surveyCollection.find().toArray();
    return MongoHelper.mapCollection(surveys);
  }

  async loadById (id: string): Promise<SurveyModel | null> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const result = await surveyCollection.findOne({ _id: new ObjectId(id) });
    if (result) {
      const survey = MongoHelper.map(result);
      return survey;
    }
    return null;
  }
}
