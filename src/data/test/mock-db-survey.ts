import { mockSurveyModel, mockSurveysModel } from '@/domain/test/mock-survey';
import { type AddSurveyRepository } from '../protocols/db/survey/add-survey-repository';
import { type LoadSurveyById, type SurveyModel } from '../usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols';
import { type AddSurveyParams } from '../usecases/survey/add-survey/db-add-survey-protocols';
import { type LoadSurveysRepository } from '../protocols/db/survey/load-surveys-repository';

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (surveyData: AddSurveyParams): Promise<void> {
      await Promise.resolve();
    }
  }
  return new AddSurveyRepositoryStub();
};

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel | null> {
      return await Promise.resolve(mockSurveyModel());
    }
  }
  return new LoadSurveyByIdStub();
};

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return await Promise.resolve(mockSurveysModel());
    }
  }
  return new LoadSurveysRepositoryStub();
};
