import { type LoadSurveyResult, type LoadSurveyResultRepository, type SurveyResultModel } from './db-load-survey-result-protocols';

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
