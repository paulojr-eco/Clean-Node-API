import { mockSurveyResultModel } from '@/domain/test/mock-survey-result';
import { type SaveSurveyResultRepository } from '../protocols/db/survey-result/save-survey-result-repository';
import { type SaveSurveyResultParams, type SurveyResultModel } from '../usecases/survey-result/save-survey-result/db-save-survey-result-protocols';

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return await new Promise((resolve) => {
        resolve(mockSurveyResultModel());
      });
    }
  }
  return new SaveSurveyResultRepositoryStub();
};
