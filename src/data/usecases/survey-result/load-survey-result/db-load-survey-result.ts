import { type LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result';
import { type SurveyResultModel } from '../save-survey-result/db-save-survey-result-protocols';
import { type LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository';

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (private readonly loadSurveyResultRepository: LoadSurveyResultRepository) {}

  async load (surveyId: string): Promise<SurveyResultModel> {
    await this.loadSurveyResultRepository.loadBySurveyId(surveyId);
    return await Promise.resolve({
      surveyId: '',
      question: '',
      answers: [{
        image: '',
        answer: '',
        count: 0,
        percent: 0
      }],
      date: new Date()
    });
  }
}
