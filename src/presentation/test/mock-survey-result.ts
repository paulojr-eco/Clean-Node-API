import { mockSurveyResultModel } from '@/domain/test/mock-survey-result';
import {
  type SaveSurveyResult,
  type SaveSurveyResultParams,
  type SurveyResultModel
} from '../controllers/survey-result/save-survey-result/save-survey-result-controller-protocols';

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return await new Promise((resolve) => {
        resolve(mockSurveyResultModel());
      });
    }
  }
  return new SaveSurveyResultStub();
};
