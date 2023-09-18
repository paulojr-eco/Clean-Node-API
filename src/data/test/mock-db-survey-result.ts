import { mockSurveyResultModel } from '@/domain/test/mock-survey-result';
import { type SaveSurveyResultRepository } from '../protocols/db/survey-result/save-survey-result-repository';
import { type SaveSurveyResultParams, type SurveyResultModel } from '../usecases/survey-result/save-survey-result/db-save-survey-result-protocols';
import { type LoadSurveyResultRepository } from '../protocols/db/survey-result/load-survey-result-repository';
import { type LoadSurveyByIdRepository } from '../protocols/db/survey/load-survey-by-id-repository';
import { type SurveyModel } from '../usecases/survey/load-surveys/db-load-surveys-protocols';
import { mockSurveyModel } from '@/domain/test';

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultParams): Promise<void> {
      await Promise.resolve();
    }
  }
  return new SaveSurveyResultRepositoryStub();
};

export const mockLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
      return await Promise.resolve(mockSurveyResultModel());
    }
  }
  return new LoadSurveyResultRepositoryStub();
};

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel | null> {
      return await Promise.resolve(mockSurveyModel());
    }
  }

  return new LoadSurveyByIdRepositoryStub();
};
