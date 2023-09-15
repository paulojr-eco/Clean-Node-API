import { mockSurveysModel } from '@/domain/test/mock-survey';
import {
  type AddSurvey,
  type AddSurveyParams
} from '../controllers/survey/add-survey/add-survey-controller-protocols';
import {
  type LoadSurveys,
  type SurveyModel
} from '../controllers/survey/load-survey/load-survey-controller-protocols';

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyParams): Promise<void> {}
  }
  return new AddSurveyStub();
};

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return await Promise.resolve(mockSurveysModel());
    }
  }
  return new LoadSurveysStub();
};
